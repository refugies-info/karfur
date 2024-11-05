import { initialRootStateFactory } from "~/services/redux/reducers";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import NotificationsModal from "./NotificationsModal";
import useNotificationsModal from "./useNotificationsModal";

// @see https://stackoverflow.com/questions/50793885/referenceerror-you-are-trying-to-import-a-file-after-the-jest-environment-has
jest.useFakeTimers();

jest.mock("./useNotificationsModal", () => jest.fn());

describe("NotificationsModal snapshot test suite", () => {
  it("should render without bug", async () => {
    (useNotificationsModal as jest.Mock).mockReturnValueOnce({
      visible: true,
      hide: jest.fn(),
    });
    const test = wrapWithProvidersAndRender({
      Component: NotificationsModal,
      reduxState: {
        ...initialRootStateFactory(),
      },
    });
    expect(test).toMatchSnapshot();
  });
  it("should render not visible", async () => {
    (useNotificationsModal as jest.Mock).mockReturnValueOnce({
      visible: false,
      hide: jest.fn(),
    });
    const test = wrapWithProvidersAndRender({
      Component: NotificationsModal,
      reduxState: {
        ...initialRootStateFactory(),
      },
    });
    expect(test).toMatchSnapshot();
  });
});
