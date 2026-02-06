import { StableLayerClient } from "../../src/index.js";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { describe, it, expect, beforeAll } from "vitest";
import * as constants from "../../src/libs/constants.js";
import {
  BurnTransactionParams,
  ClaimTransactionParams,
  MintTransactionParams,
} from "../../src//interface.js";
import { toBase64 } from "@mysten/bcs";

const BTC_USD_TYPE =
  "0x6d9fc33611f4881a3f5c0cd4899d95a862236ce52b3a38fef039077b0c5b5834::btc_usdc::BtcUSDC";
const TEST_ACCOUNT =
  "0x2b986d2381347d9e1c903167cf9b36da5f8eaba6f0db44e0c60e40ea312150ca";

const testConfig = {
  network: "mainnet" as const,
  sender: TEST_ACCOUNT,
};

describe("StableLayerSDK", () => {
  let sdk: StableLayerClient;
  let suiClient: SuiClient;

  beforeAll(() => {
    sdk = new StableLayerClient(testConfig);
    suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });
  });

  describe("constructor", () => {
    it("should initialize with correct config", () => {
      expect(sdk).toBeInstanceOf(StableLayerClient);
    });
  });

  describe("getTotalSupplyByCoinType", () => {
    it("should has total supply for BTC USDC", async () => {
      expect(
        Number(await sdk.getTotalSupplyByCoinType(BTC_USD_TYPE)),
      ).toBeGreaterThan(1000);
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
      const result = await suiClient.dryRunTransactionBlock({
        transactionBlock: await tx.build({ client: suiClient }),
      });
      // Should not have execution errors in the transaction structure
      expect(result.effects.status.status).toBe("success");
    });

    it("should throw error when neither amount nor all is provided for burn", async () => {
      const tx = new Transaction();
      const params: BurnTransactionParams = {
        tx,
        stableCoinType: BTC_USD_TYPE,
        sender: testConfig.sender,
      };

      await expect(sdk.buildBurnTx(params)).rejects.toThrow(
        "Amount or all must be provided",
      );
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

      // Dev inspect the transaction
      const result = await suiClient.dryRunTransactionBlock({
        transactionBlock: await tx.build({ client: suiClient }),
      });
      expect(result.effects.status.status).toBe("success");
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

      const result = await suiClient.dryRunTransactionBlock({
        transactionBlock: await tx.build({ client: suiClient }),
      });
      expect(result.effects.status.status).toBe("success");
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

      const result = await suiClient.dryRunTransactionBlock({
        transactionBlock: await tx.build({ client: suiClient }),
      });
      expect(result.effects.status.status).toBe("success");
    });
  });
});
