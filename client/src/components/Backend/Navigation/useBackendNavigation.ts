import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { RoleName } from "@refugies-info/api-types";
import { getPath, PathNames } from "routes";
import useBackendNavItem from "./BackendNavItem/useBackendNavItem";
import API from "utils/API";
import { useSelector } from "react-redux";
import { userStructureDisposAssociesSelector, userStructureHasResponsibleSeenNotification } from "services/UserStructure/userStructure.selectors";
import { getNbNewNotifications } from "../screens/UserNotifications/lib";
import { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";

const useBackendNavigation = (): MainNavigationProps.Item[] => {
  const { t } = useTranslation();
  const router = useRouter();

  // notifs
  const dispositifsAssocies = useSelector(userStructureDisposAssociesSelector);
  const hasResponsibleSeenNotification = useSelector(userStructureHasResponsibleSeenNotification);
  const nbNewNotifications = getNbNewNotifications(dispositifsAssocies, hasResponsibleSeenNotification);

  // logout
  const disconnect = () => {
    API.logout();
    window.location.href = "/";
  };

  return ([
    useBackendNavItem({
      access: "all",
      iconName: "search-outline",
      onClick: () => router.push(getPath("/recherche", router.locale)),
      title: t("Toolbar.find_information"),
    }),
    useBackendNavItem({
      access: RoleName.STRUCTURE,
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
      access: RoleName.STRUCTURE,
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
      access: RoleName.ADMIN,
    }),
    useBackendNavItem({
      onClick: disconnect,
      iconName: "log-out-outline",
      iconColor: "#e55039",
      textColor: "#e55039",
      title: t("Toolbar.logout"),
      access: "all",
    })
  ].filter(n => n !== null) as MainNavigationProps.Item[]);
};

export default useBackendNavigation;
