import { HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { useTranslation } from "next-i18next";
import { isMobileOnly } from "react-device-detect";

import { getPath } from "routes";
import { useAuth } from "hooks";

const useSubscribeToolItem = (): HeaderProps.QuickAccessItem | null => {
  const { t } = useTranslation();
  const { isAuth } = useAuth();

  if (isMobileOnly || isAuth) return null;

  return {
    iconId: "ri-user-add-line",
    linkProps: {
      href: getPath("/auth", "fr"),
      prefetch: false,
    },
    text: t("Toolbar.Inscription", "Inscription"),
  };
};

export default useSubscribeToolItem;
