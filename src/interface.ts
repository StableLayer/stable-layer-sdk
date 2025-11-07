import { Transaction } from "@mysten/sui/transactions";
import { Network } from "@bucket-protocol/sdk";

export interface StableLayerConfig {
  network: Network;
  sender: string;
}

export interface MintTransactionParams {
  tx: Transaction;
  amount: bigint;
  sender?: string;
}

export interface BurnTransactionParams {
  tx: Transaction;
  amount?: bigint;
  all?: boolean;
  sender?: string;
}

export interface ClaimTransactionParams {
  tx: Transaction;
  sender?: string;
}
