/* eslint-disable no-console */
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
jest.mock("@react-navigation/core", () => ({
  ...jest.requireActual("@react-navigation/core"),
  useRoute: jest.fn(),
  useNavigation: jest.fn().mockImplementation(() => ({
    goBack: jest.fn().mockImplementation(() => () => console.log("Go back")),
    navigate: jest
      .fn()
      .mockImplementation(() => (to) => console.log("Navigation to " + to)),
  })),
}));
