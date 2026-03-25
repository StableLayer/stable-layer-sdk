import type { Network } from "../interface.js";
import * as mainnet from "./constants.mainnet.js";
import * as testnet from "./constants.testnet.js";

export type Constants = {
  STABLE_VAULT: string;
  USDC_TYPE: string;
  STABLE_LP_TYPE: string;
  YUSDB_TYPE: string;
  STABLE_LAYER_PACKAGE_ID: string;
  STABLE_VAULT_FARM_PACKAGE_ID: string;
  SAVING_TYPE: string;
  YIELD_VAULT: string;
  STABLE_REGISTRY: string;
  STABLE_VAULT_FARM: string;
  YIELD_USDB_PACKAGE_ID: string;
  STABLE_VAULT_FARM_ENTITY_TYPE: string;
  MOCK_FARM_PACKAGE_ID: string;
  MOCK_FARM_REGISTRY: string;
  MOCK_USDB_TYPE: string;
};

function getMainnetConstants(): Constants {
  return {
    ...mainnet.MAINNET,
    STABLE_VAULT_FARM_ENTITY_TYPE: mainnet.STABLE_VAULT_FARM_ENTITY_TYPE_MAINNET,
    MOCK_FARM_PACKAGE_ID: "",
    MOCK_FARM_REGISTRY: "",
    MOCK_USDB_TYPE: "",
  };
}

function getTestnetConstants(): Constants {
  return {
    ...testnet.TESTNET,
    STABLE_VAULT_FARM_ENTITY_TYPE: testnet.STABLE_VAULT_FARM_ENTITY_TYPE_TESTNET,
  };
}

export function getConstants(network: Network): Constants {
  return network === "testnet" ? getTestnetConstants() : getMainnetConstants();
}

export const STABLE_VAULT = mainnet.MAINNET.STABLE_VAULT;
export const USDC_TYPE = mainnet.MAINNET.USDC_TYPE;
export const STABLE_LP_TYPE = mainnet.MAINNET.STABLE_LP_TYPE;
export const YUSDB_TYPE = mainnet.MAINNET.YUSDB_TYPE;
export const STABLE_LAYER_PACKAGE_ID = mainnet.MAINNET.STABLE_LAYER_PACKAGE_ID;
export const STABLE_VAULT_FARM_PACKAGE_ID = mainnet.MAINNET.STABLE_VAULT_FARM_PACKAGE_ID;
export const SAVING_TYPE = mainnet.MAINNET.SAVING_TYPE;
export const YIELD_VAULT = mainnet.MAINNET.YIELD_VAULT;
export const STABLE_REGISTRY = mainnet.MAINNET.STABLE_REGISTRY;
export const STABLE_VAULT_FARM = mainnet.MAINNET.STABLE_VAULT_FARM;
export const YIELD_USDB_PACKAGE_ID = mainnet.MAINNET.YIELD_USDB_PACKAGE_ID;
export const STABLE_VAULT_FARM_ENTITY_TYPE = mainnet.STABLE_VAULT_FARM_ENTITY_TYPE_MAINNET;
