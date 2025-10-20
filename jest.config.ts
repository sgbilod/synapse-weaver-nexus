import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  // Use jsdom so React components can be rendered in tests
  testEnvironment: "jsdom",
  roots: ["<rootDir>/packages", "<rootDir>/tests"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  // Include TSX files in coverage collection so UI components are measured
  collectCoverageFrom: ["packages/**/*.{ts,tsx}"],
  coverageDirectory: "<rootDir>/coverage",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    // Allow importing .js extensions in ESM code
    "^(\\.{1,2}/.*)\\.js$": "$1",
    // Mock CSS modules/styles during tests
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Mock static assets
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.js",
    // Mock react-syntax-highlighter imports (ESM) that otherwise break Jest
    "^react-syntax-highlighter$":
      "<rootDir>/__mocks__/react-syntax-highlighter.js",
    "^react-syntax-highlighter/dist/esm/styles/prism$":
      "<rootDir>/__mocks__/syntax-styles-prism.js",
  },
  // Configure setup files to include jest-dom matchers
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        // Use a test-specific tsconfig that enables JSX for React component tests
        tsconfig: "<rootDir>/tsconfig.jest.json",
        useESM: true,
      },
    ],
  },
  // Ignore build/config/test helper files from coverage collection
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
