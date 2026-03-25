# Stable Layer SDK

TypeScript SDK for the [Stable Layer](https://github.com/StableLayer/stable-layer-sdk) protocol on Sui blockchain. Mint and burn stablecoins, and claim yield farming rewards.

## Installation

```bash
npm install stable-layer-sdk @mysten/sui @mysten/bcs
```

## Quick Start

```typescript
import { StableLayerClient } from "stable-layer-sdk";

const client = await StableLayerClient.initialize({
  network: "mainnet", // or "testnet" (mint/burn/claim use mock_farm; see src/libs/constants.testnet.ts)
  sender: "0xYOUR_ADDRESS",
});
```

Testnet republish overrides: optional `mockFarmRegistryId`, `mockFarmPackageId`, `mockUsdbCoinType` on `initialize`.

## Examples

### Mint Stablecoins

Deposit USDC to mint stablecoins. The SDK builds a transaction that mints via Stable Layer and deposits into the vault farm (mainnet); on testnet, flow uses `mock_farm::receive` after mint.

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

`pnpm exec vitest run` hits mainnet RPC from `test/e2e/`. Use `QUERY_OUTPUT=1` or `pnpm query-output` for extra simulation logs. Opt-in live testnet mint/burn: `pnpm test:e2e:testnet` (env vars in `test/e2e/testnet-mint-burn.e2e.ts`).

## API

### `StableLayerClient.initialize(config)`

Creates a client with config fetched from chain (via Bucket Protocol SDK). Returns `Promise<StableLayerClient>`.

| Parameter        | Type                     | Description            |
| ---------------- | ------------------------ | ---------------------- |
| `config.network` | `"mainnet" \| "testnet"` | Sui network            |
| `config.sender`  | `string`                 | Default sender address |

### Transaction & query methods

All methods accept a `tx` (Transaction) and optional `sender` to override the default. Set `autoTransfer: false` to get the resulting coin back instead of auto-transferring.

| Method                             | Description                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| `buildMintTx(params)`              | Mint from USDC (testnet: + `mock_farm::receive`)                                             |
| `buildBurnTx(params)`              | Burn to USDC (testnet: `mock_farm::pay`)                                                     |
| `buildClaimTx(params)`             | Claim rewards (testnet: `mock_farm::claim`)                                                  |
| `buildSetMaxSupplyTx(params)`      | Update max supply                                                                            |
| `getClaimRewardUsdbAmount(params)` | Simulate `buildClaimTx`; sum USDB credit (testnet: mock USDB type) — throws if dry-run fails |
| `getTotalSupply()`                 | Total supply from registry                                                                   |
| `getTotalSupplyByCoinType(type)`   | Supply for one coin type                                                                     |

### `getConstants(network)` / `StableLayerClient.getConstants`

Returns protocol object IDs and type strings for `mainnet` or `testnet` without building a client.

## License

MIT
