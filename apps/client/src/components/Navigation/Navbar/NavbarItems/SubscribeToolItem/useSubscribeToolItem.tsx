import { useAuth } from "@/hooks";
import { Event } from "@/lib/tracking";
import { HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { useTranslation } from "next-i18next";
import { isMobileOnly } from "react-device-detect";
import { getPath } from "routes";

const useSubscribeToolItem = (): HeaderProps.QuickAccessItem | null => {
  const { t } = useTranslation();
  const { isAuth } = useAuth();

  if (isMobileOnly || isAuth) return null;

  return {
    iconId: "ri-user-add-line",
    linkProps: {
      href: getPath("/auth", "fr"),
      prefetch: false,
      onClick: () => Event("AUTH", "start", "navbar"),
    },
    text: t("Toolbar.Inscription", "Inscription"),
  };
};

export default useSubscribeToolItem;
