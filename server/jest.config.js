module.exports = {
  preset: "ts-jest",
  moduleFileExtensions: ["ts", "tsx", "js", "d.ts"],
  transform: {
    "^.+\\.(js)$": "<rootDir>/node_modules/babel-jest",
    "\\.(ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/?!(static-container)"],
  testRegex: "(/__tests__/.*|\\.(test))\\.(ts|tsx|js)$",
  testPathIgnorePatterns: ["\\.snap$", "<rootDir>/node_modules/", "<rootDir>/dist/"],
  cacheDirectory: ".jest/cache",
  coveragePathIgnorePatterns: ["/node_modules/", "/src/environment"],
  collectCoverage: false,
  // https://stackoverflow.com/questions/71743639/getting-rangeerror-maximum-call-stack-size-exceeded-when-unit-testing-with-mo
  // moduleDirectories: ["node_modules", "src"],
  testEnvironment: "node",
  setupFilesAfterEnv: ["./src/jest/setupJest.js"],
};
