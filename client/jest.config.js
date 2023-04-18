const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  testEnvironment: "jest-environment-jsdom",
  rootDir: "./",
  setupFilesAfterEnv: ["./jest/setup.js"],
  transformIgnorePatterns: ["node_modules/(?!@codegouvfr/react-dsfr)"],
};

module.exports = createJestConfig(customJestConfig);
