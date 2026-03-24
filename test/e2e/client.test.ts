import { SuiGrpcClient } from "@mysten/sui/grpc";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { beforeAll, describe, expect, it } from "vitest";

import {
  BurnTransactionParams,
  ClaimTransactionParams,
  MintTransactionParams,
} from "../../src/interface.js";
import { StableLayerClient } from "../../src/index.js";
import * as constants from "../../src/libs/constants.js";

const QUERY_OUTPUT = process.env.QUERY_OUTPUT === "1";

function report(label: string, value: unknown) {
  if (QUERY_OUTPUT) {
    console.log(
      `\n[Query Output] ${label}:`,
      JSON.stringify(value, (_, v) => (typeof v === "bigint" ? v.toString() : v), 2),
    );
  }
}

function extractSimulateSummary(result: {
  $kind: string;
  Transaction?: { digest?: string; status?: unknown; balanceChanges?: unknown[] };
  FailedTransaction?: { digest?: string; status?: unknown; balanceChanges?: unknown[] };
}) {
  const tx = result.$kind === "Transaction" ? result.Transaction : result.FailedTransaction;
  if (!tx) return { success: false, $kind: result.$kind };
  return {
    success: result.$kind === "Transaction",
    status: tx.status,
    digest: "digest" in tx ? tx.digest : undefined,
    balanceChangeCount: tx.balanceChanges?.length ?? 0,
    balanceChanges: tx.balanceChanges,
  };
}

const BTC_USD_TYPE =
  "0x6d9fc33611f4881a3f5c0cd4899d95a862236ce52b3a38fef039077b0c5b5834::btc_usdc::BtcUSDC";
const TEST_ACCOUNT = "0x2b986d2381347d9e1c903167cf9b36da5f8eaba6f0db44e0c60e40ea312150ca";

const testConfig = {
  network: "mainnet" as const,
  sender: TEST_ACCOUNT,
};

describe("StableLayerSDK", () => {
  let sdk: StableLayerClient;
  let suiClient: SuiGrpcClient;

  beforeAll(async () => {
    sdk = await StableLayerClient.initialize(testConfig);
    suiClient = new SuiGrpcClient({
      network: "mainnet",
      baseUrl: "https://fullnode.mainnet.sui.io:443",
    });
  });

  describe("constructor", () => {
    it("should initialize with correct config", () => {
      expect(sdk).toBeInstanceOf(StableLayerClient);
    });
  });

  describe("getTotalSupply", () => {
    it("should return a total supply greater than 0", async () => {
      const totalSupply = await sdk.getTotalSupply();
      report("getTotalSupply", { totalSupply });
      expect(Number(totalSupply)).toBeGreaterThan(0);
    });
  });

  describe("getTotalSupplyByCoinType", () => {
    it("should has total supply for BTC USDC", async () => {
      const totalSupply = await sdk.getTotalSupplyByCoinType(BTC_USD_TYPE);
      report("getTotalSupplyByCoinType", { coinType: BTC_USD_TYPE, totalSupply });
      expect(Number(totalSupply)).toBeGreaterThan(1000);
    });
  });

  describe("buildMintTx", () => {
    it("should build a valid mint transaction", async () => {
      const tx = new Transaction();
      tx.setSender(TEST_ACCOUNT);
      const params: MintTransactionParams = {
        tx,
        amount: BigInt(10),
        sender: testConfig.sender,
        usdcCoin: coinWithBalance({
          balance: BigInt(10),
          type: constants.USDC_TYPE,
        })(tx),
        autoTransfer: false,
        stableCoinType: BTC_USD_TYPE,
      };

      const btcUsdcCoin = await sdk.buildMintTx(params);
      expect(btcUsdcCoin).toBeDefined();
      if (btcUsdcCoin) tx.transferObjects([btcUsdcCoin], TEST_ACCOUNT);

      // Dev inspect the transaction to validate it's well-formed
      const result = await suiClient.simulateTransaction({
        transaction: tx,
        include: { balanceChanges: true },
      });
      report("buildMintTx", {
        returnedCoin: btcUsdcCoin != null,
        simulate: extractSimulateSummary(result),
      });
      expect(result.$kind).toBe("Transaction");
    });

    it("should throw error when neither amount nor all is provided for burn", async () => {
      const tx = new Transaction();
      const params: BurnTransactionParams = {
        tx,
        stableCoinType: BTC_USD_TYPE,
        sender: testConfig.sender,
      };

      await expect(sdk.buildBurnTx(params)).rejects.toThrow("Amount or all must be provided");
    });
  });

  describe("buildBurnTx", () => {
    it("should build a valid burn transaction with amount", async () => {
      const tx = new Transaction();
      const params: BurnTransactionParams = {
        tx,
        amount: BigInt(10),
        sender: testConfig.sender,
        stableCoinType: BTC_USD_TYPE,
      };

      await sdk.buildBurnTx(params);

      const result = await suiClient.simulateTransaction({
        transaction: tx,
        include: { balanceChanges: true },
      });
      report("buildBurnTx (amount)", { simulate: extractSimulateSummary(result) });
      expect(result.$kind).toBe("Transaction");
    });

    it("should build a valid burn transaction with all flag", async () => {
      const tx = new Transaction();
      const params: BurnTransactionParams = {
        tx,
        stableCoinType: BTC_USD_TYPE,
        all: true,
        sender: testConfig.sender,
      };

      await sdk.buildBurnTx(params);

      const result = await suiClient.simulateTransaction({
        transaction: tx,
        include: { balanceChanges: true },
      });
      report("buildBurnTx (all)", { simulate: extractSimulateSummary(result) });
      expect(result.$kind).toBe("Transaction");
    });
  });

  describe("buildClaimTx", () => {
    it("should build a valid claim transaction", async () => {
      const tx = new Transaction();
      const params: ClaimTransactionParams = {
        tx,
        stableCoinType: BTC_USD_TYPE,
        sender: testConfig.sender,
      };

      await sdk.buildClaimTx(params);

      const result = await suiClient.simulateTransaction({
        transaction: tx,
        include: { balanceChanges: true },
      });
      report("buildClaimTx", { simulate: extractSimulateSummary(result) });
      expect(result.$kind).toBe("Transaction");
    });
  });

  describe("getClaimRewardUsdbAmount", () => {
    it(
      "should return a bigint from mainnet simulation",
      { timeout: 45_000 },
      async () => {
        const amount = await sdk.getClaimRewardUsdbAmount({
          stableCoinType: BTC_USD_TYPE,
          sender: testConfig.sender,
        });
        report("getClaimRewardUsdbAmount (mainnet)", { amount: amount.toString() });
        expect(typeof amount).toBe("bigint");
        expect(amount >= 0n).toBe(true);
      },
    );

  });

  describe("getClaimRewardUsdbAmount (testnet)", () => {
    let testnetSdk: StableLayerClient;

    beforeAll(async () => {
      testnetSdk = await StableLayerClient.initialize({
        network: "testnet",
        sender: TEST_ACCOUNT,
      });
    }, 60_000);

    it("returns 0n without running claim simulation", async () => {
      const amount = await testnetSdk.getClaimRewardUsdbAmount({
        stableCoinType: BTC_USD_TYPE,
        sender: TEST_ACCOUNT,
      });
      expect(amount).toBe(0n);
    });
  });
});
