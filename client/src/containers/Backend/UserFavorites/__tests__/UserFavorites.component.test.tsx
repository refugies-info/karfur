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
jest.mock("axios", () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() }
      }
    }))
  }
})

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
    contenu: [
      {},
      {children: [{
        title: "Zone d'action",
      }]}
    ],
    mainSponsor: {
      picture: {secure_url: ""}
    },
    theme: "6319f6b363ab2bbb162d7df5",
  };

  const fav2 = {
    _id: "id2",
    titreInformatif: "tinfo2",
    titreMarque: "titreMarque2",
    abstract: "abstract2",
    typeContenu: "dispositif",
    contenu: [
      {},
      {children: [{
        title: "Zone d'action",
      }]}
    ],
    mainSponsor: {
      picture: {secure_url: ""}
    },
    theme: "6319f6b363ab2bbb162d7df6",
  };

  const fav3 = {
    _id: "id3",
    titreInformatif: "tinfo3",
    titreMarque: "titreMarque3",
    abstract: "abstract3",
    typeContenu: "demarche",
    contenu: [
      {},
      {children: [{
        title: "Zone d'action",
      }]}
    ],
    mainSponsor: {
      picture: {secure_url: ""}
    },
    theme: "6319f6b363ab2bbb162d7df7",
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
});
