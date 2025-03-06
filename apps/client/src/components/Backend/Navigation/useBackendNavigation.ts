import { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { RoleName } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { PathNames } from "routes";
import {
  userStructureDisposAssociesSelector,
  userStructureHasResponsibleSeenNotification,
} from "~/services/UserStructure/userStructure.selectors";
import API from "~/utils/API";
import { getNbNewNotifications } from "../screens/UserNotifications/lib";
import useBackendNavItem from "./BackendNavItem/useBackendNavItem";

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

  return [
    useBackendNavItem({
      access: RoleName.STRUCTURE,
      iconName: nbNewNotifications > 0 ? "ri-bell-fill" : "ri-bell-line",
      route: "/backend/user-dash-notifications" as PathNames,
      title: `${t("Toolbar.Mes notifications")} (${nbNewNotifications})`,
    }),
    useBackendNavItem({
      route: "/backend/user-favorites" as PathNames,
      iconName: "fr-icon-star-line",
      title: t("Toolbar.Mes favoris"),
      access: "all",
    }),
    useBackendNavItem({
      route: "/backend/user-dash-contrib" as PathNames,
      iconName: "ri-file-2-line",
      title: t("Toolbar.Mes fiches"),
      access: "all",
    }),
    useBackendNavItem({
      route: "/backend/user-translation" as PathNames,
      iconName: "ri-globe-line",
      title: t("Toolbar.Mes traductions"),
      access: "all",
    }),
    useBackendNavItem({
      route: "/backend/user-dash-structure" as PathNames,
      iconName: "ri-briefcase-line",
      title: t("Toolbar.Ma structure"),
      access: RoleName.STRUCTURE,
    }),
    useBackendNavItem({
      route: "/backend/user-profile" as PathNames,
      iconName: "ri-user-line",
      title: t("Toolbar.Mon profil"),
      access: "all",
    }),
    useBackendNavItem({
      route: "/backend/admin" as PathNames,
      iconName: "ri-shield-line",
      title: t("Toolbar.Administration"),
      access: RoleName.ADMIN,
    }),
    useBackendNavItem({
      onClick: disconnect,
      iconName: "ri-logout-box-line",
      iconColor: "var(--text-default-error)",
      textColor: "var(--text-default-error)",
      title: t("Toolbar.logout"),
      access: "all",
    }),
  ].filter((n) => n !== null) as MainNavigationProps.Item[];
};

export default useBackendNavigation;
