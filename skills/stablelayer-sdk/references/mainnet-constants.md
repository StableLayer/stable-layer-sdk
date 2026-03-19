# Stable Layer SDK - Constants Lookup Guide

Use this file as a lightweight index for SDK consumers.
Do not copy full constant tables into context unless the task explicitly needs exact IDs.

## Source of Truth

Use runtime exports from the installed package:

1. `StableLayerClient.getConstants()`
2. `constants` named export from `stable-layer-sdk`

## Quick Commands

```bash
# Print all constant keys
node -e "const s=require('stable-layer-sdk'); const c=(s.constants ?? s.StableLayerClient?.getConstants?.()); console.log(c ? Object.keys(c).join('\\n') : 'constants export not found');"

# Print package IDs
node -e "const s=require('stable-layer-sdk'); const c=(s.constants ?? s.StableLayerClient?.getConstants?.()); console.log(c ? Object.entries(c).filter(([k])=>k.endsWith('_PACKAGE_ID')).map(([k,v])=>k+'='+v).join('\\n') : 'constants export not found');"

# Print type constants
node -e "const s=require('stable-layer-sdk'); const c=(s.constants ?? s.StableLayerClient?.getConstants?.()); console.log(c ? Object.entries(c).filter(([k])=>k.endsWith('_TYPE')).map(([k,v])=>k+'='+v).join('\\n') : 'constants export not found');"
```

## Minimal Retrieval Strategy

1. Extract only keys needed for the current task.
2. Avoid pasting full hex lists into responses unless user explicitly asks for all values.
3. Re-read constants from runtime exports after SDK version changes.

## Update Rule

When protocol contracts are upgraded on-chain, SDK maintainers should update constants in the package. As an SDK consumer, always trust the installed SDK version you are integrating.
