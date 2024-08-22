import React from "react";
import LocationWarningMessage from "./LocationWarningMessage";
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

describe("LocationWarningMessage snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = render(
      <LocationWarningMessage
        city="Paris"
        totalContent={42}
        onClose={() => null}
        onPress={() => null}
      />
    );
    expect(test).toMatchSnapshot();
  });
});
