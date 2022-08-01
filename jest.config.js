process.env.TZ = "UTC";
process.env.TS_JEST_DISABLE_VER_CHECKER = true;

module.exports = {
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  moduleFileExtensions: ["js", "jsx", "json", "vue", "ts"],
  verbose: true,
  transform: {
    "^.+\\.vue$": "@vue/vue2-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "tests/(.*)$": "<rootDir>/tests/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },

  snapshotSerializers: ["jest-serializer-vue"],

  testMatch: [
    "**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)"
  ],
  setupFilesAfterEnv: ["./tests/test-setup.ts"],
  testURL: "http://localhost/",
  collectCoverage: true,

  collectCoverageFrom: [
    "src/**/*.{js,vue}",
    "!src/*.js",
    "!src/axios/*.js",
    "!src/router/*.js"
  ],

  coverageReporters: ["json-summary", "text", "lcov"],
  preset: "ts-jest"
};
