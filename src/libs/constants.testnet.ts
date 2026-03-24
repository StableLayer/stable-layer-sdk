/**
 * Testnet object IDs and type strings.
 * Testnet uses DummyFarm + Circle USDC (Sui testnet). Mint/Burn/Claim require full vault farm (mainnet only).
 * Supported on testnet: buildSetMaxSupplyTx, getTotalSupply, getTotalSupplyByCoinType.
 */
/** Circle USDC on Sui testnet */
const TESTNET_USDC =
  "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC" as const;

export const TESTNET = {
  /** stable_layer package — deployed 2025-03 */
  STABLE_LAYER_PACKAGE_ID: "0x3aa25959c431bddf707337753a35147873db01e7b2bb65cf7ff84df1c177b3cb",
  /** StableRegistry shared object — from testnet deployment */
  STABLE_REGISTRY: "0xe45d16ea6fba5c105e3cda1cc4d4199f10e4c4ab330c9ed3d0ef3a26b6c89803",
  USDC_TYPE: TESTNET_USDC,
  /** DummyFarmEntity<USDC> — required for create_stable type args (Create Coin flow) */
  STABLE_VAULT_FARM_ENTITY_TYPE:
    `0x94e129df2294654aa43a25336b9d9a12b073c14f0c49dab073fa07d2c707ddf6::dummy_farm::DummyFarmEntity<${TESTNET_USDC}>`,
  // Mint/Burn/Claim require stable_vault_farm + Bucket — not deployed on testnet
  STABLE_VAULT: "",
  STABLE_LP_TYPE: "",
  YUSDB_TYPE: "",
  STABLE_VAULT_FARM_PACKAGE_ID: "",
  SAVING_TYPE: "",
  YIELD_VAULT: "",
  STABLE_VAULT_FARM: "",
  YIELD_USDB_PACKAGE_ID: "",
  /** testnet_incentive_pool shared object (when using incentive pool flow) */
  TESTNET_INCENTIVE_POOL: "",
} as const;

export const STABLE_VAULT_FARM_ENTITY_TYPE_TESTNET = TESTNET.STABLE_VAULT_FARM_ENTITY_TYPE;
