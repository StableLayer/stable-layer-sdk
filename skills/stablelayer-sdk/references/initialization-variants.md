# Stable Layer SDK - Initialization Variants

Use these patterns when default initialization is not enough.

## 1) Custom RPC URL

```typescript
import { StableLayerClient } from "stable-layer-sdk";

const client = await StableLayerClient.initialize({
  network: "mainnet",
  sender: "0xYOUR_ADDRESS",
  baseUrl: "https://fullnode.mainnet.sui.io:443",
});
```

## 2) Inject a Prebuilt SuiGrpcClient

```typescript
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { StableLayerClient } from "stable-layer-sdk";

const suiClient = new SuiGrpcClient({
  network: "mainnet",
  baseUrl: "https://fullnode.mainnet.sui.io:443",
});

const client = await StableLayerClient.initialize({
  network: "mainnet",
  sender: "0xYOUR_ADDRESS",
  suiClient,
});
```

## 3) Override Bucket Config Sources

```typescript
import { StableLayerClient } from "stable-layer-sdk";

const client = await StableLayerClient.initialize({
  network: "mainnet",
  sender: "0xYOUR_ADDRESS",
  configObjectId: "0xYOUR_BUCKET_CONFIG_OBJECT",
  configOverrides: {
    PRICE_SERVICE_ENDPOINT: "https://hermes.pyth.network",
  },
});
```

## Notes

1. `suiClient` takes precedence over `baseUrl`.
2. If `baseUrl` is omitted, the SDK uses `SUI_GRPC_URL` env var, then default fullnode URL.
3. Keep `network` aligned with your object IDs and coin types.
