// @ts-nocheck
import { UserContributionsComponent } from "../UserContributions.component";
import { initialMockStore } from "../../../../__fixtures__/reduxStore";
import { wrapWithProvidersAndRender } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import Swal from "sweetalert2";
import { colors } from "../../../../colors";

jest.mock("sweetalert2", () => ({
  __esModule: true, // this property makes it work
  default: { fire: jest.fn().mockResolvedValue("test") },
}));

describe("userContributions", () => {
  it("should render correctly when loading", () => {
    window.scrollTo = jest.fn();

    const component = wrapWithProvidersAndRender({
      Component: UserContributionsComponent,
      reduxState: {
        ...initialMockStore,
        loadingStatus: { FETCH_USER_CONTRIBUTIONS: { isLoading: true } },
      },
    });

    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when 0 contributions", () => {
    window.scrollTo = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: UserContributionsComponent,
    });

    expect(component.toJSON()).toMatchSnapshot();
  });

  const userContributions = [
    {
      _id: "id1",
      titreInformatif: "titre info1",
      titreMarque: "titreMarque1",
      status: "Brouillon",
      typeContenu: "dispositif",
      nbMercis: 0,
    },
    {
      _id: "id2",
      titreInformatif: "titre info2",
      status: "En attente",
      typeContenu: "demarche",
      nbMercis: 0,
    },
    {
      _id: "id3",
      titreInformatif: "titre info3",
      status: "En attente admin",
      typeContenu: "demarche",
      nbMercis: 0,
      mainSponsor: "sponsor",
    },
    {
      _id: "id4",
      titreInformatif: "titre info4",
      status: "Accepté structure",
      typeContenu: "demarche",
      nbMercis: 0,
      mainSponsor: "sponsor",
    },
    {
      _id: "id5",
      titreInformatif: "titre info5",
      status: "Rejeté structure",
      typeContenu: "demarche",
      nbMercis: 0,
      nbVues: 10,
      mainSponsor: "sponsor",
    },
    {
      _id: "id6",
      titreInformatif: "titre info6",
      status: "Actif",
      typeContenu: "demarche",
      nbMercis: 0,
      nbVues: 10,
      mainSponsor: "sponsor",
    },
  ];

  const userStructure = {
    nom: "main",
    dispositifsAssocies: [
      {
        _id: "id7",
        titreInformatif: "titre info7",
        status: "Actif",
        typeContenu: "demarche",
        nbMercis: 0,
        nbVues: 10,
        mainSponsor: "sponsor",
      },
    ],
  };
  it("should render correctly when contributions", () => {
    window.scrollTo = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: UserContributionsComponent,
      reduxState: {
        ...initialMockStore,
        userContributions,
        userStructure,
      },
    });

    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when clicks", () => {
    window.scrollTo = jest.fn();
    const push = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: UserContributionsComponent,
      compProps: { history: { push } },
      reduxState: {
        ...initialMockStore,
        userContributions,
        userStructure,
      },
    });

    component.root.findByProps({ testID: "test_id1" }).props.onClick();
    expect(push).toHaveBeenCalledWith("/dispositif/id1");
    component.root.findByProps({ testID: "test_id2" }).props.onClick();
    expect(push).toHaveBeenCalledWith("/demarche/id2");
  });

  it("should render correctly when click on delete", () => {
    window.scrollTo = jest.fn();
    const push = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: UserContributionsComponent,
      compProps: { history: { push } },
      reduxState: {
        ...initialMockStore,
        userContributions: [userContributions[0]],
      },
    });

    component.root
      .findByProps({ testID: "test_delete_id1" })
      .props.onClick({ stopPropagation: () => {} });
    expect(component.toJSON()).toMatchSnapshot();
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Êtes-vous sûr ?",
      text: "La suppression d'un dispositif est irréversible",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: "Oui, le supprimer",
      cancelButtonText: "Annuler",
    });
  });
});
