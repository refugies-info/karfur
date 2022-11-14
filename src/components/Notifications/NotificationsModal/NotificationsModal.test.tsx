import React from "react";
import NotificationsModal from "./NotificationsModal";
import { render } from "../../utils/tests";
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
    const test = await render(<NotificationsModal />);
    expect(test).toMatchSnapshot();
  });
  it("should render not visible", async () => {
    (useNotificationsModal as jest.Mock).mockReturnValueOnce({
      visible: false,
      hide: jest.fn(),
    });
    const test = await render(<NotificationsModal />);
    expect(test).toMatchSnapshot();
  });
});
