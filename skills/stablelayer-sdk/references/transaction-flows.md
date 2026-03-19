# Stable Layer SDK - Transaction Flows and Decision Guide

Use this guide when you need to reason about which Stable Layer method to call, what it does internally, and where failures usually happen.

## Decision Matrix

| Goal | Method | Typical Inputs | Returned coin (`autoTransfer: false`) |
| --- | --- | --- | --- |
| Mint stablecoin from USDC | `buildMintTx` | `stableCoinType`, `usdcCoin`, `amount` | Minted stablecoin |
| Burn stablecoin back to USDC | `buildBurnTx` | `stableCoinType` + (`amount` or `all`) | USDC |
| Claim farm rewards | `buildClaimTx` | `stableCoinType` | Reward coin |
| Query all stable supply | `getTotalSupply` | none | n/a |
| Query one stable supply | `getTotalSupplyByCoinType` | `stableCoinType` | n/a |

## Mint Flow (`buildMintTx`)

High-level sequence:
1. `tx.setSender(...)`
2. `stable_layer::mint` -> output: `[stableCoin, loan]`
3. Bucket `aggregatePrices([USDC_TYPE])` -> output: `uPrice`
4. `stable_vault_farm::receive(...)` with farm/vault/treasury/pool refs
5. `bucketClient.checkDepositResponse(...)`
6. If `autoTransfer === true`, transfer `stableCoin` to sender

Common failure points:
- Invalid or unsupported `stableCoinType`
- `usdcCoin` amount mismatch
- Stale shared object IDs (constants out of date)
- Bucket price aggregation failure (RPC/oracle issues)

## Burn Flow (`buildBurnTx`)

High-level sequence:
1. `tx.setSender(...)`
2. Validate input: throw if both `amount` and `all` are missing
3. Build stable coin input:
   - `all: true` -> fetch balance by `stableCoinType`
   - else use provided `amount`
4. `yield_usdb::release` (release farm/yield rewards first)
5. `stable_layer::request_burn`
6. Bucket `aggregatePrices([USDC_TYPE])` -> `uPrice`
7. `stable_vault_farm::pay(...)`
8. `bucketClient.checkWithdrawResponse(...)`
9. `stable_layer::fulfill_burn` -> output `usdcCoin`
10. If `autoTransfer === true`, transfer USDC to sender

Common failure points:
- Neither `amount` nor `all` provided
- Insufficient stablecoin balance when using `amount`
- Wrong sender when using `all: true` (balance read for sender)
- Shared object version mismatch after on-chain upgrade

## Claim Flow (`buildClaimTx`)

High-level sequence:
1. `tx.setSender(...)`
2. `yield_usdb::release`
3. `stable_vault_farm::claim(...)` -> output `[rewardCoin, withdrawResponse]`
4. `bucketClient.checkWithdrawResponse(...)`
5. If `autoTransfer === true`, transfer reward coin to sender

Common failure points:
- No claimable rewards (depends on protocol behavior)
- Incorrect `stableCoinType`
- Shared object or package ID drift

## Composition Notes

1. Keep one `Transaction` and chain multiple SDK calls for atomic behavior.
2. Use `autoTransfer: false` when the next step in the same PTB needs the returned coin.
3. Ensure `tx.setSender` consistency when composing with external SDK calls.
4. Prefer simulation before execution when integrating new flows.

Example pattern:

```typescript
const tx = new Transaction();

const minted = await client.buildMintTx({
  tx,
  stableCoinType,
  amount: 1_000_000n,
  usdcCoin,
  autoTransfer: false,
});

// Additional app-specific calls here...

if (minted) {
  tx.transferObjects([minted], sender);
}
```

## Troubleshooting Checklist

1. Verify `stableCoinType` string is exact (`0x...::module::Type`).
2. Verify sender has required balances for input coins.
3. Verify constants in `src/libs/constants.ts` match current deployment.
4. Verify RPC endpoint health and network alignment (`mainnet` vs `testnet`).