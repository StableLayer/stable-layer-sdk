# Stable Layer SDK

TypeScript SDK for the [Stable Layer](https://github.com/StableLayer/stable-layer-sdk) protocol on Sui blockchain. Mint and burn stablecoins, and claim yield farming rewards.

## Installation

```bash
npm install stable-layer-sdk @mysten/sui @mysten/bcs
```

## Network Support

| Feature                    | Mainnet | Testnet |
| -------------------------- | ------- | ------- |
| `buildMintTx`              | ✅      | ✅ mock_farm (`receive`) |
| `buildBurnTx`              | ✅      | ✅ mock_farm (`pay`) |
| `buildClaimTx`             | ✅      | ✅ mock_farm |
| `buildSetMaxSupplyTx`      | ✅      | ✅      |
| `getTotalSupply`           | ✅      | ✅      |
| `getTotalSupplyByCoinType` | ✅      | ✅      |
| `getClaimRewardUsdbAmount` | ✅      | ✅ mock USDB preview |
| `getConstants(network)`    | ✅      | ✅      |

**Same API for both networks:** pass `network: "mainnet" | "testnet"` to `StableLayerClient.initialize`. Mainnet uses Bucket + `stable_vault_farm`; testnet uses `mock_farm` (`receive` / `pay` / `claim`) with Circle USDC — see [`src/libs/constants.testnet.ts`](src/libs/constants.testnet.ts). After republishing `mock_farm`, set `mockFarmRegistryId`, `mockFarmPackageId`, and optionally `mockUsdbCoinType` on `initialize`.

`getClaimRewardUsdbAmount` dry-runs the same PTB as `buildClaimTx` with `autoTransfer: true` and sums positive **USDB** balance deltas for `sender` (mainnet: Bucket USDB; testnet: `MOCK_USDB_TYPE`). Returns `0n` when the dry-run succeeds but there is no USDB credit for `sender`. **Throws** when the dry-run does not complete successfully, on RPC/network failures, or while building/simulating (callers should `try/catch` or surface errors in the UI).

## Quick Start

```typescript
import { StableLayerClient } from "stable-layer-sdk";

// Mainnet (full support)
const client = await StableLayerClient.initialize({
  network: "mainnet",
  sender: "0xYOUR_ADDRESS",
});

// Testnet (mock_farm mint/burn/claim; optional registry / USDB type overrides)
const testnetClient = await StableLayerClient.initialize({
  network: "testnet",
  sender: "0xYOUR_ADDRESS",
});
```

## Examples

### Mint Stablecoins

Deposit USDC to mint stablecoins. The SDK builds a transaction that mints via Stable Layer and deposits into the vault farm.

```typescript
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";

const tx = new Transaction();

// Mint with auto-transfer (coin sent to sender automatically)
await client.buildMintTx({
  tx,
  stableCoinType: "0x6d9fc...::btc_usdc::BtcUSDC",
  usdcCoin: coinWithBalance({
    balance: BigInt(1_000_000),
    type: "0xdba34...::usdc::USDC",
  })(tx),
  amount: BigInt(1_000_000),
});

// Or get the coin back for further composition
const coin = await client.buildMintTx({
  tx,
  stableCoinType: "0x6d9fc...::btc_usdc::BtcUSDC",
  usdcCoin: coinWithBalance({
    balance: BigInt(1_000_000),
    type: "0xdba34...::usdc::USDC",
  })(tx),
  amount: BigInt(1_000_000),
  autoTransfer: false,
});
```

### Burn Stablecoins

Burn stablecoins to redeem USDC.

```typescript
const tx = new Transaction();

// Burn a specific amount
await client.buildBurnTx({
  tx,
  stableCoinType: "0x6d9fc...::btc_usdc::BtcUSDC",
  amount: BigInt(1_000_000),
});

// Or burn entire balance
await client.buildBurnTx({
  tx,
  stableCoinType: "0x6d9fc...::btc_usdc::BtcUSDC",
  all: true,
});
```

### Claim Rewards

Claim yield (mainnet: vault farm; testnet: `mock_farm::claim`).

```typescript
const tx = new Transaction();

await client.buildClaimTx({
  tx,
  stableCoinType: "0x6d9fc...::btc_usdc::BtcUSDC",
});
```

### Preview claimable USDB (simulation)

Dry-runs the same PTB as `buildClaimTx` with `autoTransfer: true` and sums positive USDB balance changes for `sender`. Mainnet uses Bucket USDB; testnet uses mock `MOCK_USDB_TYPE`. Use `try/catch` for RPC or dry-run failures.

```typescript
const usdbBaseUnits = await client.getClaimRewardUsdbAmount({
  stableCoinType: "0x6d9fc...::btc_usdc::BtcUSDC",
  sender: "0xYOUR_ADDRESS",
});
```

### Set Max Supply

Update the max supply of a brand stablecoin. **Works on mainnet and testnet.**

```typescript
const tx = new Transaction();

client.buildSetMaxSupplyTx({
  tx,
  registry: "0x213f4d58...",
  factoryCapId: "0x...",
  maxSupply: BigInt(10_000_000_000000),
  stableCoinType: "0x6d9fc...::btc_usdc::BtcUSDC",
  usdCoinType: "0xdba34...::usdc::USDC", // testnet: Circle USDC — see getConstants("testnet").USDC_TYPE
});
```

### Query Total Supply

```typescript
// Total supply across all coin types
const totalSupply = await client.getTotalSupply();

// Total supply for a specific coin type
const btcUsdcSupply = await client.getTotalSupplyByCoinType("0x6d9fc...::btc_usdc::BtcUSDC");
```

### Signing and Executing

All `build*` methods return a `Transaction` that you sign and execute with the Sui SDK:

```typescript
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const suiClient = new SuiGrpcClient({
  network: "mainnet",
  baseUrl: "https://fullnode.mainnet.sui.io:443",
});
const keypair = Ed25519Keypair.fromSecretKey(YOUR_PRIVATE_KEY);

const tx = new Transaction();
await client.buildMintTx({ tx /* ... */ });

const result = await suiClient.signAndExecuteTransaction({
  transaction: tx,
  signer: keypair,
});
```

## Testing

E2E tests live in `test/e2e/` and call mainnet RPC. Run once: `pnpm exec vitest run`.

- **`QUERY_OUTPUT=1`** (or `pnpm query-output`): extra simulation JSON from `report()`.

**Optional live testnet mint → burn** (skipped unless env is set):

```bash
E2E_TESTNET_MINT_BURN=1 \
E2E_TESTNET_STABLE_COIN_TYPE='0x...::module::COIN' \
E2E_TESTNET_PRIVATE_KEY='suiprivkey...' \
pnpm test:e2e:testnet
```

See [`test/e2e/testnet-mint-burn.e2e.ts`](test/e2e/testnet-mint-burn.e2e.ts) for optional `E2E_TESTNET_AMOUNT` and mock farm overrides.

## API

### `StableLayerClient.initialize(config)`

Creates a client with config fetched from chain (via Bucket Protocol SDK). Returns `Promise<StableLayerClient>`.

| Parameter        | Type                     | Description            |
| ---------------- | ------------------------ | ---------------------- |
| `config.network` | `"mainnet" \| "testnet"` | Sui network            |
| `config.sender`  | `string`                 | Default sender address |

### Transaction & Query Methods

All `build*` methods accept a `tx` (Transaction) and optional `sender`. Set `autoTransfer: false` in mint/burn/claim to get the resulting coin back instead of auto-transferring.

| Method                           | Description                     | Mainnet | Testnet |
| -------------------------------- | ------------------------------- | ------- | ------- |
| `buildMintTx(params)`            | Mint stablecoins from USDC      | ✅      | ✅ mock_farm |
| `buildBurnTx(params)`            | Burn stablecoins to redeem USDC | ✅      | ✅ mock_farm |
| `buildClaimTx(params)`           | Claim yield farming rewards     | ✅      | ✅ mock_farm |
| `buildSetMaxSupplyTx(params)`    | Update max supply of a coin     | ✅      | ✅      |
| `getTotalSupply()`               | Total supply from registry      | ✅      | ✅      |
| `getTotalSupplyByCoinType(type)` | Supply for a specific coin      | ✅      | ✅      |
| `getClaimRewardUsdbAmount(p)`    | Preview USDB from claim (sim)   | ✅      | ✅ mock USDB |

### `getConstants(network)`

Get network-specific protocol constants (registry, package IDs, etc.) without initializing a client.

```typescript
import { getConstants } from "stable-layer-sdk";

const mainnet = getConstants("mainnet");
const testnet = getConstants("testnet");
```

## License

MIT
