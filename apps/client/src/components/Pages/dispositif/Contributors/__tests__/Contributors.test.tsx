import { DispositifOrigin } from "@refugies-info/api-types";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { initialMockStore } from "~/__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../../../../../jest/lib/wrapWithProvidersAndRender";
import Contributors from "../Contributors";

jest.mock("next/router", () => require("next-router-mock"));

const dispositif = (origin: DispositifOrigin) => ({
  _id: "dispositif-id",
  origin,
  theme: "themeId",
  secondaryThemes: [],
  needs: [],
  participants: [{ _id: "user-1", username: "Alice", roles: [] }],
});

const renderWithOrigin = (origin: DispositifOrigin) =>
  wrapWithProvidersAndRenderForTesting({
    Component: Contributors,
    reduxState: {
      ...initialMockStore,
      selectedDispositif: dispositif(origin) as any,
    },
  });

describe("Contributors", () => {
  it("lists contributors for content authored on Réfugiés.info", () => {
    const { container } = renderWithOrigin(DispositifOrigin.RI);

    expect(container.querySelector("#contributors")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("hides the contributors section for imported content", () => {
    const { container } = renderWithOrigin(DispositifOrigin.RCO);

    expect(container.querySelector("#contributors")).not.toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("still shows the source card for imported content", () => {
    // The source card lives in the same component: hiding the whole block would remove the
    // attribution that imported content precisely needs.
    renderWithOrigin(DispositifOrigin.RCO);

    expect(screen.getByRole("heading", { name: "Source" })).toBeInTheDocument();
  });

  it("does not show a source card for content authored on Réfugiés.info", () => {
    renderWithOrigin(DispositifOrigin.RI);

    expect(screen.queryByRole("heading", { name: "Source" })).not.toBeInTheDocument();
  });
});
