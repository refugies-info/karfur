import React from "react";
import { navigationData } from "./data";
import { NavButton } from "./components/NavButton";
import API from "utils/API";
import { useDispatch, useSelector } from "react-redux";
import { setUserStructureActionCreator } from "services/UserStructure/userStructure.actions";
import { setUserActionCreator } from "services/User/user.actions";
import { userSelector } from "services/User/user.selectors";
import {
  userStructureDisposAssociesSelector,
  userStructureHasResponsibleSeenNotification,
} from "services/UserStructure/userStructure.selectors";
import { getNbNewNotifications } from "../UserNotifications/lib";
import { useHistory } from "react-router-dom";
import styles from "./Navigation.module.scss";
import useRouterLocale from "hooks/useRouterLocale";

export type SelectedPage =
  | "notifications"
  | "favoris"
  | "profil"
  | "contributions"
  | "traductions"
  | "structure"
  | "admin"
  | "logout";
interface Props {
  selected: SelectedPage;
}

const NavigationComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
  const user = useSelector(userSelector);
  const routerLocale = useRouterLocale();
  const history = useHistory();
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
    dispatch(setUserActionCreator(null));
    dispatch(setUserStructureActionCreator(null));
    window.location.href = "/";
  };
  const onButtonClick = (type: SelectedPage) => {
    if (type === "traductions") {
      return history.push(routerLocale + "/backend/user-translation");
    }
    if (type === "notifications") {
      return history.push(routerLocale + "/backend/user-dash-notifications");
    }
    if (type === "favoris") {
      return history.push(routerLocale + "/backend/user-favorites");
    }
    if (type === "contributions") {
      return history.push(routerLocale + "/backend/user-dash-contrib");
    }
    if (type === "structure") {
      return history.push(routerLocale + "/backend/user-dash-structure");
    }
    if (type === "profil") {
      return history.push(routerLocale + "/backend/user-profile");
    }
    if (type === "admin") {
      return history.push(routerLocale + "/backend/admin");
    }
    if (type === "logout") {
      return disconnect();
    }
    return;
  };
  return (
    <div className={styles.container}>
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
            nbNewNotifications={nbNewNotifications}
          />
        );
      })}
    </div>
  );
};

export default NavigationComponent;
