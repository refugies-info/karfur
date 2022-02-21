const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  testEnvironment: "jest-environment-jsdom",
  rootDir: "./",
  setupFilesAfterEnv: ["./jest/setup.js"],
}

module.exports = createJestConfig(customJestConfig)
