import { Notice } from "@codegouvfr/react-dsfr/Notice";
import type { Id } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLanguages, useLocale } from "~/hooks";
import { cn } from "~/lib/classname";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { themeSelector } from "~/services/Themes/themes.selectors";
import PageContext from "~/utils/pageContext";
import styles from "./Banner.module.scss";

interface Props {
  themeId: Id | undefined;
}

/**
 * Top level banner with theme image or default one. Includes edit button and status if logged in
 */
const Banner = (props: Props) => {
  const { t } = useTranslation();
  const theme = useSelector(themeSelector(props.themeId));
  const dispositif = useSelector(selectedDispositifSelector);
  const pageContext = useContext(PageContext);

  // ln not available
  const { currentLocale } = useLanguages();
  const locale = useLocale();
  const isNotTranslated = useMemo(() => {
    return !(dispositif?.availableLanguages || ["fr"]).includes(locale || "fr");
  }, [locale, dispositif]);

  return (
    <div
      className={cn(
        "h-[400px] max-lg:h-[240px] print:hidden",
        styles.banner,
        pageContext.mode === "translate" && styles.translate,
      )}
      style={
        theme?.banner?.secure_url ? { backgroundImage: `url(${theme?.banner.secure_url})` } : {}
      }
    >
      <div>
        {isNotTranslated && (
          <Notice
            isClosable
            title={t("Dispositif.infoContentNotTranslated", {
              language: currentLocale?.langueFr?.toLowerCase() || "",
            })}
          />
        )}
      </div>
    </div>
  );
};

export default Banner;
