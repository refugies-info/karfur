import { useAuth } from "@/hooks";
import useRouterLocale from "@/hooks/useRouterLocale";
import { Event } from "@/lib/tracking";
import { userSelector } from "@/services/User/user.selectors";
import history from "@/utils/backendHistory";
import { HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { isMobileOnly } from "react-device-detect";
import { useSelector } from "react-redux";
import { getPath } from "routes";

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
        linkProps: {
          href: getPath("/auth", "fr"),
          prefetch: false,
          onClick: () => Event("AUTH", "start", "navbar"),
        },
        text: t("Toolbar.Connexion", "Connexion"),
      };
};

export default useUserToolItem;
