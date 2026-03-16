/**
 * Diagnostic script: query Stable Layer on-chain state.
 *
 * Usage (from repository root):
 *   pnpm dlx tsx skills/stablelayer-sdk/scripts/query-state.ts
 *
 * Optional env vars:
 *   NETWORK=mainnet|testnet
 *   SENDER=0x...
 *   STABLE_COIN_TYPE=0x...::module::Type
 *   SUI_GRPC_URL=https://fullnode.mainnet.sui.io:443
 */

import { bcs } from "@mysten/sui/bcs";
import { SuiGrpcClient } from "@mysten/sui/grpc";

import { StableLayerClient } from "../../../src/index.js";
import * as constants from "../../../src/libs/constants.js";

type Network = "mainnet" | "testnet";

const DEFAULT_NETWORK: Network = "mainnet";
const DEFAULT_SENDER =
  "0x2b986d2381347d9e1c903167cf9b36da5f8eaba6f0db44e0c60e40ea312150ca";
const DEFAULT_STABLE_COIN_TYPE =
  "0x6d9fc33611f4881a3f5c0cd4899d95a862236ce52b3a38fef039077b0c5b5834::btc_usdc::BtcUSDC";

function printLine(message = "") {
  process.stdout.write(`${message}\n`);
}

function parseNetwork(input: string | undefined): Network {
  if (input === "mainnet" || input === "testnet") {
    return input;
  }
  return DEFAULT_NETWORK;
}

function formatRawAmount(raw: string | undefined, decimals = 6): string {
  if (!raw) return "undefined";
  const value = BigInt(raw);
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const fractionRaw = (value % base).toString().padStart(decimals, "0");
  const fraction = fractionRaw.replace(/0+$/, "");
  return fraction.length > 0 ? `${whole.toString()}.${fraction}` : whole.toString();
}

async function queryDynamicSupply(suiClient: SuiGrpcClient, stableCoinType: string) {
  const TypeName = bcs.struct("TypeName", { name: bcs.string() });
  const nameBcs = TypeName.serialize({ name: stableCoinType.slice(2) }).toBytes();

  const result = await suiClient.core.getDynamicObjectField({
    parentId: constants.STABLE_REGISTRY,
    name: {
      type: "0x1::type_name::TypeName",
      bcs: nameBcs,
    },
    include: { json: true },
  });

  const json = result.object?.json as
    | { treasury_cap?: { total_supply?: { value?: string } } }
    | null
    | undefined;

  return json?.treasury_cap?.total_supply?.value;
}

async function main() {
  const network = parseNetwork(process.env.NETWORK);
  const sender = process.env.SENDER ?? DEFAULT_SENDER;
  const stableCoinType = process.env.STABLE_COIN_TYPE ?? DEFAULT_STABLE_COIN_TYPE;
  const baseUrl = process.env.SUI_GRPC_URL;
  const rpcUrl = baseUrl ?? `https://fullnode.${network}.sui.io:443`;

  printLine("Initializing StableLayerClient...");
  printLine(`  network: ${network}`);
  printLine(`  sender:  ${sender}`);
  printLine(`  rpc:     ${rpcUrl}`);
  printLine();

  const client = await StableLayerClient.initialize({
    network,
    sender,
    baseUrl,
  });

  const suiClient = new SuiGrpcClient({
    network,
    baseUrl: rpcUrl,
  });

  printLine("=== Core Constants ===");
  printLine(`STABLE_REGISTRY:            ${constants.STABLE_REGISTRY}`);
  printLine(`STABLE_LAYER_PACKAGE_ID:    ${constants.STABLE_LAYER_PACKAGE_ID}`);
  printLine(`STABLE_VAULT_FARM_PACKAGE:  ${constants.STABLE_VAULT_FARM_PACKAGE_ID}`);
  printLine(`YIELD_USDB_PACKAGE_ID:      ${constants.YIELD_USDB_PACKAGE_ID}`);
  printLine();

  printLine("=== Supply Queries ===");
  const totalSupply = await client.getTotalSupply();
  printLine(`Registry total supply (raw): ${totalSupply ?? "undefined"}`);
  printLine(`Registry total supply:       ${formatRawAmount(totalSupply)} (6 decimals)`);
  printLine();

  printLine(`Coin type query target: ${stableCoinType}`);
  let supplyByCoinType: string | undefined;
  try {
    supplyByCoinType = await client.getTotalSupplyByCoinType(stableCoinType);
    printLine(`SDK supply by coin type:     ${supplyByCoinType ?? "undefined"}`);
    printLine(`SDK supply by coin type:     ${formatRawAmount(supplyByCoinType)} (6 decimals)`);
  } catch (error) {
    printLine(`SDK coin-type query failed:  ${(error as Error).message}`);
  }

  try {
    const dynamicSupply = await queryDynamicSupply(suiClient, stableCoinType);
    printLine(`Dynamic field supply:        ${dynamicSupply ?? "undefined"}`);
    printLine(`Dynamic field supply:        ${formatRawAmount(dynamicSupply)} (6 decimals)`);
  } catch (error) {
    printLine(`Dynamic field query failed:  ${(error as Error).message}`);
  }
  printLine();

  printLine("=== Registry Object ===");
  const registry = await suiClient.getObject({
    objectId: constants.STABLE_REGISTRY,
    include: { json: true },
  });
  const registryJson = registry.object?.json as { total_supply?: string } | null | undefined;
  printLine(`total_supply from object:    ${registryJson?.total_supply ?? "undefined"}`);
  printLine();

  printLine("Done.");
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
