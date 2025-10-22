import type { Config } from "jest";
import path from "path";

// Jest config scoped to the ui-desktop package using babel-jest to transpile TS/TSX.
// Playwright E2E specs in ./tests are ignored here; they run in a separate job.
const config: Config = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageDirectory: "<rootDir>/coverage",
  coveragePathIgnorePatterns: [
    "<rootDir>/src/main.ts", // Electron main process bootstrap (not jsdom-testable)
    "<rootDir>/src/global.d.ts",
  ],
  setupFilesAfterEnv: ["<rootDir>/../../jest.setup.ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/../../__mocks__/fileMock.js",
    "^react-syntax-highlighter$":
      "<rootDir>/../../__mocks__/react-syntax-highlighter.js",
    "^react-syntax-highlighter/dist/esm/styles/prism$":
      "<rootDir>/../../__mocks__/syntax-styles-prism.js",
  },
  transform: {
    "^.+\\.(t|j)sx?$": [
      "babel-jest",
      {
        // Use package-local Babel config (absolute path to avoid Jest token expansion issues)
        configFile: path.join(__dirname, "babel.config.cjs"),
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!(uuid)/)"],
  testPathIgnorePatterns: ["<rootDir>/tests"],
  coverageThreshold: {
    global: {
      lines: 85,
      statements: 85,
      functions: 85,
      branches: 75,
    },
  },
};

export default config;
