import path from "path";
import type { Config } from "jest";

const config: Config = {
  // Keep jsdom for any UI-adjacent tests at root; package tests have their own configs
  testEnvironment: "jsdom",
  roots: ["<rootDir>/packages", "<rootDir>/tests"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  collectCoverageFrom: ["packages/**/*.{ts,tsx}"],
  coverageDirectory: "<rootDir>/coverage",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.js",
    "^react-syntax-highlighter$":
      "<rootDir>/__mocks__/react-syntax-highlighter.js",
    "^react-syntax-highlighter/dist/esm/styles/prism$":
      "<rootDir>/__mocks__/syntax-styles-prism.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "babel-jest",
      { configFile: path.join(__dirname, "babel.config.cjs") },
    ],
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/packages/.*/vite.config.ts",
    "<rootDir>/packages/.*/dist/",
    "<rootDir>/packages/.*/tests/",
    "<rootDir>/packages/.*/playwright.config.ts",
  ],
  transformIgnorePatterns: ["node_modules/(?!(uuid)/)"],
  testPathIgnorePatterns: ["<rootDir>/packages/ui-desktop/tests"],
};

export default config;
