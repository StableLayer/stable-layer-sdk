import { Transaction, TransactionArgument, TransactionResult } from "@mysten/sui/transactions";

export interface StableLayerConfig {
  network: "mainnet" | "testnet";
  sender: string;
}

export interface MintTransactionParams {
  tx: Transaction;
  lpToken: StableCoinType;
  usdcCoin: TransactionArgument;
  amount: bigint;
  sender?: string;
  autoTransfer?: boolean;
}

export interface BurnTransactionParams {
  tx: Transaction;
  lpToken: StableCoinType;
  amount?: bigint;
  all?: boolean;
  sender?: string;
  autoTransfer?: boolean;
}

export interface ClaimTransactionParams {
  tx: Transaction;
  lpToken: StableCoinType;
  sender?: string;
  autoTransfer?: boolean;
}

export type StableCoinType = "btcUSDC";

export type CoinResult = TransactionResult | TransactionResult[number];
