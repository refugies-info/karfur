import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { GetNeedResponse, GetThemeResponse } from "@refugies-info/api-types";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import NeedItem from "~/components/Pages/recherche/ThemeMenu/NeedItem";
import { useLocale } from "~/hooks";
import { cls } from "~/lib/classname";
import { sortThemes } from "~/lib/sortThemes";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { themesSelector } from "~/services/Themes/themes.selectors";
import styles from "./MobileMenu.module.css";

interface SectionData {
  theme: GetThemeResponse;
  needs: GetNeedResponse[];
}

const MobileMenu: React.FC = () => {
  const allNeeds = useSelector(needsSelector);
  const locale = useLocale();
  const themes = useSelector(themesSelector);

  const sectionData = useMemo(() => {
    const sortedThemes = themes.sort(sortThemes);
    return sortedThemes.reduce<SectionData[]>((acc, theme) => {
      return [...acc, { theme, needs: allNeeds.filter((need) => need.theme._id === theme._id) }];
    }, []);
  }, [themes, allNeeds, locale]);

  return (
    <div className={styles.container}>
      {sectionData
        .filter(({ needs }) => needs.length > 0)
        .map(({ theme, needs }, i) => {
          return (
            <div className={cls(fr.cx("fr-accordions-group"), styles.accordionsGroup)}>
              <Accordion label={theme.short[locale]}>
                {needs.map((need, i) => (
                  <NeedItem key={i} need={need} />
                ))}
              </Accordion>
            </div>
          );
        })}
    </div>
  );
};

export default MobileMenu;
