import { ContentType, GetDispositifResponse } from "api-types";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Link from "next/link";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { getPath } from "routes";
import { needSelector } from "services/Needs/needs.selectors";
import { themeSelector } from "services/Themes/themes.selectors";
import { getDepartments } from "./functions";
import styles from "./Breadcrumb.module.scss";
import ThemeIcon from "components/UI/ThemeIcon";
import { useRTL } from "hooks";

interface Props {
  dispositif: GetDispositifResponse | null;
}

const Breadcrumb = ({ dispositif }: Props) => {
  const theme = useSelector(themeSelector(dispositif?.theme));
  const need = useSelector(needSelector(dispositif?.needs?.[0] || null));
  const isRTL = useRTL();
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
    <div className={styles.container}>
      <Link href={getPath("/", "fr")} className={styles.home}>
        <EVAIcon name="home-outline" fill={styles.lightTextMentionGrey} size={16} />
      </Link>

      {chevron}

      <Link href={getPath("/recherche", "fr", `?type=${dispositif.typeContenu}`)} className={styles.link}>
        {dispositif.typeContenu === ContentType.DISPOSITIF ? "Dispositifs" : "Démarches"}
      </Link>

      {chevron}

      {theme && (
        <>
          <Link
            href={getPath("/recherche", "fr", `?themes=${theme._id}`)}
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
          <Link href={getPath("/recherche", "fr", `?needs=${need._id}`)} className={styles.link}>
            {need.fr.text}
          </Link>
          {chevron}
        </>
      )}

      <span className={styles.current}>
        {`${dispositif.titreMarque || ""} ${getDepartments(dispositif.metadatas.location)}`}
      </span>
    </div>
  );
};

export default Breadcrumb;
