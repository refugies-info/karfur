const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: __dirname,
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  testEnvironment: "jest-environment-jsdom",
  rootDir: "./",
  setupFilesAfterEnv: ["./jest/setup.js"],
  transformIgnorePatterns: ["node_modules/(?!@codegouvfr/react-dsfr|@lottiefiles)"],
  moduleNameMapper: {
    "^@refugies-info/ui$": "<rootDir>/jest/__mocks__/@refugies-info/ui.js",
    "^@refugies-info/ui/(.*)$": "<rootDir>/jest/__mocks__/@refugies-info/ui.js",
  },
};

module.exports = createJestConfig(customJestConfig);
