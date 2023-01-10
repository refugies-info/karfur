import { ToolItem } from "@dataesr/react-dsfr";
import { useAuth } from "hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { isMobileOnly } from "react-device-detect";
import { useTranslation } from "next-i18next";
import { getPath } from "routes";

const SubscribeToolItem = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuth } = useAuth();

  if (isMobileOnly || isAuth) return null;
  return (
    <ToolItem asLink={<Link href={getPath("/register", router.locale)} prefetch={false} />} icon="ri-user-add-line">
      {t("Toolbar.Inscription", "Inscription")}
    </ToolItem>
  );
};

SubscribeToolItem.defaultProps = {
  __TYPE: "ToolItem"
};

export default SubscribeToolItem;
