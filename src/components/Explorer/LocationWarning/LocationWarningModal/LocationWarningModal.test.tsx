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
