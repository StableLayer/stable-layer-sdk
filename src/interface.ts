import {
  Transaction,
  TransactionArgument,
  TransactionResult,
} from "@mysten/sui/transactions";

export interface StableLayerConfig {
  network: "mainnet" | "testnet";
  sender: string;
}

export interface MintTransactionParams {
  tx: Transaction;
  stableCoinType: string;
  usdcCoin: TransactionArgument;
  amount: bigint;
  sender?: string;
  autoTransfer?: boolean;
}

export interface BurnTransactionParams {
  tx: Transaction;
  stableCoinType: string;
  amount?: bigint;
  all?: boolean;
  sender?: string;
  autoTransfer?: boolean;
}

export interface ClaimTransactionParams {
  tx: Transaction;
  stableCoinType: string;
  sender?: string;
  autoTransfer?: boolean;
}

export type CoinResult = TransactionResult | TransactionResult[number];
