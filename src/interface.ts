import { Transaction } from "@mysten/sui/transactions";
import { Network } from "@bucket-protocol/sdk";

export interface StableLayerConfig {
  network: Network;
  sender: string;
}

export interface MintTransactionParams {
  tx: Transaction;
  coinName: StableCoinType;
  amount: bigint;
  sender?: string;
}

export interface BurnTransactionParams {
  tx: Transaction;
  coinName: StableCoinType;
  amount?: bigint;
  all?: boolean;
  sender?: string;
}

export interface ClaimTransactionParams {
  tx: Transaction;
  coinName: StableCoinType;
  sender?: string;
}

export type StableCoinType = "BTC_USD";
