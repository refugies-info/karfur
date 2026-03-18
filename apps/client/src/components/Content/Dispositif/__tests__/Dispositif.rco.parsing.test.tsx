import { ContentType, DispositifOrigin, DispositifStatus } from "@refugies-info/api-types";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-styled-components";
import { initialMockStore } from "~/__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import Dispositif from "../Dispositif";

jest.mock("next/router", () => require("next-router-mock"));

// Mock react-markdown to avoid ESM issues, but test the parsing logic separately
jest.mock("react-markdown", () => (props: any) => {
  return <div data-testid="react-markdown">{props.children}</div>;
});
jest.mock("remark-gfm", () => () => {});

/**
 * Integration tests for RCO dispositif rendering.
 *
 * NOTE: For full markdown parsing tests (including time notations like "9:00"),
 * see the unit tests for remark plugins in:
 * - packages/markdown-utils/src/__tests__/ (constants, helpers, remarkRestoreHierarchy)
 * - src/lib/markdown/__tests__/markdown-plugins.test.ts (directive-to-component smoke tests)
 *
 * The parsing logic is tested at the plugin level to avoid ESM issues with
 * react-markdown in Jest.
 */
describe("RCO Dispositif Rendering", () => {
  const createRCODispositif = (markdown: string) => ({
    _id: "dispositif-rco-test",
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
          titreInformatif: "Test RCO",
          titreMarque: "Test",
          abstract: "",
          markdown,
        },
      },
    },
    titreInformatif: "Test RCO",
    titreMarque: "Test",
    abstract: "",
    markdown,
    theme: "themeId",
    needs: [],
    secondaryThemes: [],
    metadatas: { location: ["France"] },
    avis: [],
    creatorId: { _id: "creatorId" },
    map: [],
    date: new Date(),
    administration: {},
  });

  it("should render markdown content when origin is RCO and markdown field is present", () => {
    const markdown = `# Test Markdown

Some content here.`;

    const dispositif = createRCODispositif(markdown);

    wrapWithProvidersAndRenderForTesting({
      Component: Dispositif,
      reduxState: { ...initialMockStore, selectedDispositif: dispositif },
    });

    expect(screen.getByTestId("react-markdown")).toBeInTheDocument();
  });

  it("should handle markdown with time notations (9:00) without crashing", () => {
    // This test verifies that the component renders without crashing
    // The actual parsing of time notations is tested in the remark plugin tests
    const markdown = `## Horaires

Meeting from 9:00 to 12:00.`;

    const dispositif = createRCODispositif(markdown);

    expect(() => {
      wrapWithProvidersAndRenderForTesting({
        Component: Dispositif,
        reduxState: { ...initialMockStore, selectedDispositif: dispositif },
      });
    }).not.toThrow();
  });

  it("should handle markdown with directives without crashing", () => {
    const markdown = `:::toggle{title="Test"}
- Item 1
:::

:::important
Important content
:::`;

    const dispositif = createRCODispositif(markdown);

    expect(() => {
      wrapWithProvidersAndRenderForTesting({
        Component: Dispositif,
        reduxState: { ...initialMockStore, selectedDispositif: dispositif },
      });
    }).not.toThrow();
  });
});
