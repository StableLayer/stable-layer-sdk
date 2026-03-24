---
name: stablelayer-sdk
description: Use when integrating with the stable-layer-sdk package for Stable Layer protocol operations - mint, burn, claim transactions and stablecoin supply queries.
---

# Stable Layer SDK - Integration Guide

`stable-layer-sdk` wraps Stable Layer + Bucket Protocol calls into one client for building Stable Layer transactions.
Use this skill for Stable Layer SDK work only, not generic Sui PTB design.

## Scope Guardrails

1. Use this skill when the request explicitly involves `stable-layer-sdk` or Stable Layer mint/burn/claim flows.
2. If the request is generic Sui PTB composition, use a Sui SDK skill instead.
3. If the request is about Bucket SDK internals (CDP/PSM/saving pools directly), use bucket-specific guidance.
4. Keep this skill focused on Stable Layer SDK API usage and integration troubleshooting.
5. Move deep protocol internals to reference files to keep trigger context small.
6. Prefer concrete Stable Layer examples over generic transaction theory.

## Install

```bash
npm install stable-layer-sdk @mysten/sui @mysten/bcs
# or
pnpm add stable-layer-sdk @mysten/sui @mysten/bcs
```

## Most Common Setup

```typescript
import { StableLayerClient } from "stable-layer-sdk";

const client = await StableLayerClient.initialize({
  network: "mainnet",
  sender: "0xYOUR_ADDRESS",
});
```

For custom RPC or Bucket config overrides, use [references/initialization-variants.md](references/initialization-variants.md).

## Core API

| Goal                      | Method                     | Notes                                                                        |
| ------------------------- | -------------------------- | ---------------------------------------------------------------------------- |
| Mint stablecoin from USDC | `buildMintTx`              | Input includes `usdcCoin`, optional returned coin with `autoTransfer: false` |
| Burn stablecoin to USDC   | `buildBurnTx`              | Must pass either `amount` or `all: true`                                     |
| Claim rewards             | `buildClaimTx`             | Returns reward coin when `autoTransfer: false`                               |
| Preview claim USDB        | `getClaimRewardUsdbAmount` | Mainnet: simulates same PTB as claim; testnet always `0n`                   |
| Query global supply       | `getTotalSupply`           | Reads `STABLE_REGISTRY.total_supply`                                         |
| Query supply by type      | `getTotalSupplyByCoinType` | Reads registry dynamic field by `TypeName`                                   |

## Common Integration Patterns

### Mint

```typescript
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";

const tx = new Transaction();
await client.buildMintTx({
  tx,
  stableCoinType,
  amount: 1_000_000n,
  usdcCoin: coinWithBalance({ type: usdcType, balance: 1_000_000n })(tx),
});
```

### Burn

```typescript
const tx = new Transaction();
await client.buildBurnTx({ tx, stableCoinType, amount: 1_000_000n });

// Or burn full balance:
await client.buildBurnTx({ tx, stableCoinType, all: true });
```

### Claim

```typescript
const tx = new Transaction();
const rewardCoin = await client.buildClaimTx({
  tx,
  stableCoinType,
  autoTransfer: false,
});
if (rewardCoin) tx.transferObjects([rewardCoin], sender);
```

### Supply Query

```typescript
const totalSupply = await client.getTotalSupply();
const typedSupply = await client.getTotalSupplyByCoinType(stableCoinType);
```

## Minimal Sign + Execute

```typescript
const result = await suiClient.signAndExecuteTransaction({
  transaction: tx,
  signer,
});
```

Use simulation before execution when integrating a new flow:

```typescript
const sim = await suiClient.simulateTransaction({ transaction: tx });
```

## Execution Checklist

1. Confirm `network` and `sender` are correct.
2. Confirm `stableCoinType` is exact (`0x...::module::Type`).
3. Build transaction with one of `buildMintTx`, `buildBurnTx`, or `buildClaimTx`.
4. Use `autoTransfer: false` only when downstream PTB steps need the returned coin.
5. Simulate before signing if integrating a new flow.
6. Sign and execute with your own signer.
7. Verify state with `getTotalSupply` or `getTotalSupplyByCoinType`.

## Core Reminders

1. `buildBurnTx` throws when both `amount` and `all` are missing.
2. Amounts are raw units (USDC/stablecoin use 6 decimals).
3. `buildMintTx` requires `usdcCoin`; ensure balance matches intended mint size.
4. Mainnet object/package IDs should be read from the installed SDK runtime constants.

## Reference Selection

1. Need IDs or type strings: use `references/mainnet-constants.md` and read only required keys from SDK runtime exports.
2. Need exact internal call order or failure points: use `references/transaction-flows.md`.
3. Need alternate init setup: use `references/initialization-variants.md`.

## Troubleshooting Triage

1. `Invalid type argument` or dynamic field errors: re-check `stableCoinType` exact string.
2. `Object not found` / shared object version errors: refresh constants from SDK runtime exports and confirm you are on the expected SDK version.
3. Burn path fails unexpectedly: confirm `amount` or `all` is set, and sender owns the coin.
4. Mint path fails with balance issues: confirm `usdcCoin` input amount and sender balance.
5. Network mismatch symptoms: verify `network`, RPC URL, and all object IDs are from the same environment.

## Output Expectations

1. State which Stable Layer SDK method is used and why.
2. Show exact required inputs (`stableCoinType`, amount/all, `usdcCoin`, sender).
3. State `autoTransfer` choice and whether coin is returned for composition.
4. Include a simulation or execution step when producing runnable integration snippets.

## References

- [references/mainnet-constants.md](references/mainnet-constants.md): lightweight index for on-demand constants from installed SDK runtime exports.
- [references/transaction-flows.md](references/transaction-flows.md): full mint/burn/claim call sequences and troubleshooting.
- [references/initialization-variants.md](references/initialization-variants.md): custom RPC and config override patterns.
