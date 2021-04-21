// @ts-nocheck
import { initialMockStore } from "../../../../__fixtures__/reduxStore";
import { wrapWithProvidersAndRender } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import { act } from "react-test-renderer";
import "jest-styled-components";
import { UserNotificationsComponent } from "../UserNotifications.component";
import {
  fetchUserStructureActionCreator,
  setUserStructureActionCreator,
  updateUserStructureActionCreator,
} from "../../../../services/UserStructure/userStructure.actions";
import { updateDispositifReactionActionCreator } from "../../../../services/ActiveDispositifs/activeDispositifs.actions";

jest.mock("../../../../services/UserStructure/userStructure.actions", () => {
  const actions = jest.requireActual(
    "../../../../services/UserStructure/userStructure.actions"
  );
  return {
    fetchUserStructureActionCreator: jest.fn(
      actions.fetchUserStructureActionCreator
    ),
    setUserStructureActionCreator: jest.fn(
      actions.setUserStructureActionCreator
    ),
    updateUserStructureActionCreator: jest.fn(
      actions.updateUserStructureActionCreator
    ),
  };
});

jest.mock(
  "../../../../services/ActiveDispositifs/activeDispositifs.actions",
  () => {
    const actions = jest.requireActual(
      "../../../../services/ActiveDispositifs/activeDispositifs.actions"
    );
    return {
      updateDispositifReactionActionCreator: jest.fn(
        actions.updateDispositifReactionActionCreator
      ),
    };
  }
);

describe("UserNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render correctly when loading", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserNotificationsComponent,
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
        Component: UserNotificationsComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          user: { user: { structures: ["structureId"] } },
          userStructure: {
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
        Component: UserNotificationsComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          user: { user: { structures: ["structureId"] } },
          userStructure: {
            hasResponsibleSeenNotification: false,
            dispositifsAssocies: [
              notifNewContent,
              notifReactionRead,
              notifReactionNotRead,
            ],
          },
        },
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "structureId",
      shouldRedirect: true,
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should link to dispositif when click on new content notif", () => {
    window.scrollTo = jest.fn();
    let component;
    const push = jest.fn();
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserNotificationsComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          user: { user: { structures: ["structureId"] } },
          userStructure: {
            hasResponsibleSeenNotification: false,
            dispositifsAssocies: [notifNewContent],
          },
        },
        compProps: { history: { push } },
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "structureId",
      shouldRedirect: true,
    });
    component.root
      .findByProps({ testID: "test-notif-new content" })
      .props.onClick({ stopPropagation: jest.fn() });
    expect(push).toHaveBeenCalledWith("/dispositif/id");
  });

  it("should link to dispositif when click on annuaire notif", () => {
    window.scrollTo = jest.fn();
    let component;
    const push = jest.fn();
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserNotificationsComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          user: { user: { structures: ["structureId"] } },
          userStructure: {
            hasResponsibleSeenNotification: false,
            dispositifsAssocies: [],
          },
        },
        compProps: { history: { push } },
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "structureId",
      shouldRedirect: true,
    });
    component.root
      .findByProps({ testID: "test-notif-annuaire" })
      .props.onClick({ stopPropagation: jest.fn() });
    expect(push).toHaveBeenCalledWith("/annuaire-create");
  });

  it("should delete notif reaction", () => {
    window.scrollTo = jest.fn();
    let component;
    const push = jest.fn();
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserNotificationsComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          user: { user: { structures: ["structureId"] } },
          userStructure: {
            hasResponsibleSeenNotification: true,
            dispositifsAssocies: [notifReactionRead],
          },
        },
        compProps: { history: { push } },
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "structureId",
      shouldRedirect: true,
    });
    component.root
      .findByProps({ testID: "test-delete-reaction" })
      .props.onClick({ stopPropagation: jest.fn() });
    expect(updateDispositifReactionActionCreator).toHaveBeenLastCalledWith({
      dispositif: {
        dispositifId: "id2",
        suggestionId: "suggesID2",
        fieldName: "suggestions",
        type: "remove",
      },
      structureId: "structureId",
    });
  });

  it("should delete notif annuaire", () => {
    window.scrollTo = jest.fn();
    let component;
    const push = jest.fn();
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserNotificationsComponent,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER_STRUCTURE: { isLoading: false } },
          user: { user: { structures: ["structureId"] } },
          userStructure: {
            hasResponsibleSeenNotification: false,
            dispositifsAssocies: [],
          },
        },
        compProps: { history: { push } },
      });
    });
    expect(fetchUserStructureActionCreator).toHaveBeenCalledWith({
      structureId: "structureId",
      shouldRedirect: true,
    });
    component.root
      .findByProps({ testID: "test-delete-annuaire" })
      .props.onClick({ stopPropagation: jest.fn() });
    expect(setUserStructureActionCreator).toHaveBeenLastCalledWith({
      dispositifsAssocies: [],
      hasResponsibleSeenNotification: true,
    });
    expect(updateUserStructureActionCreator).toHaveBeenCalledWith({
      modifyMembres: false,
    });
  });
});
