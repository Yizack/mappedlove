import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt([{
  files: ["**/*.vue", "**/*.js", "**/*.ts"],
  ignores: [
    "node_modules/**/*",
    ".nuxt/**/*",
    "dist/**/*",
    ".output/**/*"
  ],
  rules: {
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", process.platform === "win32" ? "windows" : "unix"],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "camelcase": "off",
    "arrow-spacing": ["error", { "before": true, "after": true }],
    "no-console": ["error", {
      "allow": ["info", "warn"]
    }],
    "brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
    "no-multi-spaces": "error",
    "space-before-blocks": "error",
    "no-trailing-spaces": "error",
    "nuxt/prefer-import-meta": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "vue/first-attribute-linebreak": ["error", {
      "singleline": "ignore", "multiline": "ignore"
    }],
    "vue/max-attributes-per-line": ["error", {
      "singleline": 100
    }],
    "vue/singleline-html-element-content-newline": ["off"],
    "vue/no-multiple-template-root": ["off"]
  }
}]);
