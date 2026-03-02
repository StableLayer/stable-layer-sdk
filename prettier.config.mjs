/** @type {import('prettier').Config} */
const config = {
  endOfLine: "lf",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  printWidth: 100,
  importOrder: ["<THIRD_PARTY_MODULES>", "", "^[./]", "^[../]"],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
};

export default config;
