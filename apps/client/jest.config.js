const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: __dirname,
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  testEnvironment: "jest-environment-jsdom",
  rootDir: "./",
  setupFilesAfterEnv: ["./jest/setup.js"],
  testMatch: [
    "**/__tests__/**/*.test.(js|jsx|ts|tsx)",
    "**/__tests__/**/*.spec.(js|jsx|ts|tsx)",
    "**/?(*.)+(spec|test).(js|jsx|ts|tsx)",
  ],
  transform: {
    "^.+\\.(t|j)sx?$": ["babel-jest", { presets: ["next/babel"] }],
    "^.+\\.mjs$": ["babel-jest", { presets: ["next/babel"] }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "mjs", "json", "node"],
  modulePathIgnorePatterns: ["<rootDir>/.dist"],
  testPathIgnorePatterns: ["/node_modules/", "/__fixtures__/", "/__mocks__/"],
  // Transpile ESM packages from node_modules used in tests
  transformIgnorePatterns: ["node_modules/(?!@codegouvfr/react-dsfr|@lottiefiles|bson|mongodb)"],
  moduleNameMapper: {
    // Map tokens subpath to the same mock (it exports tokens)
    "^@refugies-info/ui/tokens$": "<rootDir>/jest/__mocks__/@refugies-info/ui.js",
    "^@refugies-info/ui$": "<rootDir>/jest/__mocks__/@refugies-info/ui.js",
    "^@refugies-info/ui/(.*)$": "<rootDir>/jest/__mocks__/@refugies-info/ui.js",
    // The TypeScript path resolves to packages/ui/src/* - map tokens to mock
    "^.*/packages/ui/src/tokens$": "<rootDir>/jest/__mocks__/@refugies-info/ui.js",
    // Force bson to CJS build from workspace root to avoid ESM in tests
    "^bson$": "<rootDir>/../../node_modules/bson/lib/bson.cjs",
    "^bson/lib/bson\\.mjs$": "<rootDir>/../../node_modules/bson/lib/bson.cjs",
  },
};

module.exports = createJestConfig(customJestConfig);
