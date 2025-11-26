import { StableCoinType } from "../interface.js";

export const STABLE_VAULT =
  "0x65f38160110cd6859d05f338ff54b4f462883bb6f87c667a65c0fb0e537410a7";

export const USDC_TYPE =
  "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC";

export const STABLE_LP_TYPE =
  "0xb75744fadcbfc174627567ca29645d0af8f6e6fd01b6f57c75a08cd3fb97c567::lake_usdc::LakeUSDC";

export const YUSDB_TYPE =
  "0xac718b4b672d7f461fe7e86847166ff9c23cadba217397f0848a95bdea1f1051::yesusdb::YesUSDB";

export const STABLE_LAYER_PACKAGE_ID =
  "0x41e25d09e20cf3bc43fe321e51ef178fac419ae47b783a7161982158fc9f17d6";

export const STABLE_VAULT_FARM_PACKAGE_ID =
  "0xd5b9fb5a964fa9c274e07a788d7b6d36d8df1c73e2e6f795f8db852621470b70";

// Bucket Protocol dependencies
export const SAVING_TYPE =
  "0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB";

export const YIELD_VAULT =
  "0x0a7f6325253157cd437812fea0ceee9a6b96f2ec5eac410da6df39558ff3a4d1";

export const STABLE_REGISTRY =
  "0x213f4d584c0770f455bb98c94a4ee5ea9ddbc3d4ebb98a0ad6d093eb6da41642";

export const STABLE_VAULT_FARM_ENTITY_TYPE = `0xc1025fe014b03d33b207b5afb0ba04293be87fab438c1418a26a75c2fe05c223::stable_vault_farm::StableVaultFarmEntity<${STABLE_LP_TYPE}, ${USDC_TYPE}>`;

export const STABLE_VAULT_FARM =
  "0xe958b7d102b33bf3c09addb0e2cdff102ff2c93afe407ec5c2a541e8959a650c";

export const YIELD_USDB_PACKAGE_ID =
  "0x203eebc39442014a1b8180f3b8ed70143dac2c5d28ba5703fe34c21052728705";

// Stable Coins
export const BTC_USD_TYPE =
  "0x6d9fc33611f4881a3f5c0cd4899d95a862236ce52b3a38fef039077b0c5b5834::btc_usdc::BtcUSDC";

export const STABLE_COIN_TYPES: Record<StableCoinType, string> = {
  btcUSDC: BTC_USD_TYPE,
};
