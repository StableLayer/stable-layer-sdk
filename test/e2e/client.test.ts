import { SuiGrpcClient } from "@mysten/sui/grpc";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { beforeAll, describe, expect, it } from "vitest";

import { StableLayerClient } from "../../src/index.js";
import {
  BurnTransactionParams,
  ClaimTransactionParams,
  MintTransactionParams,
} from "../../src/interface.js";
import * as constants from "../../src/libs/constants.js";

const QUERY_OUTPUT = process.env.QUERY_OUTPUT === "1";
/** When set, assert manager preview USDB > 0 (depends on live rewards; off in CI by default). */
const E2E_ASSERT_POSITIVE = process.env.E2E_ASSERT_POSITIVE === "1";

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
const TEST_USDC_STABLE_TYPE =
  "0x71c0f8de08bffad0c234dc26c242d7fc06999e5c75897b67c15c259315789a4b::testusdc::TESTUSDC";
const TEST_ACCOUNT = "0x2b986d2381347d9e1c903167cf9b36da5f8eaba6f0db44e0c60e40ea312150ca";
const TESTUSDC_MANAGER_ADDRESS =
  "0x006d980cadd43c778e628201b45cfd3ba6e1047c65f67648a88f635108ffd6eb";
const TESTNET_TESTUSDC_STABLE_TYPE =
  "0x8d40b0c2d0fb3ad5797f273d44f2f4fea2612c7ecbd06e6015984654f52ff36d::testusdc::TESTUSDC";

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
      "throws when sender cannot complete claim dry-run (e.g. not factory manager)",
      { timeout: 45_000 },
      async () => {
        await expect(
          sdk.getClaimRewardUsdbAmount({
            stableCoinType: TEST_USDC_STABLE_TYPE,
            sender: TEST_ACCOUNT,
          }),
        ).rejects.toThrow(/dry-run did not succeed/);
        report("getClaimRewardUsdbAmount (non-manager)", { sender: TEST_ACCOUNT, rejected: true });
      },
    );

    it(
      "returns bigint USDB preview for TESTUSDC factory manager sender",
      { timeout: 45_000 },
      async () => {
        const amount = await sdk.getClaimRewardUsdbAmount({
          stableCoinType: TEST_USDC_STABLE_TYPE,
          sender: TESTUSDC_MANAGER_ADDRESS,
        });
        report("getClaimRewardUsdbAmount (TESTUSDC manager)", {
          sender: TESTUSDC_MANAGER_ADDRESS,
          amount: amount.toString(),
        });
        expect(typeof amount).toBe("bigint");
        expect(amount >= 0n).toBe(true);
        if (E2E_ASSERT_POSITIVE) {
          expect(amount > 0n).toBe(true);
        }
      },
    );
  });

  describe("StableLayerSDK (testnet mock farm)", () => {
    let testnetSdk: StableLayerClient;
    let testnetSui: SuiGrpcClient;

    beforeAll(async () => {
      testnetSdk = await StableLayerClient.initialize({
        network: "testnet",
        sender: TEST_ACCOUNT,
      });
      testnetSui = new SuiGrpcClient({
        network: "testnet",
        baseUrl: "https://fullnode.testnet.sui.io:443",
      });
    }, 60_000);

    it("throws when sender cannot complete mock-farm claim dry-run (e.g. not factory manager)", async () => {
      await expect(
        testnetSdk.getClaimRewardUsdbAmount({
          stableCoinType: TESTNET_TESTUSDC_STABLE_TYPE,
          sender: TEST_ACCOUNT,
        }),
      ).rejects.toThrow(/dry-run did not succeed/);
    });

    it("buildMintTx composes stable_layer::mint + mock_farm::receive", async () => {
      const tx = new Transaction();
      const usdc = StableLayerClient.getConstants("testnet").USDC_TYPE;
      const stableOut = await testnetSdk.buildMintTx({
        tx,
        amount: 1n,
        sender: TEST_ACCOUNT,
        stableCoinType: TESTNET_TESTUSDC_STABLE_TYPE,
        usdcCoin: coinWithBalance({ balance: 1n, type: usdc })(tx),
        autoTransfer: false,
      });
      expect(stableOut).toBeDefined();
    });

    it("buildBurnTx composes request_burn + mock_farm::pay + fulfill_burn", async () => {
      const tx = new Transaction();
      await testnetSdk.buildBurnTx({
        tx,
        stableCoinType: TESTNET_TESTUSDC_STABLE_TYPE,
        amount: 1n,
        sender: TEST_ACCOUNT,
      });
    });

    it("buildClaimTx composes mock_farm::claim (non-manager dry-run fails)", async () => {
      const tx = new Transaction();
      await testnetSdk.buildClaimTx({
        tx,
        stableCoinType: TESTNET_TESTUSDC_STABLE_TYPE,
        sender: TEST_ACCOUNT,
      });

      const result = await testnetSui.simulateTransaction({
        transaction: tx,
        include: { balanceChanges: true },
      });
      report("testnet buildClaimTx", { simulate: extractSimulateSummary(result) });
      expect(result.$kind).toBe("FailedTransaction");
    });
  });
});
