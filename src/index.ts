import { BucketClient } from "@bucket-protocol/sdk";
import { bcs } from "@mysten/sui/bcs";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { coinWithBalance, Transaction, TransactionArgument } from "@mysten/sui/transactions";
import { normalizeStructTag } from "@mysten/sui/utils";

import {
  fulfillBurn,
  mint,
  requestBurn,
  setMaxSupply,
} from "./generated/stable_layer/stable_layer.js";
import { claim, pay, receive } from "./generated/stable_vault_farm/stable_vault_farm.js";
import { release } from "./generated/yield_usdb/yield_usdb.js";
import {
  BurnTransactionParams,
  ClaimRewardUsdbAmountParams,
  ClaimTransactionParams,
  CoinResult,
  MintTransactionParams,
  SetMaxSupplyTransactionParams,
  StableLayerConfig,
} from "./interface.js";
import { getConstants } from "./libs/constants.js";

export class StableLayerClient {
  private bucketClient: BucketClient;
  private suiClient: SuiGrpcClient;
  private sender: string;
  private network: import("./interface.js").Network;

  static getConstants(network: import("./interface.js").Network) {
    return getConstants(network);
  }

  getConstants() {
    return getConstants(this.network);
  }

  static async initialize(config: StableLayerConfig): Promise<StableLayerClient> {
    const defaultBaseUrl = `https://fullnode.${config.network}.sui.io:443`;
    const baseUrl = config.baseUrl ?? process.env.SUI_GRPC_URL ?? defaultBaseUrl;
    const suiClient =
      config.suiClient ??
      new SuiGrpcClient({
        network: config.network,
        baseUrl,
      });
    const bucketClient = await BucketClient.initialize({
      network: config.network,
      suiClient,
      configObjectId: config.configObjectId,
      configOverrides: config.configOverrides,
    });
    return new StableLayerClient(config, bucketClient, suiClient);
  }

  private constructor(
    config: StableLayerConfig,
    bucketClient: BucketClient,
    suiClient: SuiGrpcClient,
  ) {
    this.bucketClient = bucketClient;
    this.suiClient = suiClient;
    this.sender = config.sender;
    this.network = config.network;
  }

