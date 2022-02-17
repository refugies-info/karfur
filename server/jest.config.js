module.exports = {
  preset: "ts-jest",
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.(js)$": "<rootDir>/node_modules/babel-jest",
    "\\.(ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/?!(static-container)"],
  testRegex: "(/__tests__/.*|\\.(test))\\.(ts|tsx|js)$",
  testPathIgnorePatterns: [
    "\\.snap$",
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
  ],
  cacheDirectory: ".jest/cache",
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/src/environment"],
  collectCoverage: false,
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
  },
  testEnvironment: "node"
};
