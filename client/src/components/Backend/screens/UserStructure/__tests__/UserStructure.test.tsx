import { wrapWithProvidersAndRender } from "../../../../../../jest/lib/wrapWithProvidersAndRender";
import { UserStructureComponent } from "../UserStructure.component";
import "jest-styled-components";
import { act, ReactTestRenderer } from "react-test-renderer";
import { initialMockStore } from "__fixtures__/reduxStore";
import {
  fetchUserStructureActionCreator,
  updateUserStructureActionCreator,
} from "services/UserStructure/userStructure.actions";
import Swal from "sweetalert2";
import { colors } from "colors";
import { GetStructureResponse, StructureMemberRole, StructureStatus, UserStatus } from "@refugies-info/api-types";
jest.mock("next/router", () => require("next-router-mock"));

// need to mock react strap because issue with modal
jest.mock("reactstrap", () => {
  const { Table, Input, InputGroup, InputGroupText } = jest.requireActual("reactstrap");
  const { MockReactModal } = require("../../../../../../jest/__mocks__/MockModal");

  return { Modal: MockReactModal, Table, Input, InputGroup, InputGroupText };
});

jest.mock("services/UserStructure/userStructure.actions", () => {
  const actions = jest.requireActual("services/UserStructure/userStructure.actions");
  return {
    fetchUserStructureActionCreator: jest.fn(actions.fetchUserStructureActionCreator),
    updateUserStructureActionCreator: jest.fn(actions.updateUserStructureActionCreator),
  };
});

