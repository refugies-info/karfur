import React from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import { getPath } from "routes";
import { useLocale } from "hooks";
import { cls } from "lib/classname";
import { buildUrlQuery } from "lib/recherche/buildUrlQuery";
import { Event } from "lib/tracking";
import { secondaryThemesSelector, themeSelector, themesSelector } from "services/Themes/themes.selectors";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { dispositifNeedsSelector } from "services/Needs/needs.selectors";
import SearchThemeButton from "components/UI/SearchThemeButton";
import styles from "./LinkedThemes.module.scss";

interface LinkNeedProps {
  $color100: string;
  $color40: string;
  $color30: string;
}
const LinkNeed = styled(Link)<LinkNeedProps>`
  color: ${(props) => props.$color100} !important;
  background-color: ${(props) => props.$color30} !important;
  border-color: ${(props) => props.$color40} !important;

  &:hover {
    border-color: ${(props) => props.$color100} !important;
  }
`;

const LinkedThemes = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const themes = useSelector(themesSelector);
  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dispositif?.secondaryThemes));
  const needs = useSelector(dispositifNeedsSelector(dispositif?.needs));

  return (
    <div className={styles.container}>
      <p className={styles.title}>{t("Dispositif.linkedThemes")}</p>
      <div className={styles.row}>
        {theme && (
          <SearchThemeButton
            theme={theme}
            href={getPath("/recherche", "fr", `?${buildUrlQuery({ themes: [theme._id] })}`)}
            small
            className={styles.btn}
            onClick={() => Event("DISPO_VIEW", "click theme", "Linked themes")}
          />
        )}
        {secondaryThemes.map((theme, i) => (
          <SearchThemeButton
            key={i}
            theme={theme}
            href={getPath("/recherche", "fr", `?${buildUrlQuery({ themes: [theme._id] })}`)}
            small
            className={styles.btn}
            onClick={() => Event("DISPO_VIEW", "click theme", "Linked themes")}
          />
        ))}
        {needs.map((need, i) => {
          const theme = themes.find((t) => t._id === need.theme._id);
          return (
            <LinkNeed
              key={i}
              href={getPath("/recherche", "fr", `?${buildUrlQuery({ needs: [need._id] })}`)}
              className={cls(styles.btn, styles.need)}
              $color100={theme?.colors.color100 || "black"}
              $color40={theme?.colors.color40 || "#DDD"}
              $color30={theme?.colors.color30 || "#EEE"}
              onClick={() => Event("DISPO_VIEW", "click need", "Linked themes")}
            >
              {need[locale]?.text || need.fr.text}
              <Image src={need.image?.secure_url || ""} width={32} height={32} alt="" className="ms-3" />
            </LinkNeed>
          );
        })}
      </div>
    </div>
  );
};

export default LinkedThemes;
