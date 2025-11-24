import {
  coinWithBalance,
  Transaction,
  TransactionArgument,
} from "@mysten/sui/transactions";

import * as constants from "./libs/constants";
import { BucketClient } from "@bucket-protocol/sdk";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import {
  StableLayerConfig,
  MintTransactionParams,
  BurnTransactionParams,
  ClaimTransactionParams,
} from "./interface";
import { release } from "./generated/yield_usdb/yield_usdb";
import {
  fulfillBurn,
  mint,
  requestBurn,
} from "./generated/stable_layer/stable_layer";
import {
  claim,
  pay,
  receive,
} from "./generated/stable_vault_farm/stable_vault_farm";

export class StableLayerSDK {
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
    amount,
    sender,
  }: MintTransactionParams): Promise<Transaction> {
    tx.setSender(sender ?? this.sender);

    const usdcCoin = coinWithBalance({
      balance: amount,
      type: constants.USDC_TYPE,
    });

    if (!usdcCoin) {
      throw new Error("No USDC found");
    }

    const [stableCoin, loan] = mint({
      package: constants.STABLE_LAYER_PACKAGE_ID,
      arguments: {
        registry: constants.STABLE_REGISTRY,
        uCoin: usdcCoin,
      },
      typeArguments: [
        constants.BTC_USD_TYPE,
        constants.USDC_TYPE,
        constants.STABLE_VAULT_FARM_ENTITY_TYPE,
      ],
    })(tx);

    const [uPrice] = await this.bucketClient.aggregatePrices(tx, {
      coinTypes: [constants.USDC_TYPE],
    });

    const depositResponse = receive({
      package: constants.STABLE_VAULT_FARM_PACKAGE_ID,
      typeArguments: [
        constants.STABLE_LP_TYPE,
        constants.USDC_TYPE,
        constants.BTC_USD_TYPE,
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

    tx.transferObjects([stableCoin], sender ?? this.sender);

    return tx;
  }

  async buildBurnTx({
    tx,
    amount,
    all,
    sender,
  }: BurnTransactionParams): Promise<Transaction> {
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
                coinType: constants.BTC_USD_TYPE,
              })
            ).totalBalance
          )
        : amount!,
      type: constants.BTC_USD_TYPE,
    })(tx);

    if (!btcUsdCoin) {
      throw new Error("No BTCUSD coin found");
    }

    this.releaseRewards(tx);

    const burnRequest = requestBurn({
      package: constants.STABLE_LAYER_PACKAGE_ID,
      arguments: {
        registry: constants.STABLE_REGISTRY,
        stableCoin: btcUsdCoin,
      },
      typeArguments: [constants.BTC_USD_TYPE, constants.USDC_TYPE],
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
        constants.BTC_USD_TYPE,
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
      typeArguments: [constants.BTC_USD_TYPE, constants.USDC_TYPE],
    })(tx);

    tx.transferObjects([usdcCoin], sender ?? this.sender);

    return tx;
  }

  async buildClaimTx({
    tx,
    sender,
  }: ClaimTransactionParams): Promise<Transaction> {
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
        constants.BTC_USD_TYPE,
        constants.YUSDB_TYPE,
        constants.SAVING_TYPE,
      ],
    })(tx);

    this.checkResponse({ tx, response: withdrawResponse, type: "withdraw" });

    tx.transferObjects([rewardCoin], sender ?? this.sender);

    return tx;
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

  private getBucketSavingPoolReward() {
    return this.bucketClient.getSavingPoolObjectInfo({
      lpType: constants.SAVING_TYPE,
    }).reward;
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
