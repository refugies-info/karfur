import { ContentType, DispositifOrigin, DispositifStatus } from "@refugies-info/api-types";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";
import { initialMockStore } from "~/__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import Dispositif from "../Dispositif";

jest.mock("next/router", () => require("next-router-mock"));

// Mock react-markdown to avoid complex rendering in tests and just check if it's called
jest.mock("react-markdown", () => (props: any) => {
  return <div data-testid="react-markdown">{props.children}</div>;
});
jest.mock("remark-gfm", () => () => {});

describe("Dispositif RCO", () => {
  it("should render markdown content when origin is RCO and markdown field is present", () => {
    const dispositifRCO = {
      _id: "dispositif-rco",
      typeContenu: ContentType.DISPOSITIF,
      status: DispositifStatus.ACTIVE,
      origin: DispositifOrigin.RCO,
      publishedAt: new Date(),
      created_at: new Date(),
      lastModificationDate: new Date(),
      nbMots: 100,
      nbVues: 0,
      nbVuesMobile: 0,
      availableLanguages: ["fr"],
      hasDraftVersion: false,
      themeSortIndex: 0,
      translations: {
        fr: {
          content: {
            titreInformatif: "Titre RCO",
            titreMarque: "Titre Marque",
            abstract: "Abstract",
            what: "What content",
            markdown: "# Markdown Content",
          },
        },
      },
      titreInformatif: "Titre RCO",
      titreMarque: "Titre Marque",
      abstract: "Abstract",
      markdown: "# Markdown Content", // Flattened field
      theme: "themeId",
      needs: [],
      secondaryThemes: [],
      metadatas: {
        location: ["France"],
      },
      avis: [],
      creatorId: { _id: "creatorId" },
      map: [],
      date: new Date(),
      administration: {},
    };

    wrapWithProvidersAndRenderForTesting({
      Component: Dispositif,
      reduxState: {
        ...initialMockStore,
        selectedDispositif: dispositifRCO,
      },
    });

    expect(screen.getByTestId("react-markdown")).toBeInTheDocument();
    expect(screen.getByText("# Markdown Content")).toBeInTheDocument();
  });

  it("should render placeholder when origin is RCO but no markdown field", () => {
    const dispositifRCO = {
      _id: "dispositif-rco-no-markdown",
      typeContenu: ContentType.DISPOSITIF,
      status: DispositifStatus.ACTIVE,
      origin: DispositifOrigin.RCO,
      publishedAt: new Date(),
      created_at: new Date(),
      lastModificationDate: new Date(),
      nbMots: 100,
      nbVues: 0,
      nbVuesMobile: 0,
      availableLanguages: ["fr"],
      hasDraftVersion: false,
      themeSortIndex: 0,
      titreInformatif: "Titre RCO",
      titreMarque: "Titre Marque",
      abstract: "Abstract",
      theme: "themeId",
      needs: [],
      secondaryThemes: [],
      metadatas: {
        location: ["France"],
      },
      what: "what",
      how: {},
      participants: [],
      merci: [],
      avis: [],
      sponsors: [],
      creatorId: { _id: "creatorId" },
      map: [],
      date: new Date(),
      administration: {},
    };

    wrapWithProvidersAndRenderForTesting({
      Component: Dispositif,
      reduxState: {
        ...initialMockStore,
        selectedDispositif: dispositifRCO,
      },
    });

    expect(screen.queryByTestId("react-markdown")).not.toBeInTheDocument();
    expect(
      screen.getByText(/Ce contenu est généré par intelligence artificielle/i),
    ).toBeInTheDocument();
  });
});
