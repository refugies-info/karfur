import { initialMockStore } from "@/__fixtures__/reduxStore";
import {
  fetchUserStructureActionCreator,
  updateUserStructureActionCreator,
} from "@/services/UserStructure/userStructure.actions";
import { colors } from "@/utils/colors";
import { GetStructureResponse, StructureMemberRole, StructureStatus, UserStatus } from "@refugies-info/api-types";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "jest-styled-components";
import Swal from "sweetalert2";
import { wrapWithProvidersAndRenderForTesting } from "../../../../../../jest/lib/wrapWithProvidersAndRender";
import { UserStructureComponent } from "../UserStructure.component";

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
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
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
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "structureId",
      shouldRedirect: false,
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render correctly when no structure", () => {
    window.scrollTo = jest.fn();
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: UserStructureComponent,
      reduxState: {
        ...initialMockStore,
        loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
      },
    });
    expect(fetchUserStructureActionCreator).not.toHaveBeenCalled();
    expect(asFragment()).toMatchSnapshot();
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
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
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
            sso: false,
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
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render correctly when structure with membres when user is redacteur", () => {
    window.scrollTo = jest.fn();
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
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
            sso: false,
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
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render correctly when add member modal is open", async () => {
    const user = userEvent.setup();
    window.scrollTo = jest.fn();
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
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
            sso: false,
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
    await user.click(screen.getByTestId("test-add-member"));
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render correctly when edit member modal is open, select respo and validate", async () => {
    const user = userEvent.setup();
    window.scrollTo = jest.fn();
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
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
            sso: false,
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
    await user.click(screen.getByTestId("edit-member-id1"));
    expect(asFragment()).toMatchSnapshot();

    await user.click(screen.getByTestId("test-role-Responsable"));
    expect(asFragment()).toMatchSnapshot();

    await user.click(screen.getByTestId("test-validate-edit"));

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
    const user = userEvent.setup();
    Swal.fire = jest.fn().mockResolvedValueOnce({ value: true });

    window.scrollTo = jest.fn();
    const component = wrapWithProvidersAndRenderForTesting({
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
            sso: false,
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

    await user.click(screen.getByTestId("delete-button-id1"));
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
  });
});
