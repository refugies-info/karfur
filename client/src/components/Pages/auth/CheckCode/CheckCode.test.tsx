import { fireEvent, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";
import API from "utils/API";
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import CheckCode from "./CheckCode";

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
  it("should render the component with the correct title and subtitle", async () => {
    await mockRouter.push("/check-code?email=test@example.com");

    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: CheckCode,
      reduxState: {
        ...initialMockStore,
      },
      compProps: {
        type: "2fa",
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  // Does not render the component if the email is not provided
  it("should not render the component if the email is not provided", async () => {
    await mockRouter.push("/check-code");
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: CheckCode,
      reduxState: {
        ...initialMockStore,
      },
      compProps: {
        type: "2fa",
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display an error message if code is wrong", async () => {
    await mockRouter.push("/check-code?email=test@example.com");

    jest.spyOn(API, "checkCode").mockRejectedValueOnce({ response: { data: { code: "WRONG_CODE" } } });

    const component = wrapWithProvidersAndRenderForTesting({
      Component: CheckCode,
      reduxState: {
        ...initialMockStore,
      },
      compProps: {
        type: "2fa",
      },
    });

    fireEvent.change(component.getByRole("textbox"), { target: { value: "12345" } });
    fireEvent.click(component.getByText("Valider"));

    await waitFor(() => expect(component.getByText("Code incorrect, veuillez réessayer.")).toBeTruthy());
  });

  it("should display an error message if an API error occurs", async () => {
    mockRouter.push("/check-code?email=test@example.com");

    jest.spyOn(API, "checkCode").mockRejectedValueOnce(new Error());
    const component = wrapWithProvidersAndRenderForTesting({
      Component: CheckCode,
      reduxState: {
        ...initialMockStore,
      },
      compProps: {
        type: "2fa",
      },
    });

    fireEvent.change(component.getByRole("textbox"), { target: { value: "12345" } });
    fireEvent.click(component.getByText("Valider"));

    await waitFor(() =>
      expect(
        component.getByText("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur."),
      ).toBeTruthy(),
    );
  });

  it("should display an error message if no token is returned", async () => {
    await mockRouter.push("/check-code?email=test@example.com");

    //@ts-expect-error
    jest.spyOn(API, "checkCode").mockResolvedValue({});
    const component = wrapWithProvidersAndRenderForTesting({
      Component: CheckCode,
      reduxState: {
        ...initialMockStore,
      },
      compProps: {
        type: "2fa",
      },
    });

    fireEvent.change(component.getByRole("textbox"), { target: { value: "12345" } });
    fireEvent.click(component.getByText("Valider"));

    await waitFor(() =>
      expect(
        component.getByText("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur."),
      ).toBeTruthy(),
    );
  });

  it("should call logUser if all is ok", async () => {
    await mockRouter.push("/check-code?email=test@example.com");

    jest.spyOn(API, "checkCode").mockResolvedValue({ token: "ok" });
    const component = wrapWithProvidersAndRenderForTesting({
      Component: CheckCode,
      reduxState: {
        ...initialMockStore,
      },
      compProps: {
        type: "2fa",
      },
    });

    fireEvent.change(component.getByRole("textbox"), { target: { value: "12345" } });
    fireEvent.click(component.getByText("Valider"));
    await waitFor(() => expect(logUserMock).toHaveBeenCalled());
  });
});
