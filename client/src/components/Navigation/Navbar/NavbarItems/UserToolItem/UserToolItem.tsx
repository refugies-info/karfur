import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ToolItem } from "@dataesr/react-dsfr";
import { userSelector } from "services/User/user.selectors";

import marioProfile from "assets/mario-profile.jpg";
import API from "utils/API";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { getPath } from "routes";
import Link from "next/link";
import history from "utils/backendHistory";
import useRouterLocale from "hooks/useRouterLocale";
import Image from "next/image";
import { isMobileOnly } from "react-device-detect";
import { useAuth } from "hooks";

const UserToolItem = () => {
  const router = useRouter();
  const routerLocale = useRouterLocale();
  const { t } = useTranslation();
  const user = useSelector(userSelector);
  const { isAuth } = useAuth();

  const userImg = user.user && user.user.picture ? user.user.picture.secure_url : marioProfile;

  const goToProfile = () => {
    let pathName = "/backend/user-favorites";
    if (user.membreStruct) pathName = "/backend/user-dash-notifications";
    if (user.admin) pathName = "/backend/admin";

    const isOnBackend = router.pathname.includes("backend");
    if (!isOnBackend) router.push(pathName);
    else if (history) history.push(routerLocale + pathName);
  };

  // Disabled on mobile devices
  if (isMobileOnly) return null;

  return isAuth ? (
    <ToolItem onClick={goToProfile}>
      <Image alt="votre image de profil" src={userImg} width="48" height="48" style={{ borderRadius: 100 }} />
    </ToolItem>
  ) : (
    <ToolItem asLink={<Link href={getPath("/login", router.locale)} />} icon="ri-user-line">
      {t("Toolbar.Connexion", "Connexion")}
    </ToolItem>
  );
};

UserToolItem.defaultProps = {
  __TYPE: "ToolItem"
};

export default UserToolItem;
