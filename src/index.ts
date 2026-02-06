import {
  coinWithBalance,
  Transaction,
  TransactionArgument,
  TransactionResult,
} from "@mysten/sui/transactions";

import * as constants from "./libs/constants.js";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import {
  StableLayerConfig,
  MintTransactionParams,
  BurnTransactionParams,
  ClaimTransactionParams,
  CoinResult,
} from "./interface.js";
import { release } from "./generated/yield_usdb/yield_usdb.js";
import {
  fulfillBurn,
  mint,
  requestBurn,
} from "./generated/stable_layer/stable_layer.js";
import {
  claim,
  pay,
  receive,
} from "./generated/stable_vault_farm/stable_vault_farm.js";
import { STABLE_REGISTRY } from "./libs/constants.js";
import { BucketClient } from "@bucket-protocol/sdk";

export class StableLayerClient {
  private bucketClient: BucketClient;
  private suiClient: SuiClient;
  private sender: string;

  constructor(config: StableLayerConfig) {
    this.bucketClient = new BucketClient({ network: config.network });
    this.suiClient = new SuiClient({ url: getFullnodeUrl(config.network) });
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
      typeArguments: [
        stableCoinType,
        constants.USDC_TYPE,
        constants.STABLE_VAULT_FARM_ENTITY_TYPE,
      ],
    })(tx);

    const [uPrice] = await this.bucketClient.aggregatePrices(tx as any, {
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
        usdbTreasury: this.bucketClient.treasury(tx as any),
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
            ).totalBalance,
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

    const [uPrice] = await this.bucketClient.aggregatePrices(tx as any, {
      coinTypes: [constants.USDC_TYPE],
    });

    const withdrawResponse = pay({
      package: constants.STABLE_VAULT_FARM_PACKAGE_ID,
      arguments: {
        farm: constants.STABLE_VAULT_FARM,
        request: burnRequest,
        stableVault: constants.STABLE_VAULT,
        usdbTreasury: this.bucketClient.treasury(tx as any),
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
        usdbTreasury: this.bucketClient.treasury(tx as any),
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
      id: constants.STABLE_REGISTRY,
      options: {
        showContent: true,
      },
    });

    const content = result.data?.content as
      | {
          fields: {
            total_supply: string;
          };
        }
      | undefined;

    return content?.fields?.total_supply;
  }

  async getTotalSupplyByCoinType(
    stableCoinType: string,
  ): Promise<string | undefined> {
    const result = await this.suiClient.getDynamicFieldObject({
      parentId: STABLE_REGISTRY,
      name: {
        type: "0x1::type_name::TypeName",
        value: {
          name: stableCoinType.slice(2),
        },
      },
    });
    const content = result.data?.content as
      | {
          fields: {
            treasury_cap: {
              fields: {
                total_supply: { fields: { value: string } };
              };
            };
          };
        }
      | undefined;
    return content?.fields?.treasury_cap?.fields?.total_supply?.fields?.value;
  }

  private getBucketSavingPool(tx: Transaction) {
    return this.bucketClient.savingPoolObj(tx as any, {
      lpType: constants.SAVING_TYPE,
    });
  }

  private getBucketPSMPool(tx: Transaction) {
    return this.bucketClient.psmPoolObj(tx as any, {
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
      return this.bucketClient.checkDepositResponse(tx as any, {
        lpType: constants.SAVING_TYPE,
        depositResponse: response as any,
      });
    } else {
      return this.bucketClient.checkWithdrawResponse(tx as any, {
        lpType: constants.SAVING_TYPE,
        withdrawResponse: response as any,
      });
    }
  }

  private releaseRewards(tx: Transaction) {
    const depositResponse = release({
      package: constants.YIELD_USDB_PACKAGE_ID,
      arguments: {
        vault: constants.YIELD_VAULT,
        treasury: this.bucketClient.treasury(tx as any),
        savingPool: this.bucketClient.savingPoolObj(tx as any, {
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
