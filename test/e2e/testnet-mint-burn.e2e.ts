/** Opt-in live testnet mint→burn. Set E2E_TESTNET_MINT_BURN=1, E2E_TESTNET_STABLE_COIN_TYPE, E2E_TESTNET_PRIVATE_KEY or SUI_PRIVATE_KEY. Run: `pnpm test:e2e:testnet`. */

import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { describe, expect, it } from "vitest";

import { StableLayerClient } from "../../src/index.js";
import { getConstants } from "../../src/libs/constants.js";

function e2eTestnetMintBurnEnabled(): boolean {
  return (
    process.env.E2E_TESTNET_MINT_BURN === "1" &&
    Boolean(process.env.E2E_TESTNET_STABLE_COIN_TYPE?.trim()) &&
    Boolean(process.env.E2E_TESTNET_PRIVATE_KEY?.trim() || process.env.SUI_PRIVATE_KEY?.trim())
  );
}

function loadE2eKeypair(): Ed25519Keypair {
  const raw = process.env.E2E_TESTNET_PRIVATE_KEY?.trim() || process.env.SUI_PRIVATE_KEY?.trim();
  if (!raw) {
    throw new Error("E2E: missing E2E_TESTNET_PRIVATE_KEY or SUI_PRIVATE_KEY");
  }
  return Ed25519Keypair.fromSecretKey(raw);
}

function unwrapTxResult(result: unknown): { digest?: string; success?: boolean } {
  const r =
    (result as { Transaction?: { digest?: string; status?: { success?: boolean } } }).Transaction ??
    result;
  const o = r as { digest?: string; status?: { success?: boolean } };
  return {
    digest: o.digest,
    success: o.status?.success,
  };
}

describe.skipIf(!e2eTestnetMintBurnEnabled())("testnet mint → burn (live chain)", () => {
  it("mints then burns the same USDC raw amount", { timeout: 180_000 }, async () => {
    const stableCoinType = process.env.E2E_TESTNET_STABLE_COIN_TYPE!.trim();
    const amount = process.env.E2E_TESTNET_AMOUNT
      ? BigInt(process.env.E2E_TESTNET_AMOUNT)
      : 1_000_000n;

    const keypair = loadE2eKeypair();
    const sender = keypair.toSuiAddress();

    const suiClient = new SuiGrpcClient({
      network: "testnet",
      baseUrl: "https://fullnode.testnet.sui.io:443",
    });

    const mockReg = process.env.E2E_TESTNET_MOCK_FARM_REGISTRY?.trim();
    const mockPkg = process.env.E2E_TESTNET_MOCK_FARM_PACKAGE?.trim();

    const client = await StableLayerClient.initialize({
      network: "testnet",
      sender,
      suiClient,
      ...(mockReg ? { mockFarmRegistryId: mockReg } : {}),
      ...(mockPkg ? { mockFarmPackageId: mockPkg } : {}),
    });

    const usdcType = getConstants("testnet").USDC_TYPE;

    const mintTx = new Transaction();
    await client.buildMintTx({
      tx: mintTx,
      stableCoinType,
      amount,
      sender,
      usdcCoin: coinWithBalance({ balance: amount, type: usdcType })(mintTx),
      autoTransfer: true,
    });

    const mintRes = await suiClient.signAndExecuteTransaction({
      transaction: mintTx,
      signer: keypair,
      include: { effects: true },
    });
    const mintOut = unwrapTxResult(mintRes);
    expect(mintOut.success, `mint failed digest=${mintOut.digest}`).toBe(true);
    expect(mintOut.digest).toBeTruthy();

    const burnTx = new Transaction();
    await client.buildBurnTx({
      tx: burnTx,
      stableCoinType,
      amount,
      sender,
      autoTransfer: true,
    });

    const burnRes = await suiClient.signAndExecuteTransaction({
      transaction: burnTx,
      signer: keypair,
      include: { effects: true },
    });
    const burnOut = unwrapTxResult(burnRes);
    expect(burnOut.success, `burn failed digest=${burnOut.digest}`).toBe(true);
    expect(burnOut.digest).toBeTruthy();
  });
});
