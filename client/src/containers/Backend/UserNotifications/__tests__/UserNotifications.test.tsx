// @ts-nocheck
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRender } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import { act } from "react-test-renderer";
import "jest-styled-components";
import UserNotifications from "../UserNotifications";
import {
  fetchUserStructureActionCreator,
  setUserStructureActionCreator,
  updateUserStructureActionCreator,
} from "services/UserStructure/userStructure.actions";
import { fetchSelectedStructureActionCreator } from "services/SelectedStructure/selectedStructure.actions";
import { updateDispositifReactionActionCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import Router from "next/router";
jest.mock("next/router", () => require("next-router-mock"));

jest.mock("services/UserStructure/userStructure.actions", () => {
  const actions = jest.requireActual("services/UserStructure/userStructure.actions");
  return {
    fetchUserStructureActionCreator: jest.fn(actions.fetchUserStructureActionCreator),
    setUserStructureActionCreator: jest.fn(actions.setUserStructureActionCreator),
    updateUserStructureActionCreator: jest.fn(actions.updateUserStructureActionCreator),
  };
});

jest.mock("services/ActiveDispositifs/activeDispositifs.actions", () => {
  const actions = jest.requireActual("services/ActiveDispositifs/activeDispositifs.actions");
  return {
    updateDispositifReactionActionCreator: jest.fn(actions.updateDispositifReactionActionCreator),
  };
});

jest.mock("services/SelectedStructure/selectedStructure.actions", () => {
  const actions = jest.requireActual("services/SelectedStructure/selectedStructure.actions");
  return {
    fetchSelectedStructureActionCreator: jest.fn(actions.fetchSelectedStructureActionCreator),
  };
});

describe("UserNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render correctly when loading", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserNotifications,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: true } },
          user: { user: { structures: ["structureId"] } },
        },
      });
    });

    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "structureId",
      shouldRedirect: true,
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when 0 notif", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserNotifications,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          user: { user: { structures: ["structureId"] } },
          userStructure: {
            _id: 1,
            hasResponsibleSeenNotification: true,
            dispositifsAssocies: [],
          },
        },
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "structureId",
      shouldRedirect: true,
    });
    expect(fetchSelectedStructureActionCreator).toHaveBeenCalledWith({
      id: "1",
      locale: "fr",
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  const notifNewContent = {
    status: "En attente",
    typeContenu: "dispositif",
    _id: "id",
    created_at: "01/01/2021",
  };

  const notifReactionNotRead = {
    suggestions: [
      {
        username: "user1",
        createdAt: "02/01/2021",
        suggestionId: "suggesID",
        suggestion: "test reaction non lue",
      },
    ],
    titreInformatif: "titre info",
    _id: "id1",
    status: "Actif",
  };

  const notifReactionRead = {
    suggestions: [
      {
        username: "user2",
        createdAt: "02/02/2022",
        suggestionId: "suggesID2",
        suggestion: "test reaction lue",
        read: true,
      },
    ],
    titreInformatif: "titre info2",
    _id: "id2",
    status: "Actif",
  };

  it("should render correctly when notif not read annuaire, not read reaction, not read new content, read reaction ", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserNotifications,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          user: { user: { structures: ["structureId"] } },
          userStructure: {
            _id: 1,
            hasResponsibleSeenNotification: false,
            dispositifsAssocies: [notifNewContent, notifReactionRead, notifReactionNotRead],
          },
        },
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "structureId",
      shouldRedirect: true,
    });
    expect(fetchSelectedStructureActionCreator).toHaveBeenCalledWith({
      id: "1",
      locale: "fr",
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should link to dispositif when click on new content notif", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserNotifications,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          user: { user: { structures: ["structureId"] } },
          userStructure: {
            _id: 1,
            hasResponsibleSeenNotification: false,
            dispositifsAssocies: [notifNewContent],
          },
        },
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "structureId",
      shouldRedirect: true,
    });
    expect(fetchSelectedStructureActionCreator).toHaveBeenCalledWith({
      id: "1",
      locale: "fr",
    });
    component.root
      .findByProps({ "data-test-id": "test-notif-new content" })
      .props.onClick({ stopPropagation: jest.fn() });
    expect(Router).toMatchObject({ asPath: "/dispositif/id" });
  });

  it("should link to dispositif when click on annuaire notif", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserNotifications,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          user: { user: { structures: ["structureId"] } },
          userStructure: {
            _id: 1,
            hasResponsibleSeenNotification: false,
            dispositifsAssocies: [],
          },
        },
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "structureId",
      shouldRedirect: true,
    });
    expect(fetchSelectedStructureActionCreator).toHaveBeenCalledWith({
      id: "1",
      locale: "fr",
    });
    component.root.findByProps({ "data-test-id": "test-notif-annuaire" }).props.onClick({ stopPropagation: jest.fn() });
    expect(Router).toMatchObject({ asPath: "/directory-create" });
  });

  it("should delete notif reaction", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserNotifications,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          user: { user: { structures: ["structureId"] } },
          userStructure: {
            _id: 1,
            hasResponsibleSeenNotification: true,
            dispositifsAssocies: [notifReactionRead],
          },
        },
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "structureId",
      shouldRedirect: true,
    });
    expect(fetchSelectedStructureActionCreator).toHaveBeenCalledWith({
      id: "1",
      locale: "fr",
    });
    component.root
      .findByProps({ "data-test-id": "test-delete-reaction" })
      .props.onClick({ stopPropagation: jest.fn() });
    expect(updateDispositifReactionActionCreator).toHaveBeenLastCalledWith({
      suggestion: {
        dispositifId: "id2",
        suggestionId: "suggesID2",
        type: "remove",
      },
      structureId: "structureId",
    });
  });
});
