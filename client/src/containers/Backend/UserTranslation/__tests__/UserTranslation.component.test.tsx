//@ts-nocheck
import { wrapWithProvidersAndRender } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import { UserTranslationComponent } from "../UserTranslation.component";
import { initialMockStore } from "__fixtures__/reduxStore";
import { fetchDispositifsWithTranslationsStatusActionCreator } from "services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions";
import { act } from "react-test-renderer";
import { dispositifsWithTranslations } from "__fixtures__/dispositifsWithTrad";
import API from "utils/API";
import { useParams } from "react-router-dom";
import "jest-styled-components";
jest.mock("next/router", () => require("next-router-mock"));
jest.mock("next/image", () => {
  const Image = () => <></>;
  return Image
});

// Mock history
const push = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useHistory: () => ({ push }),
}));

jest.mock(
  "services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions",
  () => {
    const actions = jest.requireActual(
      "services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions"
    );
    return {
      fetchDispositifsWithTranslationsStatusActionCreator: jest.fn(
        actions.fetchDispositifsWithTranslationsStatusActionCreator
      ),
    };
  }
);
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
        Component: UserTranslationComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: {
            FETCH_DISPOSITIFS_TRANSLATIONS_STATUS: { isLoading: true },
          },
          user: {
            user: { selectedLanguages: [{ i18nCode: "en" }], _id: "userId" },
          },
        },
      });
    });
    expect(
      fetchDispositifsWithTranslationsStatusActionCreator
    ).toHaveBeenCalledWith("en");
    expect(API.get_progression).toHaveBeenCalledWith({ userId: "userId" });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should redirect if user has language but not langue in url + snap view without content", () => {
    useParams.mockReturnValueOnce({});
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserTranslationComponent,
        reduxState: {
          ...initialMockStore,
          user: { user: { selectedLanguages: [{ i18nCode: "en" }] } },
          dispositifsWithTranslations: [],
        },
      });
    });
    expect(push).toHaveBeenCalledWith("/backend/user-translation/en");
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should redirect if user has no language but langue in url", () => {
    useParams.mockReturnValueOnce({ id: "en" });
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserTranslationComponent,
        reduxState: {
          ...initialMockStore,
          user: { user: { selectedLanguages: [] } },
          dispositifsWithTranslations: [],
        },
      });
    });
    expect(
      fetchDispositifsWithTranslationsStatusActionCreator
    ).not.toHaveBeenCalled();
    expect(API.get_progression).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/backend/user-translation");
  });

  it("should redirect if user has no language but langue in url + snap no langue", () => {
    useParams.mockReturnValueOnce({ id: "test" });
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserTranslationComponent,
        reduxState: {
          ...initialMockStore,
          user: { user: { selectedLanguages: [] } },
          dispositifsWithTranslations: [{ _id: "id" }],
        },
      });
    });
    expect(
      fetchDispositifsWithTranslationsStatusActionCreator
    ).not.toHaveBeenCalled();
    expect(API.get_progression).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/backend/user-translation");
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly with non expert, non admin", () => {
    useParams.mockReturnValueOnce({ id: "en" });
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserTranslationComponent,
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
    act(() => {
      component.root.findByProps({ testID: "test-line-id3" }).props.onClick();
    });
    expect(push).toHaveBeenCalledWith({
      pathname: "/backend/traduction/dispositif",
      search: "?language=idEn&dispositif=id3",
    });
  });

  it("should render correctly with expert, non admin", () => {
    useParams.mockReturnValueOnce({ id: "en" });
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserTranslationComponent,
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
    act(() => {
      component.root.findByProps({ testID: "test-line-id6" }).props.onClick();
    });
    expect(push).toHaveBeenCalledWith({
      pathname: "/backend/validation/dispositif",
      search: "?language=idEn&dispositif=id6",
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly with expert, admin", () => {
    useParams.mockReturnValueOnce({ id: "en" });
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserTranslationComponent,
        reduxState: {
          ...initialMockStore,
          user: {
            user: { selectedLanguages: [{ i18nCode: "en" }] },
            expertTrad: true,
            admin: true,
          },
          dispositifsWithTranslations,
        },
        compProps: { },
      });
    });

    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should change language", () => {
    useParams.mockReturnValueOnce({ id: "en" });
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserTranslationComponent,
        reduxState: {
          ...initialMockStore,
          user: {
            user: {
              selectedLanguages: [
                { i18nCode: "en", _id: "idEn" },
                { i18nCode: "ps", _id: "idPs" },
              ],
            },
          },
          dispositifsWithTranslations,
        },
      });
    });
    component.root.findByProps({ testID: "test-langue-idPs" }).props.onClick();
    expect(push).toHaveBeenCalledWith("/backend/user-translation/ps");
  });
});
