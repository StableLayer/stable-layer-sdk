import { BucketClient } from "@bucket-protocol/sdk";
import { bcs } from "@mysten/sui/bcs";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { coinWithBalance, Transaction, TransactionArgument } from "@mysten/sui/transactions";

import { fulfillBurn, mint, requestBurn } from "./generated/stable_layer/stable_layer.js";
import { claim, pay, receive } from "./generated/stable_vault_farm/stable_vault_farm.js";
import { release } from "./generated/yield_usdb/yield_usdb.js";
import {
  BurnTransactionParams,
  ClaimTransactionParams,
  CoinResult,
  MintTransactionParams,
  StableLayerConfig,
} from "./interface.js";
import * as constants from "./libs/constants.js";

export class StableLayerClient {
  private bucketClient: BucketClient;
  private suiClient: SuiGrpcClient;
  private sender: string;

  constructor(config: StableLayerConfig) {
    this.bucketClient = new BucketClient({ network: config.network });
    this.suiClient = new SuiGrpcClient({
      network: config.network,
      baseUrl: `https://fullnode.${config.network}.sui.io:443`,
    });
    this.sender = config.sender;
  }

  async buildMintTx({
    tx,
    stableCoinType,
    usdcCoin,
    sender,
    autoTransfer = true,
  }: MintTransactionParams): Promise<CoinResult | undefined> {
    tx.setSender(sender ?? this.sender);

    const [stableCoin, loan] = mint({
      package: constants.STABLE_LAYER_PACKAGE_ID,
      arguments: {
        registry: constants.STABLE_REGISTRY,
        uCoin: usdcCoin,
      },
      typeArguments: [stableCoinType, constants.USDC_TYPE, constants.STABLE_VAULT_FARM_ENTITY_TYPE],
    })(tx);

    const [uPrice] = await this.bucketClient.aggregatePrices(tx, {
      coinTypes: [constants.USDC_TYPE],
    });

    const depositResponse = receive({
      package: constants.STABLE_VAULT_FARM_PACKAGE_ID,
      typeArguments: [
        constants.STABLE_LP_TYPE,
        constants.USDC_TYPE,
        stableCoinType,
        constants.YUSDB_TYPE,
        constants.SAVING_TYPE,
      ],
      arguments: {
        farm: constants.STABLE_VAULT_FARM,
        loan,
        stableVault: constants.STABLE_VAULT,
        usdbTreasury: this.bucketClient.treasury(tx),
        psmPool: this.getBucketPSMPool(tx),
        savingPool: this.getBucketSavingPool(tx),
        yieldVault: constants.YIELD_VAULT,
        uPrice,
      },
    })(tx);

    this.checkResponse({ tx, response: depositResponse, type: "deposit" });

    if (autoTransfer) {
      tx.transferObjects([stableCoin], sender ?? this.sender);
      return;
    } else {
      return stableCoin;
    }
  }

  async buildBurnTx({
    tx,
    stableCoinType,
    amount,
    all,
    sender,
    autoTransfer = true,
  }: BurnTransactionParams): Promise<CoinResult | undefined> {
    tx.setSender(sender ?? this.sender);

    if (!all && !amount) {
      throw new Error("Amount or all must be provided");
    }
    const btcUsdCoin = coinWithBalance({
      balance: all
        ? BigInt(
            (
              await this.suiClient.getBalance({
                owner: sender ?? this.sender,
                coinType: stableCoinType,
              })
            ).balance.balance,
          )
        : amount!,
      type: stableCoinType,
    });
    this.releaseRewards(tx);

    const burnRequest = requestBurn({
      package: constants.STABLE_LAYER_PACKAGE_ID,
      arguments: {
        registry: constants.STABLE_REGISTRY,
        stableCoin: btcUsdCoin,
      },
      typeArguments: [stableCoinType, constants.USDC_TYPE],
    })(tx);

    const [uPrice] = await this.bucketClient.aggregatePrices(tx, {
      coinTypes: [constants.USDC_TYPE],
    });

    const withdrawResponse = pay({
      package: constants.STABLE_VAULT_FARM_PACKAGE_ID,
      arguments: {
        farm: constants.STABLE_VAULT_FARM,
        request: burnRequest,
        stableVault: constants.STABLE_VAULT,
        usdbTreasury: this.bucketClient.treasury(tx),
        psmPool: this.getBucketPSMPool(tx),
        savingPool: this.getBucketSavingPool(tx),
        yieldVault: constants.YIELD_VAULT,
        uPrice,
      },
      typeArguments: [
        constants.STABLE_LP_TYPE,
        constants.USDC_TYPE,
        stableCoinType,
        constants.YUSDB_TYPE,
        constants.SAVING_TYPE,
      ],
    })(tx);

    this.checkResponse({ tx, response: withdrawResponse, type: "withdraw" });

    const usdcCoin = fulfillBurn({
      package: constants.STABLE_LAYER_PACKAGE_ID,
      arguments: {
        registry: constants.STABLE_REGISTRY,
        burnRequest,
      },
      typeArguments: [stableCoinType, constants.USDC_TYPE],
    })(tx);

    if (autoTransfer) {
      tx.transferObjects([usdcCoin], sender ?? this.sender);
      return;
    } else {
      return usdcCoin;
    }
  }

