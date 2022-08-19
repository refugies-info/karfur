//@ts-nocheck
import UserFavorites from "../UserFavorites";
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRender } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import {
  updateUserFavoritesActionCreator,
  fetchUserFavoritesActionCreator,
} from "services/UserFavoritesInLocale/UserFavoritesInLocale.actions";
import { act } from "react-test-renderer";
import routerMock from "next/router";
jest.mock("next/router", () => require("next-router-mock"));
jest.mock("next/image", () => {
  const Image = () => <></>;
  return Image
});

import "jest-styled-components";

jest.mock(
  "services/UserFavoritesInLocale/UserFavoritesInLocale.actions",
  () => {
    const actions = jest.requireActual(
      "services/UserFavoritesInLocale/UserFavoritesInLocale.actions"
    );

    return {
      updateUserFavoritesActionCreator: jest.fn(
        actions.updateUserFavoritesActionCreator
      ),
      fetchUserFavoritesActionCreator: jest.fn(
        actions.fetchUserFavoritesActionCreator
      ),
    };
  }
);

describe("UserFavorites", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render correctly when loading", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserFavorites,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_FAVORITES: { isLoading: true } },
        },
        compProps: { t: (_: string, element2: string) => element2 },
      });
    });
    expect(fetchUserFavoritesActionCreator).toHaveBeenCalledWith("fr");
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when 0 favorites", () => {
    window.scrollTo = jest.fn();

    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserFavorites,
        compProps: { t: (_: string, element2: string) => element2 },
      });
    });

    expect(fetchUserFavoritesActionCreator).toHaveBeenCalledWith("fr");

    expect(component.toJSON()).toMatchSnapshot();
  });

  const fav1 = {
    _id: "id1",
    titreInformatif: "tinfo1",
    titreMarque: "titreMarque1",
    abstract: "abstract1",
    typeContenu: "dispositif",
    theme: {
      _id: "",
      short: {fr: "Français"},
      name: {fr: "apprendre le français"},
      icon: "elearning",
      colors: {
        color100: "#aaa",
        color80: "#aaa",
        color60: "#aaa",
        color40: "#aaa",
        color30: "#aaa",
      },
      position: 0,
      banner: "",
      appImage: "",
      shareImage: "",
      notificationEmoji: "",
    },
  };

  const fav2 = {
    _id: "id2",
    titreInformatif: "tinfo2",
    titreMarque: "titreMarque2",
    abstract: "abstract2",
    typeContenu: "dispositif",
    theme: {
      _id: "",
      short: {fr: "Administratif"},
      name: {fr: "gérer mes papiers"},
      icon: "office",
      colors: {
        color100: "#aaa",
        color80: "#aaa",
        color60: "#aaa",
        color40: "#aaa",
        color30: "#aaa",
      },
      position: 0,
      banner: "",
      appImage: "",
      shareImage: "",
      notificationEmoji: "",
    },
  };

  const fav3 = {
    _id: "id3",
    titreInformatif: "tinfo3",
    titreMarque: "titreMarque3",
    abstract: "abstract3",
    typeContenu: "demarche",
    theme: {
      _id: "",
      short: {fr: "Logement"},
      name: {fr: "me loger"},
      icon: "house",
      colors: {
        color100: "#aaa",
        color80: "#aaa",
        color60: "#aaa",
        color40: "#aaa",
        color30: "#aaa",
      },
      position: 0,
      banner: "",
      appImage: "",
      shareImage: "",
      notificationEmoji: "",
    },
  };
  it("should render correctly when 3 favorites", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserFavorites,
        compProps: { t: (_: string, element2: string) => element2 },
        reduxState: { ...initialMockStore, userFavorites: [fav1, fav2, fav3] },
      });
    });
    expect(fetchUserFavoritesActionCreator).toHaveBeenCalledWith("fr");
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should dispatch updateUserFavoritesActionCreator when click on Tout supprimer", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserFavorites,
        compProps: { t: (_: string, element2: string) => element2 },
        reduxState: { ...initialMockStore, userFavorites: [fav1, fav2, fav3] },
      });
    });
    expect(fetchUserFavoritesActionCreator).toHaveBeenCalledWith("fr");
    component.root
      .findByProps({ "data-test-id": "test-delete-button" })
      .props.onClick();

    expect(updateUserFavoritesActionCreator).toHaveBeenCalledWith({
      type: "remove-all",
      locale: "fr",
    });
  });

  it("should dispatch updateUserFavoritesActionCreator when click on Tout supprimer and language is en", () => {
    routerMock.locale = "en";
    window.scrollTo = jest.fn();

    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserFavorites,
        compProps: { t: (_: string, element2: string) => element2 },
        reduxState: { ...initialMockStore, userFavorites: [fav1, fav2, fav3] },
      });
    });

    expect(fetchUserFavoritesActionCreator).toHaveBeenCalledWith("en");
    component.root
      .findByProps({ "data-test-id": "test-delete-button" })
      .props.onClick();

    expect(updateUserFavoritesActionCreator).toHaveBeenCalledWith({
      type: "remove-all",
      locale: "en",
    });
  });

  it("should dispatch updateUserFavoritesActionCreator when click on one dispositif and language is ps", () => {
    routerMock.locale = "ps";
    window.scrollTo = jest.fn();

    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserFavorites,
        compProps: { t: (_: string, element2: string) => element2 },
        reduxState: { ...initialMockStore, userFavorites: [fav1, fav2, fav3] },
      });
    });
    expect(fetchUserFavoritesActionCreator).toHaveBeenCalledWith("ps");

    component.root
      .findByProps({ "data-test-id": "test-toggle-pin-id1" })
      .props.onClick({ preventDefault: jest.fn(), stopPropagation: jest.fn() });
    expect(updateUserFavoritesActionCreator).toHaveBeenCalledWith({
      dispositifId: "id1",
      type: "remove",
      locale: "ps",
    });
  });
});
