module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": [
    "@nuxt/eslint-config"
  ],
  "overrides": [{
    "files": ["*.vue", "*.js", "*.ts"],
    "rules": {
      "no-undef": "off"
    }
  }],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["vue"],
  "rules": {
    "indent": ["error", 2],
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
    "@typescript-eslint/consistent-type-imports": "error",
    "vue/first-attribute-linebreak": ["error", {
      "singleline": "ignore", "multiline": "ignore"
    }],
    "vue/max-attributes-per-line": ["error", {
      "singleline": 100
    }],
    "vue/singleline-html-element-content-newline": ["off"],
    "vue/no-multiple-template-root": ["off"]
  },
  "ignorePatterns": [
    "node_modules/**/*",
    ".nuxt/**/*",
    "dist/**/*",
    ".output/**/*"
  ]
};
