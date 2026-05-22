import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

import reactPlugin from "eslint-plugin-react";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,

  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022, // ✅ Stable ECMAScript version
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
      },
    },

    plugins: {
      react: reactPlugin,
      "@typescript-eslint": tsPlugin,
      "@tanstack/query": tanstackQuery,
    },

    settings: {
      react: { version: "detect" },
    },

    rules: {
      // React rules
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
      "react/jsx-filename-extension": [
        "error",
        { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      ],
      "react/jsx-props-no-spreading": "off",
      "react/no-unknown-property": ["error", { ignore: ["tw"] }],
      "react/function-component-definition": [
        "error",
        {
          namedComponents: ["function-declaration", "arrow-function"],
          unnamedComponents: "arrow-function",
        },
      ],
      "react/prop-types": "off",
      "prefer-const": "off",

      // TS rules
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-member-accessibility": "off",
      "@typescript-eslint/indent": "off",
      "@typescript-eslint/member-delimiter-style": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],

      // General
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },

  {
    files: ["*.ts", "*.tsx"],
    rules: {
      "no-undef": "off",
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".intlayer/**",
  ]),
]);
