import { fireEvent } from "@testing-library/react-native";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { render } from "../../utils/tests";
import LanguageDetailsButton from "./LanguageDetailsButton";

describe("LanguageDetailsButton snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(
      <LanguageDetailsButton isSelected langueCode="fr" langueFr="Français" langueLoc="Français" onPress={() => null} />,
    );
    expect(test).toMatchSnapshot();
  });

  it("should render not selected", async () => {
    const test = await render(
      <LanguageDetailsButton isSelected={false} langueCode="fr" langueFr="Français" langueLoc="Français" onPress={() => null} />,
    );
    expect(test).toMatchSnapshot();
  });

  it("should render with local language", async () => {
    const test = await render(
      <LanguageDetailsButton isSelected langueCode="en" langueFr="Anglais" langueLoc="English" onPress={() => null} />,
    );
    expect(test).toMatchSnapshot();
  });

  it("should render with radio hided", async () => {
    const test = await render(
      <LanguageDetailsButton isSelected langueCode="en" langueFr="Anglais" langueLoc="English" onPress={() => null} hideRadio />,
    );
    expect(test).toMatchSnapshot();
  });

  it("should react on press", async () => {
    const mockOnPress = jest.fn();

    const component = wrapWithProvidersAndRender({
      Component: LanguageDetailsButton,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: {
        isSelected: true,
        langueFr: "Anglais",
        langueLoc: "English",
        onPress: mockOnPress,
        hideRadio: true,
      },
    });

    const Button = component.getByTestId("test-language-button-Anglais");
    fireEvent.press(Button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
