import * as esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";
import { exec as nodeExec } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(nodeExec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entryPoint = path.resolve(__dirname, "src/index.ts");
const targetNode = ["node20"];
const TYPES_CONFIG = "tsconfig.types.json";

async function runCommand(command) {
  console.log(`\n➡️  runCommand: ${command}`);
  try {
    const { stdout, stderr } = await exec(command);
    if (stdout) {
      console.log(stdout.trim());
    }
    if (stderr) {
      console.error(`stderr: ${stderr.trim()}`);
    }
  } catch (error) {
    console.error(`\n❌ Command Fail: ${command}`);
    console.error(error.stderr || error.stdout || error.message);
    process.exit(1);
  }
}

async function build() {
  console.log("📦 Starting esbuild process...");

  // Build CJS
  await esbuild.build({
    entryPoints: [entryPoint],
    outfile: "dist/cjs/index.cjs",
    bundle: true,
    platform: "node",
    format: "cjs",
    sourcemap: true,
    target: targetNode,
    logLevel: "info",
    packages: "external",
  });

  // Build ESM
  await esbuild.build({
    entryPoints: [entryPoint],
    outfile: "dist/esm/index.mjs",
    bundle: true,
    platform: "node",
    format: "esm",
    sourcemap: true,
    target: targetNode,
    logLevel: "info",
    packages: "external",
  });

  await runCommand(`./node_modules/.bin/tsc -p ${TYPES_CONFIG}`);
  console.log("✅ esbuild finished successfully.");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
