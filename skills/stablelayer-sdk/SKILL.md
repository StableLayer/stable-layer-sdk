---
name: stablelayer-sdk
description: Use when integrating Stable Layer on Sui with the `stable-layer-sdk` package, including building mint/burn/claim transactions, querying stablecoin supply, composing Programmable Transaction Blocks with `@mysten/sui`, and troubleshooting Stable Layer + Bucket Protocol integration issues.
---

# Stable Layer SDK - Integration Guide

`stable-layer-sdk` is a TypeScript SDK for building Stable Layer protocol transactions on Sui. It wraps multi-step Move calls and Bucket Protocol dependencies so apps can mint stablecoins from USDC, burn stablecoins back to USDC, and claim yield-farm rewards using one client.

## Installation

```bash
npm install stable-layer-sdk @mysten/sui @mysten/bcs
# or
pnpm add stable-layer-sdk @mysten/sui @mysten/bcs
```

Runtime dependency: `@bucket-protocol/sdk` (pulled by this SDK).  
Peer dependencies: `@mysten/sui >=2.0.0`, `@mysten/bcs >=2.0.0`.

## Quick Start

```typescript
import { StableLayerClient } from "stable-layer-sdk";
import { Transaction, coinWithBalance } from "@mysten/sui/transactions";

const sender = "0xYOUR_ADDRESS";
const stableCoinType =
  "0x6d9fc33611f4881a3f5c0cd4899d95a862236ce52b3a38fef039077b0c5b5834::btc_usdc::BtcUSDC";

const client = await StableLayerClient.initialize({
  network: "mainnet",
  sender,
});

const tx = new Transaction();
await client.buildMintTx({
  tx,
  stableCoinType,
  amount: 1_000_000n, // raw amount (6 decimals)
  usdcCoin: coinWithBalance({
    type: "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
    balance: 1_000_000n,
  })(tx),
});
```

Sign and execute with your own `SuiGrpcClient` + signer.

## Initialization

```typescript
import { StableLayerClient } from "stable-layer-sdk";
import { SuiGrpcClient } from "@mysten/sui/grpc";

const client = await StableLayerClient.initialize({
  network: "mainnet",
  sender: "0xYOUR_ADDRESS",
});

const suiClient = new SuiGrpcClient({
  network: "mainnet",
  baseUrl: "https://fullnode.mainnet.sui.io:443",
});
const clientWithCustomRpc = await StableLayerClient.initialize({
  network: "mainnet",
  sender: "0xYOUR_ADDRESS",
  suiClient,
});

const clientWithOverrides = await StableLayerClient.initialize({
  network: "mainnet",
  sender: "0xYOUR_ADDRESS",
  configObjectId: "0x...",
  configOverrides: {
    PRICE_SERVICE_ENDPOINT: "https://hermes.example.com",
  },
});
```

`initialize()` sets up:
1. `SuiGrpcClient` (default or injected)
2. `BucketClient.initialize(...)`
3. Stable Layer wrapper client

## API Surface

### Read-only Queries

```typescript
const totalSupply = await client.getTotalSupply();
const btcUsdcSupply = await client.getTotalSupplyByCoinType(stableCoinType);
```

`getTotalSupplyByCoinType()` reads a dynamic field from `STABLE_REGISTRY` keyed by `0x1::type_name::TypeName`.

### Transaction Builders

All `build*` methods append commands to a provided `Transaction` and call `tx.setSender(...)`.

```typescript
const tx = new Transaction();

// Mint: USDC -> stablecoin (then deposit to farm internally)
await client.buildMintTx({
  tx,
  stableCoinType,
  amount: 1_000_000n,
  usdcCoin,
  autoTransfer: true, // default
});

// Burn: stablecoin -> USDC
await client.buildBurnTx({
  tx,
  stableCoinType,
  amount: 1_000_000n, // OR all: true
  autoTransfer: true, // default
});

// Claim rewards
await client.buildClaimTx({
  tx,
  stableCoinType,
  autoTransfer: true, // default
});
```

If `autoTransfer: false`, the method returns the resulting coin (`TransactionResult`) so you can continue composing inside the same PTB.

## Common Integration Patterns

### 1) Build-Then-Transfer (explicit control)

```typescript
const tx = new Transaction();
const mintedCoin = await client.buildMintTx({
  tx,
  stableCoinType,
  amount: 1_000_000n,
  usdcCoin,
  autoTransfer: false,
});
if (mintedCoin) {
  tx.transferObjects([mintedCoin], sender);
}
```

### 2) Burn All Balance

```typescript
const tx = new Transaction();
await client.buildBurnTx({
  tx,
  stableCoinType,
  all: true,
});
```

`all: true` reads the sender balance for `stableCoinType` from chain and burns that amount.

### 3) Claim + Additional App Calls in One PTB

```typescript
const tx = new Transaction();
const rewardCoin = await client.buildClaimTx({
  tx,
  stableCoinType,
  autoTransfer: false,
});

// Compose more Move calls here before final transfer.
if (rewardCoin) {
  tx.transferObjects([rewardCoin], sender);
}
```

## Transaction Semantics

Stable Layer builders wrap multi-step calls:
1. `buildMintTx()`: `stable_layer::mint` -> Bucket price aggregation -> `stable_vault_farm::receive` -> deposit response check
2. `buildBurnTx()`: `yield_usdb::release` -> `stable_layer::request_burn` -> Bucket price aggregation -> `stable_vault_farm::pay` -> withdraw response check -> `stable_layer::fulfill_burn`
3. `buildClaimTx()`: `yield_usdb::release` -> `stable_vault_farm::claim` -> withdraw response check

Use [references/transaction-flows.md](references/transaction-flows.md) for exact call sequence and failure points.

## Common Gotchas

1. `buildMintTx` and `buildBurnTx` are `async` because they call Bucket price aggregation.
2. `buildBurnTx` throws if neither `amount` nor `all` is set.
3. `buildMintTx` requires `usdcCoin`; construct it with `coinWithBalance(...)` or your own coin object.
4. Amounts are raw integer units (USDC/stablecoin are 6 decimals).
5. `amount` in `buildMintTx` is currently required by the type but not consumed in method logic; ensure the actual `usdcCoin` balance matches your intended mint size.
6. Generated bindings in `src/generated/` are auto-generated. Do not hand-edit them.
7. Constants in `src/libs/constants.ts` are network-specific mainnet IDs; update them when protocol deployments upgrade.

## Bundled Resources

| Resource | Path | When to use |
| --- | --- | --- |
| Mainnet constants | `references/mainnet-constants.md` | Need package IDs, object IDs, and key type strings used by this SDK |
| Flow guide | `references/transaction-flows.md` | Need exact mint/burn/claim call order, decision matrix, and troubleshooting flow |
| Query script | `scripts/query-state.ts` | Need quick live checks for registry supply and known coin-type supply |

Run the query script from repository root:

```bash
pnpm dlx tsx skills/stablelayer-sdk/scripts/query-state.ts
```
