# Stable Layer SDK - Mainnet Constants

This file captures the canonical mainnet IDs and type strings currently used by this repository.

Source of truth:
- `src/libs/constants.ts`
- `test/e2e/client.test.ts` (known stable coin type used in tests)

## Package IDs

| Name | Value |
| --- | --- |
| `STABLE_LAYER_PACKAGE_ID` | `0xa4a78d8d3d1df62fb81d10068142e79b0d30ad4e3f578060487e36ed9ea764da` |
| `STABLE_VAULT_FARM_PACKAGE_ID` | `0x00d31ddaa73a56abcc3e2d885ac1e1d90f9ae0e38bbef2ba2923550c8250de4d` |
| `YIELD_USDB_PACKAGE_ID` | `0x3dcbf82f7e3b80ed65cee596612602a6c7e78c71fd40f6455b40ad033ed04786` |

## Shared Object IDs

| Name | Value |
| --- | --- |
| `STABLE_REGISTRY` | `0x213f4d584c0770f455bb98c94a4ee5ea9ddbc3d4ebb98a0ad6d093eb6da41642` |
| `STABLE_VAULT` | `0x65f38160110cd6859d05f338ff54b4f462883bb6f87c667a65c0fb0e537410a7` |
| `STABLE_VAULT_FARM` | `0xe958b7d102b33bf3c09addb0e2cdff102ff2c93afe407ec5c2a541e8959a650c` |
| `YIELD_VAULT` | `0x0a7f6325253157cd437812fea0ceee9a6b96f2ec5eac410da6df39558ff3a4d1` |

## Type Strings

| Name | Value |
| --- | --- |
| `USDC_TYPE` | `0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC` |
| `STABLE_LP_TYPE` | `0xb75744fadcbfc174627567ca29645d0af8f6e6fd01b6f57c75a08cd3fb97c567::lake_usdc::LakeUSDC` |
| `SAVING_TYPE` | `0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB` |
| `YUSDB_TYPE` | `0xac718b4b672d7f461fe7e86847166ff9c23cadba217397f0848a95bdea1f1051::yesusdb::YesUSDB` |

`STABLE_VAULT_FARM_ENTITY_TYPE`:

```text
0xc1025fe014b03d33b207b5afb0ba04293be87fab438c1418a26a75c2fe05c223::stable_vault_farm::StableVaultFarmEntity<0xb75744fadcbfc174627567ca29645d0af8f6e6fd01b6f57c75a08cd3fb97c567::lake_usdc::LakeUSDC, 0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC>
```

## Known Stable Coin Type Example

The repository e2e tests use:

| Label | Stable Coin Type |
| --- | --- |
| `BTC_USDC` | `0x6d9fc33611f4881a3f5c0cd4899d95a862236ce52b3a38fef039077b0c5b5834::btc_usdc::BtcUSDC` |

Treat this as a known working example, not a complete list of all possible stable coin types.

## Update Rule

When protocol contracts are upgraded on-chain:
1. Update `src/libs/constants.ts`.
2. Re-run build/tests.
3. Refresh this file if values changed.
