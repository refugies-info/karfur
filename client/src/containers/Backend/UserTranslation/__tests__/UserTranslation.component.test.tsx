//@ts-nocheck
import { wrapWithProvidersAndRender } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import { UserTranslationComponent } from "../UserTranslation.component";
import { initialMockStore } from "../../../../__fixtures__/reduxStore";
import { fetchDispositifsWithTranslationsStatusActionCreator } from "../../../../services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions";
import { act } from "react-test-renderer";
import { dispositifsWithTranslations } from "../../../../__fixtures__/dispositifsWithTrad";
import API from "../../../../utils/API";
import "jest-styled-components";

jest.mock(
  "../../../../services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions",
  () => {
    const actions = jest.requireActual(
      "../../../../services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions"
    );
    return {
      fetchDispositifsWithTranslationsStatusActionCreator: jest.fn(
        actions.fetchDispositifsWithTranslationsStatusActionCreator
      ),
    };
  }
);
jest.mock("../../../../utils/API");

describe("user translation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return loader langue in url = first selected langue", () => {
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
        compProps: { match: { params: { id: "en" } } },
      });
    });
    expect(
      fetchDispositifsWithTranslationsStatusActionCreator
    ).toHaveBeenCalledWith("en");
    expect(API.get_progression).toHaveBeenCalledWith({ userId: "userId" });
    expect(component.toJSON()).toMatchSnapshot();
  });
  const push = jest.fn();

  it("should redirect if user has language but not langue in url + snap view without content", () => {
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
        compProps: { match: { params: { id: undefined } }, history: { push } },
      });
    });
    expect(
      fetchDispositifsWithTranslationsStatusActionCreator
    ).not.toHaveBeenCalled();
    expect(API.get_progression).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/backend/user-translation/en");
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should redirect if user has no language but langue in url", () => {
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
        compProps: { match: { params: { id: "en" } }, history: { push } },
      });
    });
    expect(
      fetchDispositifsWithTranslationsStatusActionCreator
    ).not.toHaveBeenCalled();
    expect(API.get_progression).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/backend/user-translation");
  });

  it("should redirect if user has no language but langue in url + snap no langue", () => {
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
        compProps: { match: { params: { id: "test" } }, history: { push } },
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
        compProps: { match: { params: { id: "en" } }, history: { push } },
      });
    });

    expect(component.toJSON()).toMatchSnapshot();
    act(() => {
      component.root.findByProps({ testID: "test-line-id3" }).props.onClick();
    });
    expect(push).toHaveBeenCalledWith({
      pathname: "/traduction/dispositif/id3",
      search: "?id=idEn",
    });
  });

  it("should render correctly with expert, non admin", () => {
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
        compProps: { match: { params: { id: "en" } }, history: { push } },
      });
    });
    act(() => {
      component.root.findByProps({ testID: "test-line-id6" }).props.onClick();
    });
    expect(push).toHaveBeenCalledWith({
      pathname: "/validation/dispositif/id6",
      search: "?id=idEn",
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly with expert, admin", () => {
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
        compProps: { match: { params: { id: "en" } } },
      });
    });

    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should change language", () => {
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
        compProps: { match: { params: { id: "en" } }, history: { push } },
      });
    });
    component.root.findByProps({ testID: "test-langue-idPs" }).props.onClick();
    expect(push).toHaveBeenCalledWith("/backend/user-translation/ps");
  });
});
