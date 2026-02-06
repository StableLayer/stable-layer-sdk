# Stable Layer SDK

TypeScript SDK for the [Stable Layer](https://github.com/StableLayer/stable-layer-sdk) protocol on Sui blockchain. Mint and burn stablecoins, and claim yield farming rewards.

## Installation

```bash
npm install stable-layer-sdk @mysten/sui @mysten/bcs
```

## Quick Start

```typescript
import { StableLayerClient } from "stable-layer-sdk";

const client = new StableLayerClient({
  network: "mainnet",
  sender: "0xYOUR_ADDRESS",
});
```

## Examples

### Mint Stablecoins

Deposit USDC to mint stablecoins. The SDK builds a transaction that mints via Stable Layer and deposits into the vault farm.

```typescript
import { Transaction, coinWithBalance } from "@mysten/sui/transactions";

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

Claim accumulated yield farming rewards.

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
const btcUsdcSupply = await client.getTotalSupplyByCoinType(
  "0x6d9fc...::btc_usdc::BtcUSDC",
);
```

### Signing and Executing

All `build*` methods return a `Transaction` that you sign and execute with the Sui SDK:

```typescript
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });
const keypair = Ed25519Keypair.fromSecretKey(YOUR_PRIVATE_KEY);

const tx = new Transaction();
await client.buildMintTx({ tx, /* ... */ });

const result = await suiClient.signAndExecuteTransaction({
  transaction: tx,
  signer: keypair,
});
```

## API

### `new StableLayerClient(config)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `config.network` | `"mainnet" \| "testnet"` | Sui network |
| `config.sender` | `string` | Default sender address |

### Transaction Methods

All methods accept a `tx` (Transaction) and optional `sender` to override the default. Set `autoTransfer: false` to get the resulting coin back instead of auto-transferring.

| Method | Description |
|--------|-------------|
| `buildMintTx(params)` | Mint stablecoins from USDC |
| `buildBurnTx(params)` | Burn stablecoins to redeem USDC |
| `buildClaimTx(params)` | Claim yield farming rewards |
| `getTotalSupply()` | Get total supply from registry |
| `getTotalSupplyByCoinType(type)` | Get total supply for a specific coin type |

## License

MIT
