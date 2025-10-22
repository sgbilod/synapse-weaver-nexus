import path from "path";
import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "babel-jest",
      { configFile: path.join(__dirname, "babel.config.cjs") },
    ],
  },
  // Allow transforming specific ESM dependencies shipped as ESM in node_modules
  transformIgnorePatterns: ["/node_modules/(?!(uuid)/)"],
  moduleNameMapper: {
    "^vscode$": "<rootDir>/__mocks__/vscode.js",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/__tests__/**"],
  coverageDirectory: "<rootDir>/coverage",
};

export default config;
