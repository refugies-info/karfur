import { screen } from "@testing-library/react";
import "jest-styled-components";
import mockRouter from "next-router-mock";
import { initialMockStore } from "~/__fixtures__/reduxStore";
import { setupGoogleMock } from "~/__mocks__/react-google-autocomplete";
import pageComponent from "~/pages/auth/reinitialiser-mot-de-passe";
import { wrapWithProvidersAndRenderForTesting } from "../../../../jest/lib/wrapWithProvidersAndRender";

jest.mock("next/router", () => require("next-router-mock"));

describe("auth/reinitialiser-mot-de-passe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  it("renders page if no email", () => {
    wrapWithProvidersAndRenderForTesting({
      Component: pageComponent,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(screen.getByRole("heading", { name: /mot de passe oublié/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/adresse mail/i)).toHaveValue("");
  });

  it("renders page if email", async () => {
    await mockRouter.push("/auth/reinitialiser-mot-de-passe?email=test@example.com");
    wrapWithProvidersAndRenderForTesting({
      Component: pageComponent,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(screen.getByRole("heading", { name: /mot de passe oublié/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/adresse mail/i)).toHaveValue("test@example.com");
  });
});
