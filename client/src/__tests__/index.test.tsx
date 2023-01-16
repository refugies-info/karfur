//@ts-nocheck
import { wrapWithProvidersAndRender } from "../../jest/lib/wrapWithProvidersAndRender";
import index from "../pages/index";
import { initialMockStore } from "__fixtures__/reduxStore";
import { lastDemarches, lastDispositifs } from "__fixtures__/getDispositifs";
import { act } from "react-test-renderer";
import "jest-styled-components";
import { setupGoogleMock } from "__mocks__/react-google-autocomplete";
jest.mock("components/Modals/WriteContentModal/WriteContentModal", () => jest.fn().mockReturnValue(<></>));

jest.mock("next/router", () => require("next-router-mock"));

describe("homepage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  it("renders homepage", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: index,
        reduxState: {
          ...initialMockStore
        },
        compProps: {
          contentStatistics: {
            nbMercis: 2344,
            nbVues: 120432,
            nbVuesMobile: 100324,
            nbDispositifs: 500,
            nbDemarches: 80,
            nbUpdatedRecently: 23
          },
          structuresStatistics: {
            nbStructures: 320,
            nbCDA: 24,
            nbStructureAdmins: 300
          },
          translationStatistics: {
            nbTranslators: 12,
            nbWordsTranslated: 156,
            nbActiveTranslators: [
              { languageId: "en", count: 4 },
              { languageId: "ru", count: 2 }
            ]
          },
          demarches: lastDemarches,
          dispositifs: lastDispositifs
        }
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
