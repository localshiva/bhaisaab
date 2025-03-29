import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import eslintPluginImportX from "eslint-plugin-import-x";
import noSecrets from "eslint-plugin-no-secrets";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { config, configs } from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  eslintConfigPrettier,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...config(
    configs.recommendedTypeChecked,
    configs.stylisticTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          project: "./tsconfig.json",
        },
      },
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],
        "no-implicit-coercion": [
          "error",
          {
            boolean: false,
            number: true,
            string: true,
            allow: [],
          },
        ],
        "@typescript-eslint/naming-convention": [
          "error",
          {
            selector: ["typeLike", "enumMember", "enum"],
            format: ["PascalCase"],
          },

          // Variables and parameters use camelCase
          {
            selector: "variable",
            format: ["camelCase", "UPPER_CASE", "PascalCase"],
            leadingUnderscore: "allow",
          },

          // Function declarations must be in camelCase
          {
            selector: "function",
            format: ["camelCase", "PascalCase"],
          },

          // Class methods must be in camelCase
          {
            selector: "method",
            format: ["camelCase"],
          },

          // Interface names must start with 'I'
          {
            selector: "interface",
            format: ["PascalCase"],
            prefix: ["I"],
          },

          // Type aliases must be in PascalCase
          {
            selector: "typeAlias",
            format: ["PascalCase"],
          },

          // Generic type parameters must start with 'T'
          {
            selector: "typeParameter",
            format: ["PascalCase"],
            prefix: ["T"],
          },

          // React component props interface must end with 'Props'
          {
            selector: "interface",
            filter: {
              regex: "Props$",
              match: true,
            },
            format: ["PascalCase"],
            suffix: ["Props"],
          },

          // React component state interface must end with 'State'
          {
            selector: "interface",
            filter: {
              regex: "State$",
              match: true,
            },
            format: ["PascalCase"],
            suffix: ["State"],
          },

          // Private class members must have leading underscore
          {
            selector: "memberLike",
            modifiers: ["private"],
            format: ["camelCase"],
            leadingUnderscore: "require",
          },

          // Protected class members may have leading underscore
          {
            selector: "memberLike",
            modifiers: ["protected"],
            format: ["camelCase"],
            leadingUnderscore: "allow",
          },

          // Boolean variables should start with is/has/should/can/will
          {
            selector: ["variable"],
            types: ["boolean"],
            format: ["PascalCase"],
            prefix: ["is", "has", "should", "can", "will", "was", "does"],
          },
        ],
      },
    },
    {
      files: ["**/*.js", "**/*.jsx", "**/*.json", "**/*.mjs", "**/*.cjs"],
      extends: [configs.disableTypeChecked],
      rules: {
        "@typescript-eslint/no-unused-expressions": "off",
      },
    },
  ),
  eslintPluginUnicorn.configs["recommended"],
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  {
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        }),
      ],
    },
  },
  {
    rules: {
      "sort-imports": "off", // Superseded by simple-import-sort
      "import-x/order": "off", // Superseded by simple-import-sort

      "import-x/first": "error",
      "import-x/newline-after-import": "error",
      "import-x/no-duplicates": "error",
      "import-x/no-extraneous-dependencies": "error",
      "import-x/no-anonymous-default-export": "error",
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    rules: {
      "unicorn/no-unused-properties": "error",
      "unicorn/better-regex": "error",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",
    },
  },
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
  },
  {
    plugins: {
      "no-secrets": noSecrets,
    },
    rules: {
      "no-secrets/no-secrets": [
        "error",
        { ignoreContent: "NEXT_PUBLIC_*|NEXT_APP_*" },
      ],
    },
  },
  // Debug
  {
    rules: {
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
      "no-debugger": "error",
      // Make sure you combine this with a ticket to be able to track down the issue
      "no-warning-comments": [
        "warn",
        { terms: ["todo", "fixme"], location: "start" },
      ],
    },
  },
  // JavaScript
  {
    rules: {
      "prefer-object-spread": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      "array-callback-return": "error",
      "no-await-in-loop": "error",
      "no-constructor-return": "error",
      "no-inner-declarations": "error",
      "no-promise-executor-return": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",
      "no-unmodified-loop-condition": "error",
      "no-unreachable-loop": "error",
      "no-unused-private-class-members": "error",
      "no-use-before-define": "error",
      "require-atomic-updates": "error",
      "block-scoped-var": "error",
      "consistent-return": "error",
      "accessor-pairs": "error",
      "default-case": "error",
      "default-case-last": "error",
      eqeqeq: "error",
      "guard-for-in": "error",
      "no-alert": "error",
      "no-caller": "error",
      "no-continue": "error",
      "no-else-return": "error",
      "no-eq-null": "error",
      "no-eval": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-extra-label": "error",
      "no-implicit-coercion": "error",
      "no-implied-eval": "error",
      "no-empty": "error",
      "no-empty-function": "error",
      "no-lone-blocks": "error",
      "no-lonely-if": "error",
      "no-loop-func": "error",
      "no-multi-assign": "error",
      "no-multi-str": "error",
      "no-nested-ternary": "error",
      "no-new": "error",
      "no-new-func": "error",
      "no-new-object": "error",
      "no-new-wrappers": "error",
      "no-octal-escape": "error",
      "no-param-reassign": "error",
      "no-proto": "error",
      "no-return-assign": "error",
      "no-return-await": "error",
      "no-self-assign": "error",
      "no-plusplus": "error",
      "no-redeclare": "error",
      "no-restricted-properties": "error",
      "no-useless-call": "error",
      "no-useless-catch": "error",
      "no-useless-concat": "error",
      "no-useless-return": "error",
      radix: "error",
    },
  },
];

export default eslintConfig;
