import { wrapWithProvidersAndRender } from "../../jest/wrapWithProvidersAndRender";
import { HeaderWithLogo } from "../HeaderWithLogo";
import i18n from "../../services/i18n";

jest.mock("../../services/i18n", () => ({
  __esModule: true, // this property makes it work
  default: { isRTL: jest.fn() },
}));

describe("HeaderWithLogo", () => {
  it("should render correctly with LTR", () => {
    i18n.isRTL.mockReturnValueOnce(false);
    const component = wrapWithProvidersAndRender({ Component: HeaderWithLogo });
    expect(component).toMatchSnapshot();
  });

  it("should render correctly with RTL", () => {
    i18n.isRTL.mockReturnValueOnce(true);
    const component = wrapWithProvidersAndRender({ Component: HeaderWithLogo });
    expect(component).toMatchSnapshot();
  });
});
