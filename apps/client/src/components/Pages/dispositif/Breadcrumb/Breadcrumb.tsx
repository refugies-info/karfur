import { ContentType, GetDispositifResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getPath } from "routes";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import ThemeIcon from "~/components/UI/ThemeIcon";
import { useContentLocale, useLocale, useWindowSize } from "~/hooks";
import { buildUrlQuery } from "~/lib/recherche/buildUrlQuery";
import { needSelector } from "~/services/Needs/needs.selectors";
import { themeSelector } from "~/services/Themes/themes.selectors";
import styles from "./Breadcrumb.module.scss";
import { getDepartments } from "./functions";

interface Props {
  dispositif: GetDispositifResponse | null;
}

const Breadcrumb = ({ dispositif }: Props) => {
  const { t } = useTranslation();
  const [showBreadcrumb, setShowBreadcrumb] = useState(false);
  const { isTablet } = useWindowSize();

  const theme = useSelector(themeSelector(dispositif?.theme));
  const need = useSelector(needSelector(dispositif?.needs?.[0] || null));
  const { isRTL } = useContentLocale();
  const locale = useLocale();

  const chevron = useMemo(
    () => (
      <EVAIcon
        name={!isRTL ? "chevron-right-outline" : "chevron-left-outline"}
        size={16}
        fill={styles.lightTextMentionGrey}
        className="mx-1"
      />
    ),
    [isRTL],
  );

  if (!dispositif) return null;
  return (
    <div>
      {isTablet && !showBreadcrumb && (
        <button className={styles.link} onClick={() => setShowBreadcrumb(true)}>
          {t("showBreadcrumb")}
        </button>
      )}
      {(!isTablet || showBreadcrumb) && (
        <div className={styles.container}>
          <Link href={getPath("/", "fr")} className={styles.home} title={t("homepage")}>
            <EVAIcon name="home-outline" fill={styles.lightTextMentionGrey} size={16} />
          </Link>

          {chevron}

          <Link
            href={getPath("/recherche", "fr", `?${buildUrlQuery({ type: dispositif.typeContenu })}`)}
            className={styles.link}
          >
            {dispositif.typeContenu === ContentType.DISPOSITIF ? t("actions") : t("demarches")}
          </Link>

          {chevron}

          {theme && (
            <>
              <Link
                href={getPath("/recherche", "fr", `?${buildUrlQuery({ themes: [theme._id] })}`)}
                className={styles.theme}
                style={{ backgroundColor: theme.colors.color100 }}
              >
                <ThemeIcon theme={theme} size={12} />
                <span className="ms-1">{theme.short.fr}</span>
              </Link>
              {chevron}
            </>
          )}

          {dispositif.needs.length === 1 && need && (
            <>
              <Link
                href={getPath("/recherche", "fr", `?${buildUrlQuery({ needs: [need._id] })}`)}
                className={styles.link}
              >
                {need[locale]?.text || need.fr.text}
              </Link>
              {chevron}
            </>
          )}

          {dispositif.typeContenu === ContentType.DISPOSITIF && (
            <span className={styles.current}>
              {`${dispositif.titreMarque || ""} ${getDepartments(dispositif.metadatas.location, t)}`}
            </span>
          )}
          {dispositif.typeContenu === ContentType.DEMARCHE && (
            <span className={styles.current}>{dispositif.titreInformatif}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Breadcrumb;
