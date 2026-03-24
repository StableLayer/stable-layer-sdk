import type { ConfigType } from "@bucket-protocol/sdk";
import type { SuiGrpcClient } from "@mysten/sui/grpc";
import { Transaction, TransactionArgument, TransactionResult } from "@mysten/sui/transactions";

export type Network = "mainnet" | "testnet";

export interface StableLayerConfig {
  network: Network;
  sender: string;
  /** Custom RPC URL. Falls back to SUI_GRPC_URL env or default fullnode URL. */
  baseUrl?: string;
  /** Pre-instantiated SuiGrpcClient. When provided, baseUrl is ignored. */
  suiClient?: SuiGrpcClient;
  /** Override entry config object ID for BucketClient (e.g. for testing). */
  configObjectId?: string;
  /** Config overrides passed to BucketClient.initialize (e.g. PRICE_SERVICE_ENDPOINT). */
  configOverrides?: Partial<ConfigType>;
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

/**
 * Params for `StableLayerClient.getClaimRewardUsdbAmount` (simulation-based preview).
 * Throws on failed dry-run, RPC, or build errors; returns `0n` only when dry-run succeeds
 * and there is no claimable USDB for `sender`.
 */
export interface ClaimRewardUsdbAmountParams {
  stableCoinType: string;
  sender: string;
}

export interface SetMaxSupplyTransactionParams {
  tx: Transaction;
  registry: string;
  factoryCapId: string;
  maxSupply: bigint;
  stableCoinType: string;
  usdCoinType: string;
  sender?: string;
}

export type CoinResult = TransactionResult | TransactionResult[number];
