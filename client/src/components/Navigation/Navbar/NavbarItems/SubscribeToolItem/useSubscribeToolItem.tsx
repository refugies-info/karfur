import { HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { isMobileOnly } from "react-device-detect";

import { getPath } from "routes";
import { useAuth } from "hooks";

const useSubscribeToolItem = (): HeaderProps.QuickAccessItem | null => {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuth } = useAuth();

  if (isMobileOnly || isAuth) return null;

  return {
    iconId: "ri-user-add-line",
    linkProps: {
      href: getPath("/register", router.locale),
      prefetch: false,
    },
    text: t("Toolbar.Inscription", "Inscription"),
  };
};

export default useSubscribeToolItem;
