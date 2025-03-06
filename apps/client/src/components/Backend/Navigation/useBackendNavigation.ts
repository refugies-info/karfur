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
      iconName: nbNewNotifications > 0 ? "bell" : "bell-outline",
      route: "/backend/user-dash-notifications" as PathNames,
      title: `${t("Toolbar.Mes notifications", "Notifications")} (${nbNewNotifications})`,
    }),
    useBackendNavItem({
      route: "/backend/user-favorites" as PathNames,
      iconName: "star-outline",
      title: t("Toolbar.Mes favoris", "Favoris"),
      access: "all",
    }),
    useBackendNavItem({
      route: "/backend/user-dash-contrib" as PathNames,
      iconName: "file-add-outline",
      title: t("Toolbar.Mes fiches", "Fiches"),
      access: "all",
    }),
    useBackendNavItem({
      route: "/backend/user-translation" as PathNames,
      iconName: "globe-outline",
      title: t("Toolbar.Mes traductions", "Traductions"),
      access: "all",
    }),
    useBackendNavItem({
      route: "/backend/user-dash-structure" as PathNames,
      iconName: "briefcase-outline",
      title: t("Toolbar.Ma structure", "Structure"),
      access: RoleName.STRUCTURE,
    }),
    useBackendNavItem({
      route: "/backend/user-profile" as PathNames,
      iconName: "person-outline",
      title: t("Toolbar.Mon profil", "Profil"),
      access: "all",
    }),
    useBackendNavItem({
      route: "/backend/admin" as PathNames,
      iconName: "shield-outline",
      title: t("Toolbar.Administration", "Admin"),
      access: RoleName.ADMIN,
    }),
    useBackendNavItem({
      onClick: disconnect,
      iconName: "log-out-outline",
      iconColor: "var(--text-default-error)",
      textColor: "var(--text-default-error)",
      title: t("Toolbar.logout", "Se déconnecter"),
      access: "all",
    }),
  ].filter((n) => n !== null) as MainNavigationProps.Item[];
};

export default useBackendNavigation;
