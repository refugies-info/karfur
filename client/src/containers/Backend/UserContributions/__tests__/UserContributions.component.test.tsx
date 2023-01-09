// @ts-nocheck
import UserContributions from "../UserContributions";
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRender } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import Swal from "sweetalert2";
import { colors } from "colors";
import { act } from "react-test-renderer";
import { fetchUserContributionsActionCreator } from "services/UserContributions/userContributions.actions";
import { fetchUserStructureActionCreator } from "services/UserStructure/userStructure.actions";
import "jest-styled-components";
import Router from "next/router";
jest.mock("components/Modals/WriteContentModal/WriteContentModal", () => jest.fn().mockReturnValue(<></>));

jest.mock("next/router", () => require("next-router-mock"));
jest.mock("next/image", () => {
  const Image = () => <></>;
  return Image;
});

jest.mock("services/UserContributions/userContributions.actions", () => {
  const actions = jest.requireActual("services/UserContributions/userContributions.actions");

  return {
    fetchUserContributionsActionCreator: jest.fn(actions.fetchUserContributionsActionCreator)
  };
});

jest.mock("services/UserStructure/userStructure.actions", () => {
  const actions = jest.requireActual("services/UserStructure/userStructure.actions");
  return {
    fetchUserStructureActionCreator: jest.fn(actions.fetchUserStructureActionCreator)
  };
});

describe("userContributions", () => {
  it("should render correctly when loading", () => {
    window.scrollTo = jest.fn();

    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserContributions,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_CONTRIBUTIONS: { isLoading: true } }
        }
      });
    });

    expect(fetchUserContributionsActionCreator).toHaveBeenCalledWith();
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when 0 contributions", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserContributions
      });
    });
    expect(fetchUserContributionsActionCreator).toHaveBeenCalledWith();
    expect(component.toJSON()).toMatchSnapshot();
  });

  const userContributions = [
    {
      _id: "id1",
      titreInformatif: "titre info1",
      titreMarque: "titreMarque1",
      status: "Brouillon",
      typeContenu: "dispositif",
      nbMercis: 0
    },
    {
      _id: "id2",
      titreInformatif: "titre info2",
      status: "En attente",
      typeContenu: "demarche",
      nbMercis: 0
    },
    {
      _id: "id3",
      titreInformatif: "titre info3",
      status: "En attente admin",
      typeContenu: "demarche",
      nbMercis: 0,
      mainSponsor: "sponsor"
    },
    {
      _id: "id4",
      titreInformatif: "titre info4",
      status: "Accepté structure",
      typeContenu: "demarche",
      nbMercis: 0,
      mainSponsor: "sponsor"
    },
    {
      _id: "id5",
      titreInformatif: "titre info5",
      status: "Rejeté structure",
      typeContenu: "demarche",
      nbMercis: 0,
      nbVues: 10,
      mainSponsor: "sponsor"
    },
    {
      _id: "id6",
      titreInformatif: "titre info6",
      status: "Actif",
      typeContenu: "demarche",
      nbMercis: 0,
      nbVues: 10,
      mainSponsor: "sponsor"
    }
  ];

  const userStructure = {
    nom: "main",
    _id: "userStructureId",
    dispositifsAssocies: [
      {
        _id: "id7",
        titreInformatif: "titre info7",
        status: "Actif",
        typeContenu: "demarche",
        nbMercis: 0,
        nbVues: 10,
        mainSponsor: "sponsor"
      }
    ],
    membres: [{ _id: "userId", roles: ["contributeur"] }]
  };
  const userState = {
    user: {
      _id: "userId"
    }
  };
  it("should render correctly when contributions", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserContributions,
        reduxState: {
          ...initialMockStore,
          userContributions,
          userStructure,
          user: userState
        }
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "userStructureId",
      shouldRedirect: false
    });
    expect(fetchUserContributionsActionCreator).toHaveBeenCalledWith();
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when clicks", async () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserContributions,
        reduxState: {
          ...initialMockStore,
          userContributions,
          userStructure,
          user: userState
        }
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "userStructureId",
      shouldRedirect: false
    });
    expect(fetchUserContributionsActionCreator).toHaveBeenCalledWith();
  });

  it("should render correctly when click on delete", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserContributions,
        reduxState: {
          ...initialMockStore,
          userContributions: [userContributions[0]],
          user: userState
        }
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "userStructureId",
      shouldRedirect: false
    });
    expect(fetchUserContributionsActionCreator).toHaveBeenCalledWith();
    act(() =>
      component.root.findByProps({ "data-test-id": "test_delete_id1" }).props.onClick({ stopPropagation: () => {} })
    );
    expect(component.toJSON()).toMatchSnapshot();
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Êtes-vous sûr ?",
      text: "La suppression d'un dispositif est irréversible",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: "Oui, le supprimer",
      cancelButtonText: "Annuler"
    });
  });
});
