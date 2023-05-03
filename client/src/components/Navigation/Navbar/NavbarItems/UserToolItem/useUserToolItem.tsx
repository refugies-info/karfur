import { useSelector } from "react-redux";
import { userSelector } from "services/User/user.selectors";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { getPath } from "routes";
import history from "utils/backendHistory";
import useRouterLocale from "hooks/useRouterLocale";
import { isMobileOnly } from "react-device-detect";
import { useAuth } from "hooks";
import { HeaderProps } from "@codegouvfr/react-dsfr/Header";

const useUserToolItem = (): HeaderProps.QuickAccessItem | null => {
  const router = useRouter();
  const routerLocale = useRouterLocale();
  const { t } = useTranslation();
  const user = useSelector(userSelector);
  const { isAuth } = useAuth();

  const goToProfile = () => {
    let pathName = "/backend/user-favorites";
    if (user.hasStructure) pathName = "/backend/user-dash-notifications";
    if (user.admin) pathName = "/backend/admin";

    const isOnBackend = router.pathname.includes("backend");
    if (!isOnBackend) router.push(pathName);
    else if (history) history.push(routerLocale + pathName);
  };

  const goToConnexion = () => {
    router.push(getPath("/login", router.locale));
  };

  // Disabled on mobile devices
  if (isMobileOnly) return null;

  return isAuth
    ? {
        iconId: "ri-user-line",
        buttonProps: {
          onClick: goToProfile,
        },
        text: t("Toolbar.Mon espace", "Mon espace"),
      }
    : {
        iconId: "ri-user-line",
        buttonProps: {
          onClick: goToConnexion,
        },
        text: t("Toolbar.Connexion", "Connexion"),
      };
};

export default useUserToolItem;
