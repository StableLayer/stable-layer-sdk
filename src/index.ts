import {
  coinWithBalance,
  Transaction,
  TransactionArgument,
} from "@mysten/sui/transactions";
import {
  mint,
  fulfillBurn,
  requestBurn,
} from "./generated/stable_layer/stable_factory";
import { receive, pay, claim } from "./generated/lake_usd_farm/lake_usd_farm";
import * as constants from "./libs/constants";
import { BucketClient } from "@bucket-protocol/sdk";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import {
  StableLayerConfig,
  MintTransactionParams,
  BurnTransactionParams,
  ClaimTransactionParams,
} from "./interface";

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
        factory: constants.STABLE_FACTORY,
        uCoin: usdcCoin,
      },
      typeArguments: [
        constants.BTC_USD_TYPE,
        constants.USDC_TYPE,
        constants.LAKE_USD_FARM_TYPE,
      ],
    })(tx);

    const [uPrice] = await this.bucketClient.aggregatePrices(tx, {
      coinTypes: [constants.USDC_TYPE],
    });

    const depositResponse = receive({
      package: constants.LAKE_FARM_PACKAGE_ID,
      typeArguments: [
        constants.LAKE_USDC_TYPE,
        constants.USDC_TYPE,
        constants.BTC_USD_TYPE,
        constants.SAVING_TYPE,
        constants.YUSDB_TYPE,
      ],
      arguments: {
        farm: constants.LAKE_USDC_FARM,
        loan,
        stableVault: constants.LAKE_USDC_VAULT,
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

    const burnRequest = requestBurn({
      package: constants.STABLE_LAYER_PACKAGE_ID,
      arguments: {
        factory: constants.STABLE_FACTORY,
        stableCoin: btcUsdCoin,
      },
      typeArguments: [constants.BTC_USD_TYPE, constants.USDC_TYPE],
    })(tx);

    const [uPrice] = await this.bucketClient.aggregatePrices(tx, {
      coinTypes: [constants.USDC_TYPE],
    });

    const withdrawResponse = pay({
      package: constants.LAKE_FARM_PACKAGE_ID,
      arguments: {
        farm: constants.LAKE_USDC_FARM,
        request: burnRequest,
        stableVault: constants.LAKE_USDC_VAULT,
        usdbTreasury: this.bucketClient.treasury(tx),
        psmPool: this.getBucketPSMPool(tx),
        savingPool: this.getBucketSavingPool(tx),
        yieldVault: constants.YIELD_VAULT,
        uPrice,
      },
      typeArguments: [
        constants.LAKE_USDC_TYPE,
        constants.USDC_TYPE,
        constants.BTC_USD_TYPE,
        constants.SAVING_TYPE,
        constants.YUSDB_TYPE,
      ],
    })(tx);

    this.checkResponse({ tx, response: withdrawResponse, type: "withdraw" });

    const usdcCoin = fulfillBurn({
      package: constants.STABLE_LAYER_PACKAGE_ID,
      arguments: {
        factory: constants.STABLE_FACTORY,
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

    const [uPrice] = await this.bucketClient.aggregatePrices(tx, {
      coinTypes: [constants.USDC_TYPE],
    });

    const [rewardCoin, withdrawResponse] = claim({
      package: constants.LAKE_FARM_PACKAGE_ID,
      arguments: {
        farm: constants.LAKE_USDC_FARM,
        stableFactory: constants.STABLE_FACTORY,
        accountRequest: this.bucketClient.newAccountRequest(tx, {}),
        stableVault: constants.LAKE_USDC_VAULT,
        usdbTreasury: this.bucketClient.treasury(tx),
        psmPool: this.getBucketPSMPool(tx),
        savingPool: this.getBucketSavingPool(tx),
        yieldVault: constants.YIELD_VAULT,
        uPrice,
      },
      typeArguments: [
        constants.LAKE_USDC_TYPE,
        constants.USDC_TYPE,
        constants.BTC_USD_TYPE,
        constants.SAVING_TYPE,
        constants.YUSDB_TYPE,
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
    let finalResponse: TransactionArgument;
    if (this.getBucketSavingPoolReward()) {
      if (type === "deposit") {
        finalResponse =
          this.bucketClient.updateSavingPoolIncentiveDepositAction(tx, {
            lpType: constants.SAVING_TYPE,
            depositResponse: response,
          });
      } else {
        finalResponse =
          this.bucketClient.updateSavingPoolIncentiveWithdrawAction(tx, {
            lpType: constants.SAVING_TYPE,
            withdrawResponse: response,
          });
      }
    } else {
      finalResponse = response;
    }

    if (type === "deposit") {
      return this.bucketClient.checkDepositResponse(tx, {
        lpType: constants.SAVING_TYPE,
        depositResponse: finalResponse,
      });
    } else {
      return this.bucketClient.checkWithdrawResponse(tx, {
        lpType: constants.SAVING_TYPE,
        withdrawResponse: finalResponse,
      });
    }
  }
}
