//@ts-nocheck
import { wrapWithProvidersAndRender } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import UserTranslation from "../UserTranslation";
import { initialMockStore } from "__fixtures__/reduxStore";
import { fetchDispositifsWithTranslationsStatusActionCreator } from "services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions";
import { act } from "react-test-renderer";
import { dispositifsWithTranslations } from "__fixtures__/dispositifsWithTrad";
import API from "utils/API";
import { useParams } from "react-router-dom";
import "jest-styled-components";
jest.mock("next/router", () => require("next-router-mock"));

// Mock history
const replace = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useHistory: () => ({ replace }),
}));

jest.mock("services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions", () => {
  const actions = jest.requireActual(
    "services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions",
  );
  return {
    fetchDispositifsWithTranslationsStatusActionCreator: jest.fn(
      actions.fetchDispositifsWithTranslationsStatusActionCreator,
    ),
  };
});
jest.mock("utils/API");

describe("user translation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return loader langue in url = first selected langue", () => {
    useParams.mockReturnValueOnce({ id: "en" });
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserTranslation,
        reduxState: {
          ...initialMockStore,
          loadingStatus: {
            FETCH_DISPOSITIFS_TRANSLATIONS_STATUS: { isLoading: false },
          },
          user: {
            user: { selectedLanguages: ["en"], _id: "userId" },
          },
        },
      });
    });
    expect(fetchDispositifsWithTranslationsStatusActionCreator).toHaveBeenCalledWith("en");
    expect(API.get_progression).toHaveBeenCalledWith({});
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should redirect if user has language but not langue in url + snap view without content", () => {
    useParams.mockReturnValueOnce({});
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserTranslation,
        reduxState: {
          ...initialMockStore,
          user: { user: { selectedLanguages: [{ i18nCode: "en" }] } },
          dispositifsWithTranslations: [],
        },
      });
    });
    expect(replace).toHaveBeenCalledWith("/fr/backend/user-translation/en");
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should redirect if user has no language but langue in url", () => {
    useParams.mockReturnValueOnce({ id: "en" });
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserTranslation,
        reduxState: {
          ...initialMockStore,
          user: { user: { selectedLanguages: [] } },
          dispositifsWithTranslations: [],
        },
      });
    });
    expect(fetchDispositifsWithTranslationsStatusActionCreator).not.toHaveBeenCalled();
    expect(API.get_progression).not.toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("/fr/backend/user-translation");
  });

  it("should redirect if user has no language but langue in url + snap no langue", () => {
    useParams.mockReturnValueOnce({ id: "test" });
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserTranslation,
        reduxState: {
          ...initialMockStore,
          user: { user: { selectedLanguages: [] } },
          dispositifsWithTranslations: [{ _id: "id" }],
        },
      });
    });
    expect(fetchDispositifsWithTranslationsStatusActionCreator).not.toHaveBeenCalled();
    expect(API.get_progression).not.toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("/fr/backend/user-translation");
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly with non expert, non admin", () => {
    useParams.mockReturnValueOnce({ id: "en" });
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserTranslation,
        reduxState: {
          ...initialMockStore,
          user: {
            user: { selectedLanguages: [{ i18nCode: "en", _id: "idEn" }] },
            expertTrad: false,
          },
          dispositifsWithTranslations,
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly with expert, non admin", () => {
    useParams.mockReturnValueOnce({ id: "en" });
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserTranslation,
        reduxState: {
          ...initialMockStore,
          user: {
            user: { selectedLanguages: [{ i18nCode: "en", _id: "idEn" }] },
            expertTrad: true,
          },
          dispositifsWithTranslations,
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly with expert, admin", () => {
    useParams.mockReturnValueOnce({ id: "en" });
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserTranslation,
        reduxState: {
          ...initialMockStore,
          user: {
            user: { selectedLanguages: [{ i18nCode: "en" }] },
            expertTrad: true,
            admin: true,
          },
          dispositifsWithTranslations,
        },
        compProps: {},
      });
    });

    expect(component.toJSON()).toMatchSnapshot();
  });
});