describe("UserStructure", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly when loading", () => {
    window.scrollTo = jest.fn();
    let component: ReactTestRenderer;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserStructureComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: true } },
          userStructure: {
            _id: "structureId",
            createur: "",
            nom: "",
            adminPercentageProgressionStatus: "",
            membres: [],
            dispositifsAssocies: [],
          },
        },
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "structureId",
      shouldRedirect: true,
    });

    //@ts-ignore
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when no structure", () => {
    window.scrollTo = jest.fn();
    let component: ReactTestRenderer;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserStructureComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
        },
      });
    });
    expect(fetchUserStructureActionCreator).not.toHaveBeenCalled();
    //@ts-ignore
    expect(component.toJSON()).toMatchSnapshot();
  });

  const structure: GetStructureResponse = {
    status: StructureStatus.ACTIVE,
    _id: "structureId",
    nom: "structureTest",
    acronyme: "ACRO",
    createur: "",
    adminPercentageProgressionStatus: "",
    membres: [
      {
        userId: "id1",
        roles: [StructureMemberRole.CONTRIB],
        username: "membre1",
        picture: { secure_url: "", public_id: "", imgId: "" },
        last_connected: new Date(),
        added_at: new Date(),
        mainRole: "Rédacteur",
      },
      {
        userId: "id2",
        roles: [StructureMemberRole.ADMIN],
        username: "membre2",
        picture: { secure_url: "", public_id: "", imgId: "" },
        last_connected: new Date(),
        added_at: new Date(),
        mainRole: "Rédacteur",
      },
    ],
    dispositifsAssocies: [],
  };
  it("should render correctly when structure with membres when user is respo", () => {
    window.scrollTo = jest.fn();
    let component: ReactTestRenderer;

    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserStructureComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          userStructure: structure,
          user: {
            userId: "id2",
            user: {
              _id: "id2",
              contributions: [],
              email: "",
              phone: "",
              roles: [],
              selectedLanguages: [],
              status: UserStatus.ACTIVE,
              username: "membre2",
              structures: [],
            },
            admin: false,
            traducteur: false,
            expertTrad: false,
            contributeur: false,
            caregiver: false,
            hasStructure: false,
            rolesInStructure: [StructureMemberRole.ADMIN],
          },
        },
      });
    });
    //@ts-ignore
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when structure with membres when user is redacteur", () => {
    window.scrollTo = jest.fn();
    let component: ReactTestRenderer;

    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserStructureComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          userStructure: structure,
          user: {
            userId: "id1",
            user: {
              _id: "id1",
              contributions: [],
              email: "",
              phone: "",
              roles: [],
              selectedLanguages: [],
              status: UserStatus.ACTIVE,
              username: "membre1",
              structures: [],
            },
            admin: false,
            traducteur: false,
            expertTrad: false,
            contributeur: false,
            caregiver: false,
            hasStructure: false,
            rolesInStructure: [StructureMemberRole.ADMIN],
          },
        },
      });
    });
    //@ts-ignore
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when add member modal is open", () => {
    window.scrollTo = jest.fn();
    let component: ReactTestRenderer;

    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserStructureComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          userStructure: structure,
          user: {
            userId: "id2",
            user: {
              _id: "id2",
              contributions: [],
              email: "",
              phone: "",
              roles: [],
              selectedLanguages: [],
              status: UserStatus.ACTIVE,
              username: "membre2",
              structures: [],
            },
            admin: false,
            traducteur: false,
            expertTrad: false,
            contributeur: false,
            caregiver: false,
            hasStructure: false,
            rolesInStructure: [StructureMemberRole.ADMIN],
          },
        },
      });
    });
    act(() => {
      component.root.findByProps({ "data-test-id": "test-add-member" }).props.onClick();
    });
    //@ts-ignore
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when edit member modal is open, select respo and validate", () => {
    window.scrollTo = jest.fn();
    let component: ReactTestRenderer;

    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserStructureComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          userStructure: structure,
          user: {
            userId: "id2",
            user: {
              _id: "id2",
              contributions: [],
              email: "",
              phone: "",
              roles: [],
              selectedLanguages: [],
              status: UserStatus.ACTIVE,
              username: "membre2",
              structures: [],
            },
            admin: false,
            traducteur: false,
            expertTrad: false,
            contributeur: false,
            caregiver: false,
            hasStructure: false,
            rolesInStructure: [StructureMemberRole.ADMIN],
          },
        },
      });
    });
    act(() => {
      component.root.findByProps({ "data-test-id": "test_see_id1" }).props.onClick();
    });
    //@ts-ignore
    expect(component.toJSON()).toMatchSnapshot();
    act(() => {
      component.root.findByProps({ "data-test-id": "test-role-Responsable" }).props.onClick();
    });
    //@ts-ignore
    expect(component.toJSON()).toMatchSnapshot();

    act(() => {
      component.root.findByProps({ "data-test-id": "test-validate-edit" }).props.onClick();
    });
    expect(updateUserStructureActionCreator).toHaveBeenCalledWith({
      membres: {
        structureId: "structureId",
        userId: "id1",
        newRole: "administrateur",
        type: "modify",
      },
    });
  });

  it("should delete user ", async () => {
    const promise = Promise.resolve();

    //@ts-ignore
    Swal.fire.mockResolvedValueOnce({ value: true });

    window.scrollTo = jest.fn();
    let component: ReactTestRenderer;

    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserStructureComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          userStructure: structure,
          user: {
            userId: "id2",
            user: {
              _id: "id2",
              contributions: [],
              email: "",
              phone: "",
              roles: [],
              selectedLanguages: [],
              status: UserStatus.ACTIVE,
              username: "membre2",
              structures: [],
            },
            admin: false,
            traducteur: false,
            expertTrad: false,
            contributeur: false,
            caregiver: false,
            hasStructure: false,
            rolesInStructure: [StructureMemberRole.ADMIN],
          },
        },
      });
    });
    act(() => {
      component.root.findByProps({ "data-test-id": "test_delete_id1" }).props.onClick();
    });
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Êtes-vous sûr ?",
      text: "Vous êtes sur le point d'enlever un membre de votre structure.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: "Oui, l'enlever",
      cancelButtonText: "Annuler",
    });
    await act(() => promise);
  });
});