  async buildMintTx({
    tx,
    stableCoinType,
    usdcCoin,
    sender,
    autoTransfer = true,
  }: MintTransactionParams): Promise<CoinResult | undefined> {
    if (this.network === "testnet") {
      throw new Error(
        "buildMintTx is mainnet-only. Testnet uses DummyFarm and does not have vault farm. " +
          "Use buildSetMaxSupplyTx, getTotalSupply, or getTotalSupplyByCoinType for testnet.",
      );
    }
    tx.setSender(sender ?? this.sender);
    const constants = this.getConstants();

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
        usdbTreasury: await Promise.resolve(this.bucketClient.treasury(tx)),
        psmPool: await this.getBucketPSMPool(tx),
        savingPool: await this.getBucketSavingPool(tx),
        yieldVault: constants.YIELD_VAULT,
        uPrice,
      },
    })(tx);

    await this.checkResponse({ tx, response: depositResponse, type: "deposit" });

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
    if (this.network === "testnet") {
      throw new Error(
        "buildBurnTx is mainnet-only. Testnet uses DummyFarm and does not have vault farm. " +
          "Use buildSetMaxSupplyTx, getTotalSupply, or getTotalSupplyByCoinType for testnet.",
      );
    }
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
    await this.releaseRewards(tx);

    const constants = this.getConstants();
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
        usdbTreasury: await Promise.resolve(this.bucketClient.treasury(tx)),
        psmPool: await this.getBucketPSMPool(tx),
        savingPool: await this.getBucketSavingPool(tx),
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

    await this.checkResponse({ tx, response: withdrawResponse, type: "withdraw" });

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
    if (this.network === "testnet") {
      throw new Error(
        "buildClaimTx is mainnet-only. Testnet uses DummyFarm and does not have yield vault. " +
          "Use buildSetMaxSupplyTx, getTotalSupply, or getTotalSupplyByCoinType for testnet.",
      );
    }
    tx.setSender(sender ?? this.sender);

    await this.releaseRewards(tx);

    const constants = this.getConstants();
    const [rewardCoin, withdrawResponse] = claim({
      package: constants.STABLE_VAULT_FARM_PACKAGE_ID,
      arguments: {
        stableRegistry: constants.STABLE_REGISTRY,
        farm: constants.STABLE_VAULT_FARM,
        stableVault: constants.STABLE_VAULT,
        usdbTreasury: await Promise.resolve(this.bucketClient.treasury(tx)),
        savingPool: await this.getBucketSavingPool(tx),
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

    await this.checkResponse({ tx, response: withdrawResponse, type: "withdraw" });

    if (autoTransfer) {
      tx.transferObjects([rewardCoin], sender ?? this.sender);
      return;
    } else {
      return rewardCoin;
    }
  }

  /**
   * Preview how much Bucket USDB `sender` would receive from {@link buildClaimTx} with
   * `autoTransfer: true`, by dry-running the same PTB and summing positive USDB balance
   * deltas for `sender`. Returns `0n` when simulation fails (e.g. not a factory manager,
   * nothing to claim). Mainnet only; testnet returns `0n`.
   */
  async getClaimRewardUsdbAmount({
    stableCoinType,
    sender,
  }: ClaimRewardUsdbAmountParams): Promise<bigint> {
    if (this.network === "testnet") {
      return 0n;
    }

    const tx = new Transaction();
    await this.buildClaimTx({
      tx,
      stableCoinType,
      sender,
      autoTransfer: true,
    });

    const usdbType = normalizeStructTag(await this.bucketClient.getUsdbCoinType());
    const res = await this.suiClient.simulateTransaction({
      transaction: tx,
      include: { balanceChanges: true },
    });

    if (res.$kind !== "Transaction") {
      return 0n;
    }

    const changes = res.Transaction?.balanceChanges ?? [];
    const addr = sender.toLowerCase();
    let sum = 0n;
    for (const bc of changes) {
      if (bc.address.toLowerCase() !== addr) continue;
      if (normalizeStructTag(bc.coinType) !== usdbType) continue;
      const amt = BigInt(bc.amount);
      if (amt > 0n) sum += amt;
    }
    return sum;
  }

  buildSetMaxSupplyTx({
    tx,
    registry,
    factoryCapId,
    maxSupply,
    stableCoinType,
    usdCoinType,
    sender,
  }: SetMaxSupplyTransactionParams): void {
    tx.setSender(sender ?? this.sender);
    const constants = this.getConstants();

    setMaxSupply({
      package: constants.STABLE_LAYER_PACKAGE_ID,
      arguments: {
        registry,
        FactoryCap: factoryCapId,
        maxSupply,
      },
      typeArguments: [stableCoinType, usdCoinType],
    })(tx);
  }

  async getTotalSupply(): Promise<string | undefined> {
    const constants = this.getConstants();
    const result = await this.suiClient.getObject({
      objectId: constants.STABLE_REGISTRY,
      include: { json: true },
    });

    const json = result.object?.json as { total_supply?: string } | null | undefined;
    return json?.total_supply ?? undefined;
  }

  async getTotalSupplyByCoinType(stableCoinType: string): Promise<string | undefined> {
    const TypeName = bcs.struct("TypeName", { name: bcs.string() });
    const nameBcs = TypeName.serialize({ name: stableCoinType.slice(2) }).toBytes();

    const constants = this.getConstants();
    const result = await this.suiClient.core.getDynamicObjectField({
      parentId: constants.STABLE_REGISTRY,
      name: {
        type: "0x1::type_name::TypeName",
        bcs: nameBcs,
      },
      include: { json: true },
    });

    const json = result.object?.json as
      | { treasury_cap?: { total_supply?: { value?: string } } }
      | null
      | undefined;
    return json?.treasury_cap?.total_supply?.value ?? undefined;
  }

  private async getBucketSavingPool(tx: Transaction) {
    return Promise.resolve(
      this.bucketClient.savingPoolObj(tx, { lpType: this.getConstants().SAVING_TYPE }),
    );
  }

  private async getBucketPSMPool(tx: Transaction) {
    return Promise.resolve(
      this.bucketClient.psmPoolObj(tx, { coinType: this.getConstants().USDC_TYPE }),
    );
  }

  private async checkResponse({
    tx,
    response,
    type,
  }: {
    tx: Transaction;
    response: TransactionArgument;
    type: "deposit" | "withdraw";
  }) {
    const lpType = this.getConstants().SAVING_TYPE;
    if (type === "deposit") {
      return Promise.resolve(
        this.bucketClient.checkDepositResponse(tx, {
          lpType,
          depositResponse: response,
        }),
      );
    } else {
      return Promise.resolve(
        this.bucketClient.checkWithdrawResponse(tx, {
          lpType,
          withdrawResponse: response,
        }),
      );
    }
  }

  private async releaseRewards(tx: Transaction) {
    const constants = this.getConstants();
    const depositResponse = release({
      package: constants.YIELD_USDB_PACKAGE_ID,
      arguments: {
        vault: constants.YIELD_VAULT,
        treasury: await Promise.resolve(this.bucketClient.treasury(tx)),
        savingPool: await Promise.resolve(
          this.bucketClient.savingPoolObj(tx, { lpType: constants.SAVING_TYPE }),
        ),
      },
      typeArguments: [constants.YUSDB_TYPE, constants.SAVING_TYPE],
    })(tx);

    await Promise.resolve(
      this.bucketClient.checkDepositResponse(tx, {
        depositResponse,
        lpType: constants.SAVING_TYPE,
      }),
    );
  }
}

export * from "./libs/constants.js";
export {
  STABLE_REGISTRY_MAINNET_ALT,
  STABLE_LAYER_PACKAGE_MAINNET_ALT,
} from "./libs/constants.mainnet.js";
export type {
  ClaimRewardUsdbAmountParams,
  SetMaxSupplyTransactionParams,
} from "./interface.js";
