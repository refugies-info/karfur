module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js"],
  preset: "ts-jest",
  transform: {
    "^.+\\.(js)$": "<rootDir>/node_modules/babel-jest",
    "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest",
  },
  transformIgnorePatterns: ["node_modules/?!(static-container)"],
  testRegex: "(/__tests__/.*|\\.(test))\\.(ts|tsx|js)$",
  testPathIgnorePatterns: ["\\.snap$", "<rootDir>/node_modules/"],
  cacheDirectory: ".jest/cache",
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/src/environment"],
  collectCoverage: false,
  moduleNameMapper: {
    "\\.(scss|less)$": "identity-obj-proxy",
  },
  snapshotSerializers: ["<rootDir>/node_modules/enzyme-to-json/serializer"],
};
