import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/packages", "<rootDir>/tests"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  collectCoverageFrom: ["packages/**/*.ts"],
  coverageDirectory: "<rootDir>/coverage",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.base.json",
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!(uuid)/)"],
  testPathIgnorePatterns: ["<rootDir>/packages/ui-desktop/tests"],
};

export default config;
