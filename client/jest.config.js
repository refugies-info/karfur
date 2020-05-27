module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.(js)$": "<rootDir>/node_modules/babel-jest",
    "\\.(ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/?!(static-container)"],
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  testPathIgnorePatterns: ["\\.snap$", "<rootDir>/node_modules/"],
  cacheDirectory: ".jest/cache",
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/src/environment"],
  collectCoverage: false,
};
