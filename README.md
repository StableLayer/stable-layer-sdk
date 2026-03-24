# Stable Layer SDK

TypeScript SDK for the [Stable Layer](https://github.com/StableLayer/stable-layer-sdk) protocol on Sui blockchain. Mint and burn stablecoins, and claim yield farming rewards.

## Installation

```bash
npm install stable-layer-sdk @mysten/sui @mysten/bcs
```

## Network Support

| Feature                    | Mainnet | Testnet |
| -------------------------- | ------- | ------- |
| `buildMintTx`              | ✅      | ❌      |
| `buildBurnTx`              | ✅      | ❌      |
| `buildClaimTx`             | ✅      | ❌      |
| `buildSetMaxSupplyTx`      | ✅      | ✅      |
| `getTotalSupply`           | ✅      | ✅      |
| `getTotalSupplyByCoinType` | ✅      | ✅      |
| `getClaimRewardUsdbAmount` | ✅      | ⚪ `0n` |
| `getConstants(network)`    | ✅      | ✅      |

Testnet uses DummyFarm + SUI as mock USD; Mint/Burn/Claim require the full vault farm stack (mainnet only). `getClaimRewardUsdbAmount` on testnet always returns `0n` (no simulation).

`getClaimRewardUsdbAmount` dry-runs the same PTB as `buildClaimTx` with `autoTransfer: true` and sums positive Bucket **USDB** balance deltas for `sender`; use it to preview claimable rewards in UIs. Returns `0n` if simulation fails (e.g. sender is not a factory manager or nothing to claim).

## Quick Start

```typescript
import { StableLayerClient } from "stable-layer-sdk";

// Mainnet (full support)
const client = await StableLayerClient.initialize({
  network: "mainnet",
  sender: "0xYOUR_ADDRESS",
});

// Testnet (set_max_supply, supply queries only)
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

Claim accumulated yield farming rewards. **Mainnet only.**

```typescript
const tx = new Transaction();

await client.buildClaimTx({
  tx,
  stableCoinType: "0x6d9fc...::btc_usdc::BtcUSDC",
});
```

### Preview claimable USDB (simulation)

**Mainnet only** (testnet returns `0n`). Runs a transaction simulation identical to `buildClaimTx` and reads how much Bucket USDB would be credited to `sender` from balance changes.

```typescript
const usdbBaseUnits = await client.getClaimRewardUsdbAmount({
  stableCoinType: "0x6d9fc...::btc_usdc::BtcUSDC",
  sender: "0xYOUR_ADDRESS", // must be a factory manager for a non-zero preview when rewards exist
});
// USDB uses 6 decimals on-chain
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
  usdCoinType: "0xdba34...::usdc::USDC", // or 0x2::sui::SUI on testnet
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
| `buildMintTx(params)`            | Mint stablecoins from USDC      | ✅      | ❌      |
| `buildBurnTx(params)`            | Burn stablecoins to redeem USDC | ✅      | ❌      |
| `buildClaimTx(params)`           | Claim yield farming rewards     | ✅      | ❌      |
| `buildSetMaxSupplyTx(params)`    | Update max supply of a coin     | ✅      | ✅      |
| `getTotalSupply()`               | Total supply from registry      | ✅      | ✅      |
| `getTotalSupplyByCoinType(type)` | Supply for a specific coin      | ✅      | ✅      |
| `getClaimRewardUsdbAmount(p)`    | Preview USDB from claim (sim)   | ✅      | ⚪ `0n` |

### `getConstants(network)`

Get network-specific protocol constants (registry, package IDs, etc.) without initializing a client.

```typescript
import { getConstants } from "stable-layer-sdk";

const mainnet = getConstants("mainnet");
const testnet = getConstants("testnet");
```

## License

MIT
