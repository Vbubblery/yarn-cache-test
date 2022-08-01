module.exports = {
  root: true,
  overrides: [
    {
      env: {
        node: true,
        jest: true
      },
      files: ["**/*.ts", "**/*.vue", "**/*.js"],
      parser: "vue-eslint-parser",
      parserOptions: {
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: "./"
      },
      plugins: ["@typescript-eslint", "jest", "import"],
      settings: {
        "import/extensions": [".js", ".ts"],
        "import/resolver": {
          typescript: {}
        }
      },
      extends: [
        "plugin:vue/essential",
        "eslint:recommended",
        "@vue/typescript",
        // "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-recommended",
        "plugin:vue/recommended",
        "plugin:jest/recommended",
        "airbnb-typescript/base",
        "@vue/prettier"
      ],
      rules: {
        "no-console": "warn",
        "no-useless-catch": 0,
        "no-prototype-builtins": 0,
        "vue/no-mutating-props": 0,
        "vue/require-valid-default-prop": 0,
        "vue/no-lone-template": [
          "error",
          {
            ignoreAccessible: true
          }
        ],
        quotes: "off",
        "@typescript-eslint/quotes": [
          2,
          "double",
          {
            avoidEscape: true
          }
        ],
        //TODO: remove it while migrating to vue3
        "vue/no-deprecated-dollar-listeners-api": "off",
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/no-explicit-any": 2,
        "import/extensions": [
          "error",
          "ignorePackages",
          {
            js: "never",
            ts: "never",
            vue: "always"
          }
        ],
        "no-underscore-dangle": [
          "error",
          {
            allow: ["__typename"]
          }
        ],
        "@typescript-eslint/comma-dangle": "off",
        "import/no-extraneous-dependencies": [
          "error",
          {
            devDependencies: true,
            optionalDependencies: false,
            peerDependencies: false
          }
        ],
        "@typescript-eslint/naming-convention": [
          "error",
          { selector: "enumMember", format: ["UPPER_CASE"] }
        ]
      }
    },
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ]
};
