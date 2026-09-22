import { DispositifOrigin } from "@refugies-info/api-types";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { initialMockStore } from "~/__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../../../../../jest/lib/wrapWithProvidersAndRender";
import Contributors from "../Contributors";

jest.mock("next/router", () => require("next-router-mock"));

const dispositif = (origin: DispositifOrigin, location?: string[], originId?: string) => ({
  _id: "dispositif-id",
  origin,
  originId,
  theme: "themeId",
  secondaryThemes: [],
  needs: [],
  metadatas: { location },
  participants: [{ _id: "user-1", username: "Alice", roles: [] }],
});

const renderWithOrigin = (origin: DispositifOrigin, location?: string[], originId?: string) =>
  wrapWithProvidersAndRenderForTesting({
    Component: Contributors,
    reduxState: {
      ...initialMockStore,
      selectedDispositif: dispositif(origin, location, originId) as any,
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

  it("shows the logo of the regional Carif-Oref covering the dispositif", () => {
    renderWithOrigin(DispositifOrigin.RCO, ["75 - Paris", "93 - Seine-Saint-Denis"]);

    const logo = screen.getByAltText("Logo Région Île-de-France");
    expect(decodeURIComponent(logo.getAttribute("src") || "")).toContain(
      "/images/sources/carif-oref-ile-de-france.webp",
    );
    // The i18n mock returns keys, so we check the region-aware sentence is the one picked
    expect(screen.getByText("ContentSources.RCO.descriptionWithRegion")).toBeInTheDocument();
  });

  it("falls back to the generic Carif-Oref logo when no region can be identified", () => {
    renderWithOrigin(DispositifOrigin.RCO);

    const logo = screen.getByAltText("Logo RCO");
    expect(decodeURIComponent(logo.getAttribute("src") || "")).toContain(
      "/images/sources/carif-oref-logo.png",
    );
    expect(screen.getByText("ContentSources.RCO.description")).toBeInTheDocument();
  });

  it("names the Carif-Oref from the number carried by the RCO id", () => {
    renderWithOrigin(DispositifOrigin.RCO, undefined, "carif-oref--14_SE_0001847289");

    const logo = screen.getByAltText("Logo Région Île-de-France");
    expect(decodeURIComponent(logo.getAttribute("src") || "")).toContain(
      "/images/sources/carif-oref-ile-de-france.webp",
    );
  });

  it("prefers the RCO id over the departments when both are available", () => {
    // Departments point to Île-de-France, the id to Bretagne: the id is the source of truth
    renderWithOrigin(DispositifOrigin.RCO, ["75 - Paris"], "carif-oref--06_2353075S");

    expect(screen.getByAltText("Logo GREF Bretagne")).toBeInTheDocument();
  });

  it("does not show a source card for content authored on Réfugiés.info", () => {
    renderWithOrigin(DispositifOrigin.RI);

    expect(screen.queryByRole("heading", { name: "Source" })).not.toBeInTheDocument();
  });
});
