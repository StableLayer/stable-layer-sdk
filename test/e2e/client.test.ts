import { StableLayerClient } from "../../src/index.js";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { describe, it, expect, beforeAll } from "vitest";
import * as constants from "../../src/libs/constants.js";
import {
  BurnTransactionParams,
  ClaimTransactionParams,
  MintTransactionParams,
  StableCoinType,
} from "../../src//interface.js";

const testConfig = {
  network: "mainnet" as const,
  sender: "0x2b986d2381347d9e1c903167cf9b36da5f8eaba6f0db44e0c60e40ea312150ca",
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

  describe("buildMintTx", () => {
    it("should build a valid mint transaction", async () => {
      const tx = new Transaction();
      const params: MintTransactionParams = {
        tx,
        amount: BigInt(10),
        sender: testConfig.sender,
        usdcCoin: coinWithBalance({
          balance: BigInt(10),
          type: constants.USDC_TYPE,
        })(tx),
        autoTransfer: false,
        lpToken: "btcUSDC" as StableCoinType,
      };

      await sdk.buildMintTx(params);

      // Dev inspect the transaction to validate it's well-formed
      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: testConfig.sender,
      });
      // Should not have execution errors in the transaction structure
      expect(result.error).toBeUndefined();
      expect(result.effects.status.status).toBe("success");
    });

    it("should throw error when neither amount nor all is provided for burn", async () => {
      const tx = new Transaction();
      const params: BurnTransactionParams = {
        tx,
        lpToken: "btcUSDC",
        sender: testConfig.sender,
      };

      await expect(sdk.buildBurnTx(params)).rejects.toThrow(
        "Amount or all must be provided"
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
        lpToken: "btcUSDC" as StableCoinType,
      };

      await sdk.buildBurnTx(params);

      // Dev inspect the transaction
      try {
        const result = await suiClient.devInspectTransactionBlock({
          transactionBlock: tx,
          sender: testConfig.sender,
        });
        expect(result.error).toBeUndefined();
        expect(result.effects.status.status).toBe("success");
      } catch (error) {
        const balance = await suiClient.getBalance({
          owner: testConfig.sender,
          coinType: constants.BTC_USD_TYPE,
        });
        if (BigInt(balance.totalBalance) <= BigInt(10)) {
          expect((error as Error).message).toContain(
            `Not enough coins of type ${constants.BTC_USD_TYPE} to satisfy requested balance`
          );
        } else {
          expect((error as Error).message).toBeUndefined();
        }
      }
    });

    it("should build a valid burn transaction with all flag", async () => {
      const tx = new Transaction();
      const params: BurnTransactionParams = {
        tx,
        lpToken: "btcUSDC" as StableCoinType,
        all: true,
        sender: testConfig.sender,
      };

      await sdk.buildBurnTx(params);

      try {
        const result = await suiClient.devInspectTransactionBlock({
          transactionBlock: tx,
          sender: testConfig.sender,
        });
        expect(result.error).toBeUndefined();
        expect(result.effects.status.status).toBe("success");
      } catch (error) {
        const balance = await suiClient.getBalance({
          owner: testConfig.sender,
          coinType: constants.BTC_USD_TYPE,
        });
        if (BigInt(balance.totalBalance) <= BigInt(10)) {
          console.log(error);
          expect((error as Error).message).toBeDefined();
        } else {
          expect((error as Error).message).toBeUndefined();
        }
      }
    });
  });

  describe("buildClaimTx", () => {
    it("should build a valid claim transaction", async () => {
      const tx = new Transaction();
      const params: ClaimTransactionParams = {
        tx,
        lpToken: "btcUSDC" as StableCoinType,
        sender: testConfig.sender,
      };

      await sdk.buildClaimTx(params);

      // Dev inspect the transaction
      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: testConfig.sender,
      });

      expect(result.error).toBeUndefined();
      expect(result.effects.status.status).toBe("success");
    });
  });
});
