import CheckCode from "./CheckCode";
import mockRouter from "next-router-mock";
import { act, ReactTestRenderer } from "react-test-renderer";
import {
  wrapWithProvidersAndRender,
  wrapWithProvidersAndRenderForTesting,
} from "../../../../../jest/lib/wrapWithProvidersAndRender";
import { initialMockStore } from "__fixtures__/reduxStore";
import { fireEvent, RenderResult, waitFor } from "@testing-library/react";
import API from "utils/API";

jest.mock("next/router", () => require("next-router-mock"));
const logUserMock = jest.fn();

jest.mock("hooks/useLogin", () => {
  return () => ({
    logUser: logUserMock,
    handleError: jest.fn(),
  });
});

describe("CheckCode", () => {
  // Renders the component with the correct title and subtitle
  it("should render the component with the correct title and subtitle", () => {
    act(() => {
      mockRouter.push("/check-code?email=test@example.com");
    });
    let component: ReactTestRenderer;

    act(() => {
      component = wrapWithProvidersAndRender({
        Component: CheckCode,
        reduxState: {
          ...initialMockStore,
        },
        compProps: {
          type: "2fa",
        },
      });

      expect(component.toJSON()).toMatchSnapshot();
    });
  });

  // Does not render the component if the email is not provided
  it("should not render the component if the email is not provided", () => {
    act(() => {
      mockRouter.push("/check-code");
    });
    let component: ReactTestRenderer;

    act(() => {
      component = wrapWithProvidersAndRender({
        Component: CheckCode,
        reduxState: {
          ...initialMockStore,
        },
        compProps: {
          type: "2fa",
        },
      });

      expect(component.toJSON()).toMatchSnapshot();
    });
  });

  it("should display an error message if code is wrong", async () => {
    act(() => {
      mockRouter.push("/check-code?email=test@example.com");
    });

    jest.spyOn(API, "checkCode").mockRejectedValueOnce({ response: { data: { code: "WRONG_CODE" } } });
    let component: RenderResult;

    act(() => {
      component = wrapWithProvidersAndRenderForTesting({
        Component: CheckCode,
        reduxState: {
          ...initialMockStore,
        },
        compProps: {
          type: "2fa",
        },
      });
    });

    act(() => {
      fireEvent.change(component.getByRole("textbox"), { target: { value: "12345" } });
      fireEvent.click(component.getByText("Valider"));
    });

    await waitFor(() => expect(component.getByText("Code incorrect, veuillez réessayer.")).toBeTruthy());
  });

  it("should display an error message if an API error occurs", async () => {
    act(() => {
      mockRouter.push("/check-code?email=test@example.com");
    });

    jest.spyOn(API, "checkCode").mockRejectedValueOnce(new Error());
    let component: RenderResult;

    act(() => {
      component = wrapWithProvidersAndRenderForTesting({
        Component: CheckCode,
        reduxState: {
          ...initialMockStore,
        },
        compProps: {
          type: "2fa",
        },
      });
    });

    act(() => {
      fireEvent.change(component.getByRole("textbox"), { target: { value: "12345" } });
      fireEvent.click(component.getByText("Valider"));
    });

    await waitFor(() =>
      expect(
        component.getByText("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur."),
      ).toBeTruthy(),
    );
  });

  it("should display an error message if no token is returned", async () => {
    act(() => {
      mockRouter.push("/check-code?email=test@example.com");
    });

    //@ts-expect-error
    jest.spyOn(API, "checkCode").mockResolvedValue({});
    let component: RenderResult;

    act(() => {
      component = wrapWithProvidersAndRenderForTesting({
        Component: CheckCode,
        reduxState: {
          ...initialMockStore,
        },
        compProps: {
          type: "2fa",
        },
      });
    });

    act(() => {
      fireEvent.change(component.getByRole("textbox"), { target: { value: "12345" } });
      fireEvent.click(component.getByText("Valider"));
    });

    await waitFor(() =>
      expect(
        component.getByText("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur."),
      ).toBeTruthy(),
    );
  });

  it("should call logUser if all is ok", async () => {
    act(() => {
      mockRouter.push("/check-code?email=test@example.com");
    });

    jest.spyOn(API, "checkCode").mockResolvedValue({ token: "ok" });
    let component: RenderResult;

    act(() => {
      component = wrapWithProvidersAndRenderForTesting({
        Component: CheckCode,
        reduxState: {
          ...initialMockStore,
        },
        compProps: {
          type: "2fa",
        },
      });
    });

    act(() => {
      fireEvent.change(component.getByRole("textbox"), { target: { value: "12345" } });
      fireEvent.click(component.getByText("Valider"));
    });
    await waitFor(() => expect(logUserMock).toHaveBeenCalled());
  });
});
