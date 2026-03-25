import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/e2e/testnet-mint-burn.e2e.ts"],
  },
});
