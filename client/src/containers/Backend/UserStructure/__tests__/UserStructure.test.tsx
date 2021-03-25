// @ts-nocheck
import { wrapWithProvidersAndRender } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import { UserStructureComponent } from "../UserStructure.component";
import "jest-styled-components";
import { act } from "react-test-renderer";
import { initialMockStore } from "../../../../__fixtures__/reduxStore";
import {
  fetchUserStructureActionCreator,
  updateUserStructureActionCreator,
} from "../../../../services/UserStructure/userStructure.actions";

// need to mock react strap because issue with modal
jest.mock("reactstrap", () => {
  const { Table } = jest.requireActual("reactstrap");
  const { MockReactModal } = require("../../../../../jest/__mocks__/MockModal");

  return { Modal: MockReactModal, Table };
});

jest.mock("../../../../services/UserStructure/userStructure.actions", () => {
  const actions = jest.requireActual(
    "../../../../services/UserStructure/userStructure.actions"
  );
  return {
    fetchUserStructureActionCreator: jest.fn(
      actions.fetchUserStructureActionCreator
    ),
    updateUserStructureActionCreator: jest.fn(
      actions.updateUserStructureActionCreator
    ),
  };
});

describe("UserStructure", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly when loading", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserStructureComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: true } },
          userStructure: { _id: "structureId" },
        },
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "structureId",
      shouldRedirect: true,
    });

    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when no structure", () => {
    window.scrollTo = jest.fn();
    let component;
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
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when structure en attente", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserStructureComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          userStructure: { status: "En attente", _id: "structureId" },
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
  const structure = {
    status: "Actif",
    _id: "structureId",
    nom: "structureTest",
    acronyme: "ACRO",
    membres: [
      { _id: "id1", roles: ["contributeur"], username: "membre1" },
      { _id: "id2", roles: ["administrateur"], username: "membre2" },
    ],
  };
  it("should render correctly when structure with membres when user is respo", () => {
    window.scrollTo = jest.fn();
    let component;

    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserStructureComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          userStructure: structure,
          user: { userId: "id2" },
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when structure with membres when user is redacteur", () => {
    window.scrollTo = jest.fn();
    let component;

    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserStructureComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          userStructure: structure,
          user: { userId: "id1" },
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when add member modal is open", () => {
    window.scrollTo = jest.fn();
    let component;

    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserStructureComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          userStructure: structure,
          user: { userId: "id2" },
        },
      });
    });
    act(() => {
      component.root.findByProps({ testID: "test-add-member" }).props.onClick();
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when edit member modal is open, select respo and validate", () => {
    window.scrollTo = jest.fn();
    let component;

    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserStructureComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          userStructure: structure,
          user: { userId: "id2" },
        },
      });
    });
    act(() => {
      component.root.findByProps({ testID: "test_see_id1" }).props.onClick();
    });
    expect(component.toJSON()).toMatchSnapshot();
    act(() => {
      component.root
        .findByProps({ testID: "test-role-Responsable" })
        .props.onClick();
    });
    expect(component.toJSON()).toMatchSnapshot();

    act(() => {
      component.root
        .findByProps({ testID: "test-validate-edit" })
        .props.onClick();
    });
    expect(updateUserStructureActionCreator).toHaveBeenCalledWith({
      modifyMembres: true,
      data: {
        structureId: "structureId",
        userId: "id1",
        newRole: "administrateur",
        type: "modify",
      },
    });
  });

  it("should delete user ", () => {
    window.scrollTo = jest.fn();
    let component;

    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserStructureComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          userStructure: structure,
          user: { userId: "id2" },
        },
      });
    });
    act(() => {
      component.root.findByProps({ testID: "test_delete_id1" }).props.onClick();
    });

    expect(updateUserStructureActionCreator).toHaveBeenCalledWith({
      modifyMembres: true,
      data: {
        structureId: "structureId",
        userId: "id1",
        type: "delete",
      },
    });
  });
});
