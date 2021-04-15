import React from "react";
import styled from "styled-components";
import { navigationData } from "./data";
import { NavButton } from "./components/NavButton";
import { Props } from "./Navigation.container";
import API from "../../../utils/API";
import { useDispatch, useSelector } from "react-redux";
import { setUserStructureActionCreator } from "../../../services/UserStructure/userStructure.actions";
import { fetchUserActionCreator } from "../../../services/User/user.actions";
import { userSelector } from "../../../services/User/user.selectors";
import {
  userStructureDisposAssociesSelector,
  userStructureHasResponsibleSeenNotification,
} from "../../../services/UserStructure/userStructure.selectors";
import { getNbNewNotifications } from "../UserNotifications/lib";

export type SelectedPage =
  | "notifications"
  | "favoris"
  | "profil"
  | "contributions"
  | "traductions"
  | "structure"
  | "admin"
  | "logout";
export interface PropsBeforeInjection {
  selected: SelectedPage;
}

const NavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
`;

export const NavigationComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
  const user = useSelector(userSelector);
  const isAdmin = user && user.admin;
  const hasStructure = user && user.membreStruct;

  const dispositifsAssocies = useSelector(userStructureDisposAssociesSelector);
  const hasResponsibleSeenNotification = useSelector(
    userStructureHasResponsibleSeenNotification
  );

  const nbNewNotifications = getNbNewNotifications(
    dispositifsAssocies,
    hasResponsibleSeenNotification
  );

  const dispatch = useDispatch();
  const disconnect = () => {
    API.logout();
    dispatch(fetchUserActionCreator());
    dispatch(setUserStructureActionCreator(null));
    return props.history.push("/");
  };
  const onButtonClick = (type: SelectedPage) => {
    if (type === "traductions") {
      return props.history.push("/backend/user-translation");
    }
    if (type === "notifications") {
      return props.history.push("/backend/user-dash-notifications");
    }
    if (type === "favoris") {
      return props.history.push("/backend/user-favorites");
    }
    if (type === "contributions") {
      return props.history.push("/backend/user-dash-contrib");
    }
    if (type === "structure") {
      return props.history.push("/backend/user-dash-structure");
    }
    if (type === "profil") {
      return props.history.push("/backend/user-profile");
    }
    if (type === "admin") {
      return props.history.push("/backend/admin");
    }
    if (type === "logout") {
      return disconnect();
    }
    return;
  };
  return (
    <NavigationContainer>
      {navigationData.map((data) => {
        if (data.access === "admin" && !isAdmin) return;
        if (data.access === "hasStructure" && !hasStructure) return;
        return (
          <NavButton
            title={data.title}
            key={data.type}
            iconName={data.iconName}
            isSelected={props.selected === data.type}
            type={data.type}
            onClick={() => onButtonClick(data.type)}
            // @ts-ignore
            t={props.t}
            nbNewNotifications={nbNewNotifications}
          />
        );
      })}
    </NavigationContainer>
  );
};
