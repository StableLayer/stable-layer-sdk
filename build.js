import * as esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entryPoint = path.resolve(__dirname, "src/index.ts");
const targetNode = ["node20"];

async function build() {
  console.log("📦 Starting esbuild process...");

  await esbuild.build({
    entryPoints: [entryPoint],
    outfile: "dist/index.cjs",
    bundle: true,
    platform: "node",
    format: "cjs",
    sourcemap: true,
    target: targetNode,
    external: ["@mysten/sui", "@mysten/bcs"],
    logLevel: "info",
  });

  await esbuild.build({
    entryPoints: [entryPoint],
    outfile: "dist/index.mjs",
    bundle: true,
    platform: "node",
    format: "esm",
    sourcemap: true,
    target: targetNode,
    external: ["@mysten/sui", "@mysten/bcs"],
    logLevel: "info",
  });

  console.log("✅ esbuild finished successfully.");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
