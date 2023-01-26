import React from "react";
import { useSelector } from "react-redux";
import { ToolItem } from "@dataesr/react-dsfr";
import { userSelector } from "services/User/user.selectors";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { getPath } from "routes";
import Link from "next/link";
import history from "utils/backendHistory";
import useRouterLocale from "hooks/useRouterLocale";
import { isMobileOnly } from "react-device-detect";
import { useAuth } from "hooks";

const UserToolItem = () => {
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

  return isAuth ? (
    <ToolItem onClick={goToProfile}>{t("Toolbar.Mon espace", "Mon espace")}</ToolItem>
  ) : (
    <ToolItem asLink={<Link href={getPath("/login", router.locale)} prefetch={false} />} icon="ri-user-line">
      {t("Toolbar.Connexion", "Connexion")}
    </ToolItem>
  );
};

UserToolItem.defaultProps = {
  __TYPE: "ToolItem"
};

export default UserToolItem;
