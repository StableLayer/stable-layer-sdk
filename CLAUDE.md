# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TypeScript SDK for the Stable Layer protocol on Sui blockchain. Provides a client for minting/burning stablecoins and claiming yield farming rewards via integration with Bucket Protocol.

Published as `stable-layer-sdk` on npm with dual ESM/CJS support.

## Commands

- **Install**: `pnpm install`
- **Build**: `pnpm build` (esbuild bundles + type declarations)
- **Dev watch**: `pnpm dev` (tsc watch mode, type checking only)
- **Test**: `pnpm test` (runs vitest in watch mode)
- **Single test run**: `pnpm test -- --run`
- **Clean**: `pnpm clean`

Package manager is **pnpm** (v10). Build targets Node 20+.

## Architecture

### Core (`src/index.ts`)

`StableLayerClient` is the single public class. It wraps multi-step Sui transaction building:

- **`buildMintTx()`** — Takes USDC, mints stablecoin via `stable_layer::mint`, deposits into vault farm via `stable_vault_farm::receive`
- **`buildBurnTx()`** — Releases rewards, requests burn, pays vault farm via `stable_vault_farm::pay`, fulfills burn to return USDC
- **`buildClaimTx()`** — Releases rewards from yield vault, claims from vault farm

All build methods compose Sui `Transaction` objects using generated bindings. They integrate with `BucketClient` for price aggregation, PSM pools, saving pools, and treasury access. Each method supports `autoTransfer` (default true) to transfer resulting coins, or returns the coin for further composition.

### Generated Bindings (`src/generated/`)

Auto-generated type-safe TypeScript wrappers for three Move packages:
- `stable_layer/` — Core mint/burn operations
- `stable_vault_farm/` — Vault farm deposit/withdraw/claim
- `yield_usdb/` — Yield vault release

These files should not be manually edited. They use BCS serialization and provide typed function wrappers that return callables taking a `Transaction`.

### Constants (`src/libs/constants.ts`)

All on-chain object IDs and type strings (package IDs, registries, vaults, coin types). When upgrading contracts on-chain, update the corresponding constant here.

### Interfaces (`src/interface.ts`)

Config and parameter types: `StableLayerConfig`, `MintTransactionParams`, `BurnTransactionParams`, `ClaimTransactionParams`, `CoinResult`.

## Build Output

`build.js` uses esbuild to produce:
- `dist/cjs/index.cjs` — CommonJS bundle
- `dist/esm/index.mjs` — ES Module bundle
- `dist/types/` — TypeScript declarations (via `tsc` with `tsconfig.types.json`)

## Key Dependencies

- `@bucket-protocol/sdk` — Runtime dependency for Bucket Protocol integration
- `@mysten/sui`, `@mysten/bcs` — Peer dependencies (Sui SDK and serialization)

## Testing

Tests are in `test/e2e/client.test.ts` using Vitest. They perform dry runs against Sui mainnet — no local chain needed, but network access is required.