  async buildClaimTx({
    tx,
    stableCoinType,
    sender,
    autoTransfer = true,
  }: ClaimTransactionParams): Promise<CoinResult | undefined> {
    tx.setSender(sender ?? this.sender);

    this.releaseRewards(tx);

    const [rewardCoin, withdrawResponse] = claim({
      package: constants.STABLE_VAULT_FARM_PACKAGE_ID,
      arguments: {
        stableRegistry: constants.STABLE_REGISTRY,
        farm: constants.STABLE_VAULT_FARM,
        stableVault: constants.STABLE_VAULT,
        usdbTreasury: this.bucketClient.treasury(tx),
        savingPool: this.getBucketSavingPool(tx),
        yieldVault: constants.YIELD_VAULT,
      },
      typeArguments: [
        constants.STABLE_LP_TYPE,
        constants.USDC_TYPE,
        stableCoinType,
        constants.YUSDB_TYPE,
        constants.SAVING_TYPE,
      ],
    })(tx);

    this.checkResponse({ tx, response: withdrawResponse, type: "withdraw" });

    if (autoTransfer) {
      tx.transferObjects([rewardCoin], sender ?? this.sender);
      return;
    } else {
      return rewardCoin;
    }
  }

  async getTotalSupply(): Promise<string | undefined> {
    const result = await this.suiClient.getObject({
      objectId: constants.STABLE_REGISTRY,
      include: { json: true },
    });

    const json = result.object.json as { total_supply?: string } | null;
    return json?.total_supply ?? undefined;
  }

  async getTotalSupplyByCoinType(stableCoinType: string): Promise<string | undefined> {
    const TypeName = bcs.struct("TypeName", { name: bcs.string() });
    const nameBcs = TypeName.serialize({ name: stableCoinType.slice(2) }).toBytes();

    const result = await this.suiClient.core.getDynamicObjectField({
      parentId: constants.STABLE_REGISTRY,
      name: {
        type: "0x1::type_name::TypeName",
        bcs: nameBcs,
      },
      include: { json: true },
    });

    const json = result.object.json as {
      treasury_cap?: { total_supply?: { value?: string } };
    } | null;
    return json?.treasury_cap?.total_supply?.value ?? undefined;
  }

  private getBucketSavingPool(tx: Transaction) {
    return this.bucketClient.savingPoolObj(tx, {
      lpType: constants.SAVING_TYPE,
    });
  }

  private getBucketPSMPool(tx: Transaction) {
    return this.bucketClient.psmPoolObj(tx, {
      coinType: constants.USDC_TYPE,
    });
  }

  private checkResponse({
    tx,
    response,
    type,
  }: {
    tx: Transaction;
    response: TransactionArgument;
    type: "deposit" | "withdraw";
  }) {
    if (type === "deposit") {
      return this.bucketClient.checkDepositResponse(tx, {
        lpType: constants.SAVING_TYPE,
        depositResponse: response,
      });
    } else {
      return this.bucketClient.checkWithdrawResponse(tx, {
        lpType: constants.SAVING_TYPE,
        withdrawResponse: response,
      });
    }
  }

  private releaseRewards(tx: Transaction) {
    const depositResponse = release({
      package: constants.YIELD_USDB_PACKAGE_ID,
      arguments: {
        vault: constants.YIELD_VAULT,
        treasury: this.bucketClient.treasury(tx),
        savingPool: this.bucketClient.savingPoolObj(tx, {
          lpType: constants.SAVING_TYPE,
        }),
      },
      typeArguments: [constants.YUSDB_TYPE, constants.SAVING_TYPE],
    })(tx);

    this.bucketClient.checkDepositResponse(tx, {
      depositResponse,
      lpType: constants.SAVING_TYPE,
    });
  }
}
