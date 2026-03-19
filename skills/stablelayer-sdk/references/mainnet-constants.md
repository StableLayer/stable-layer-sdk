# Stable Layer SDK - Constants Lookup Guide

Use this file as a lightweight index.
Do not copy full constant tables into context unless the task explicitly needs exact IDs.

## Source of Truth

1. `src/libs/constants.ts`
2. `test/e2e/client.test.ts` (example `stableCoinType` used in tests)

## What to Read (By Need)

1. Need package IDs:
   - Read constants ending with `_PACKAGE_ID`.
2. Need shared object IDs:
   - Read `STABLE_REGISTRY`, `STABLE_VAULT`, `STABLE_VAULT_FARM`, `YIELD_VAULT`.
3. Need type strings:
   - Read constants ending with `_TYPE`.
4. Need known working stable coin type sample:
   - Check `BTC_USD_TYPE` in `test/e2e/client.test.ts`.

## Minimal Retrieval Strategy

1. Open `src/libs/constants.ts` directly.
2. Extract only constants needed for the current task.
3. Avoid pasting full hex lists into responses unless user explicitly asks for all values.

## Quick Commands

```bash
# Show all stable-layer constants
rg --line-number "export const" src/libs/constants.ts

# Find package IDs only
rg --line-number "_PACKAGE_ID" src/libs/constants.ts

# Find type strings only
rg --line-number "_TYPE" src/libs/constants.ts

# Find test stable coin sample
rg --line-number "BTC_USD_TYPE|stableCoinType" test/e2e/client.test.ts
```

## Update Rule

When contracts are upgraded on-chain:
1. Update `src/libs/constants.ts`.
2. Re-run build/tests.
3. Keep this guide unchanged unless lookup flow changes.
