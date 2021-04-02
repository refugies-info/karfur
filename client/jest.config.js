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
  roots: ["<rootDir>"],

  globals: {
    "ts-jest": {
      tsConfig: "./tsconfig.json",
      diagnostics: false,
      isolatedModules: true,
    },
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/src/environment"],
  collectCoverage: false,
  snapshotSerializers: ["<rootDir>/node_modules/enzyme-to-json/serializer"],
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "<rootDir>/jest/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/jest/__mocks__/fileMock.js",
  },
  setupFiles: ["./jest/setup.js"],
};
