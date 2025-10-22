import type { Config } from "jest";
import path from "path";

const config: Config = {
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageDirectory: "<rootDir>/coverage",
  moduleNameMapper: {
    // Allow importing ESM-style relative .js paths from TS source
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.(t|j)sx?$": [
      "babel-jest",
      {
        configFile: path.join(__dirname, "babel.config.cjs"),
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!(uuid)/)"],
};

export default config;
