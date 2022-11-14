import React from "react";
import LocationWarningModal from "./LocationWarningModal";
import { render } from "../../../utils/tests";

jest.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));
jest.mock("react-native-safe-area-context", () => ({
  ...jest.requireActual("react-native-safe-area-context"),
  useSafeAreaInsets: jest
    .fn()
    .mockReturnValue({ top: 2, right: 2, left: 2, bottom: 2 }),
}));

// @see https://stackoverflow.com/questions/50793885/referenceerror-you-are-trying-to-import-a-file-after-the-jest-environment-has
jest.useFakeTimers();

describe("LocationWarningModal snapshot test suite", () => {
  it("should render without bug", () => {
    const test = render(
      <LocationWarningModal
        isVisible
        nbGlobalContent={42}
        nbLocalizedContent={6}
        city="Roubaix"
        closeModal={() => null}
      />
    );
    expect(test).toMatchSnapshot();
  });
});
