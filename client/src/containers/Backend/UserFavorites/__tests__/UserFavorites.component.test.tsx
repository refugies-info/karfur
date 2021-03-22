// @ts-nocheck
import { UserFavoritesComponent } from "../UserFavorites.component";
import { initialMockStore } from "../../../../__fixtures__/reduxStore";
import { wrapWithProvidersAndRender } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import Swal from "sweetalert2";
import { colors } from "../../../../colors";

jest.mock("sweetalert2", () => ({
  __esModule: true, // this property makes it work
  default: { fire: jest.fn().mockResolvedValue("test") },
}));

describe("UserFavorites", () => {
  it("should render correctly when loading", () => {
    window.scrollTo = jest.fn();

    const component = wrapWithProvidersAndRender({
      Component: UserFavoritesComponent,
      reduxState: {
        ...initialMockStore,
        loadingStatus: { FETCH_USER_FAVORITES: { isLoading: true } },
      },
      compProps: { t: (element: string, element2: string) => element2 },
    });

    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when 0 favorites", () => {
    window.scrollTo = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: UserFavoritesComponent,
      compProps: { t: (element: string, element2: string) => element2 },
    });

    expect(component.toJSON()).toMatchSnapshot();
  });

  const fav1 = {
    _id: "id1",
    titreInformatif: "tinfo1",
    titreMarque: "titreMarque1",
    abstract: "abstract1",
    typeContenu: "dispositif",
    tags: [
      {
        short: "Français",
        icon: "elearning",
        name: "apprendre le français",
        darkColor: "#3E2884",
        lightColor: "#F0E8F5",
        hoverColor: "#3E2884",
        illustrationColor: "#F9AA38",
      },
    ],
  };

  const fav2 = {
    _id: "id2",
    titreInformatif: "tinfo2",
    titreMarque: "titreMarque2",
    abstract: "abstract2",
    typeContenu: "dispositif",
    tags: [
      {
        short: "Administratif",
        icon: "office",
        name: "gérer mes papiers",
        darkColor: "#443023",
        lightColor: "#EAE2E1",
        hoverColor: "#fcb21c",
        illustrationColor: "#1FC2C1",
      },
    ],
  };

  const fav3 = {
    _id: "id3",
    titreInformatif: "tinfo3",
    titreMarque: "titreMarque3",
    abstract: "abstract3",
    typeContenu: "demarche",
    tags: [
      {
        short: "Logement",
        icon: "house",
        name: "me loger",
        darkColor: "#188CC6",
        lightColor: "#DDF3FA",
        hoverColor: "#188CC6",
        illustrationColor: "#F77B0B",
      },
    ],
  };
  it("should render correctly when 3 favorites", () => {
    window.scrollTo = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: UserFavoritesComponent,
      compProps: { t: (element: string, element2: string) => element2 },
      reduxState: { ...initialMockStore, userFavorites: [fav1, fav2, fav3] },
    });

    expect(component.toJSON()).toMatchSnapshot();
  });
});
