import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getPath, PathNames } from "routes";
import useBackendNavItem from "./BackendNavItem/useBackendNavItem";
import API from "utils/API";
import { useDispatch, useSelector } from "react-redux";
import { setUserActionCreator } from "services/User/user.actions";
import { setUserStructureActionCreator } from "services/UserStructure/userStructure.actions";
import { userStructureDisposAssociesSelector, userStructureHasResponsibleSeenNotification } from "services/UserStructure/userStructure.selectors";
import { getNbNewNotifications } from "../UserNotifications/lib";
import { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import isInBrowser from "lib/isInBrowser";

const useBackendNavigation = (): MainNavigationProps.Item[] => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  // notifs
  const dispositifsAssocies = useSelector(userStructureDisposAssociesSelector);
  const hasResponsibleSeenNotification = useSelector(userStructureHasResponsibleSeenNotification);
  const nbNewNotifications = getNbNewNotifications(dispositifsAssocies, hasResponsibleSeenNotification);

  // logout
  const disconnect = () => {
    API.logout();
    dispatch(setUserActionCreator(null));
    dispatch(setUserStructureActionCreator(null));
    window.location.href = "/";
  };

  return ([
    useBackendNavItem({
      access: "all",
      iconName: "search-outline",
      onClick: () => router.push(getPath("/recherche", router.locale)),
      title: t("Toolbar.Trouver de l'information"),
    }),
    useBackendNavItem({
      access: "hasStructure",
      iconName: nbNewNotifications > 0 ? "bell" : "bell-outline",
      route: "/backend/user-dash-notifications" as PathNames,
      title: `${t("Toolbar.Mes notifications")} (${nbNewNotifications})`,
    }),
    useBackendNavItem({
      route: "/backend/user-favorites" as PathNames,
      iconName: "star-outline",
      title: t("Toolbar.Mes favoris"),
      access: "all",
    }),
    useBackendNavItem({
      route: "/backend/user-dash-contrib" as PathNames,
      iconName: "file-add-outline",
      title: t("Toolbar.Mes fiches"),
      access: "all",
    }),
    useBackendNavItem({
      route: "/backend/user-translation" as PathNames,
      iconName: "globe-outline",
      title: t("Toolbar.Mes traductions"),
      access: "all",
    }),
    useBackendNavItem({
      route: "/backend/user-dash-structure" as PathNames,
      iconName: "briefcase-outline",
      title: t("Toolbar.Ma structure"),
      access: "hasStructure",
    }),
    useBackendNavItem({
      route: "/backend/user-profile" as PathNames,
      iconName: "person-outline",
      title: t("Toolbar.Mon profil"),
      access: "all",
    }),
    useBackendNavItem({
      route: "/backend/admin" as PathNames,
      iconName: "shield-outline",
      title: t("Toolbar.Administration"),
      access: "admin",
    }),
    useBackendNavItem({
      onClick: disconnect,
      iconName: "log-out-outline",
      iconColor: "#e55039",
      access: "all",
    })
  ].filter(n => n !== null) as MainNavigationProps.Item[]);
};

export default useBackendNavigation;
