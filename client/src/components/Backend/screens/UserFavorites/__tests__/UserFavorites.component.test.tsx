//@ts-nocheck
import mockAxios from "jest-mock-axios";
import routerMock from "next/router";
import {
  fetchUserFavoritesActionCreator,
  updateUserFavoritesActionCreator,
} from "services/UserFavoritesInLocale/UserFavoritesInLocale.actions";
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../../../../../jest/lib/wrapWithProvidersAndRender";
import UserFavorites from "../UserFavorites";

jest.mock("next/router", () => require("next-router-mock"));

import "jest-styled-components";

jest.mock("services/UserFavoritesInLocale/UserFavoritesInLocale.actions", () => {
  const actions = jest.requireActual("services/UserFavoritesInLocale/UserFavoritesInLocale.actions");

  return {
    updateUserFavoritesActionCreator: jest.fn(actions.updateUserFavoritesActionCreator),
    fetchUserFavoritesActionCreator: jest.fn(actions.fetchUserFavoritesActionCreator),
  };
});

describe("UserFavorites", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
  });
  it("should render correctly when loading", () => {
    window.scrollTo = jest.fn();
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: UserFavorites,
      reduxState: {
        ...initialMockStore,
        loadingStatus: { FETCH_USER_FAVORITES: { isLoading: true } },
      },
      compProps: { t: (_: string, element2: string) => element2 },
    });
    expect(fetchUserFavoritesActionCreator).toHaveBeenCalledWith("fr");
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render correctly when 0 favorites", () => {
    window.scrollTo = jest.fn();

    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: UserFavorites,
      compProps: { t: (_: string, element2: string) => element2 },
    });

    expect(fetchUserFavoritesActionCreator).toHaveBeenCalledWith("fr");

    expect(asFragment()).toMatchSnapshot();
  });

  const fav1 = {
    _id: "id1",
    titreInformatif: "tinfo1",
    titreMarque: "titreMarque1",
    abstract: "abstract1",
    typeContenu: "dispositif",
    contenu: [
      {},
      {
        children: [
          {
            title: "Zone d'action",
          },
        ],
      },
    ],
    mainSponsor: {
      picture: { secure_url: "" },
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
      {
        children: [
          {
            title: "Zone d'action",
          },
        ],
      },
    ],
    mainSponsor: {
      picture: { secure_url: "" },
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
      {
        children: [
          {
            title: "Zone d'action",
          },
        ],
      },
    ],
    mainSponsor: {
      picture: { secure_url: "" },
    },
    theme: "6319f6b363ab2bbb162d7df7",
  };
  it("should render correctly when 3 favorites", () => {
    window.scrollTo = jest.fn();
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: UserFavorites,
      compProps: { t: (_: string, element2: string) => element2 },
      reduxState: { ...initialMockStore, userFavorites: { favorites: [fav1, fav2, fav3] } },
    });
    expect(fetchUserFavoritesActionCreator).toHaveBeenCalledWith("fr");
    expect(asFragment()).toMatchSnapshot();
  });

  it("should dispatch updateUserFavoritesActionCreator when click on Tout supprimer", () => {
    window.scrollTo = jest.fn();
    const component = wrapWithProvidersAndRenderForTesting({
      Component: UserFavorites,
      compProps: { t: (_: string, element2: string) => element2 },
      reduxState: { ...initialMockStore, userFavorites: { favorites: [fav1, fav2, fav3] } },
    });
    expect(fetchUserFavoritesActionCreator).toHaveBeenCalledWith("fr");
    component.root.findByProps({ "data-testid": "test-delete-button" }).props.onClick();

    expect(updateUserFavoritesActionCreator).toHaveBeenCalledWith({
      type: "remove-all",
      locale: "fr",
    });
  });

  it("should dispatch updateUserFavoritesActionCreator when click on Tout supprimer and language is en", () => {
    routerMock.locale = "en";
    window.scrollTo = jest.fn();

    const component = wrapWithProvidersAndRenderForTesting({
      Component: UserFavorites,
      compProps: { t: (_: string, element2: string) => element2 },
      reduxState: { ...initialMockStore, userFavorites: { favorites: [fav1, fav2, fav3] } },
    });

    expect(fetchUserFavoritesActionCreator).toHaveBeenCalledWith("en");
    component.root.findByProps({ "data-testid": "test-delete-button" }).props.onClick();

    expect(updateUserFavoritesActionCreator).toHaveBeenCalledWith({
      type: "remove-all",
      locale: "en",
    });
  });
});
