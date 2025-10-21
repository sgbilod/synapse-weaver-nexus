import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  eslint.configs.recommended,
  {
    files: ["packages/**/*.ts", "packages/**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "off", // Turn off base rule
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-undef": "off", // TypeScript handles undefined vars
      "no-useless-escape": "warn",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Allow any in tests
    },
  },
  {
    files: ["packages/**/src/**/logger.{ts,tsx,cts,cjs}"],
    rules: {
      // Allow console usage only in dedicated logger modules. All other source files
      // should use the repository logging abstraction (logger.*) to centralize
      // diagnostics and avoid ad-hoc console calls.
      "no-console": "off",
    },
  },
  {
    ignores: [
      "**/dist/**",
      "**/dist-electron/**",
      "**/.history/**",
      "**/*.d.ts",
      "**/*.js",
      "**/*.cjs",
      "**/*.mjs",
      "**/node_modules/**",
    ],
  },
];
