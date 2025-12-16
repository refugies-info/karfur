import * as Accordion from "@radix-ui/react-accordion";
import { useWindowSize } from "@refugies-info/ui";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ThemeItemMobile from "~/components/Pages/recherche/ThemeMenu/ThemeItem.mobile";
import { useLocale } from "~/hooks";
import { sortThemes } from "~/lib/sortThemes";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import { allThemesSelector } from "~/services/Themes/themes.selectors";
import ThemeItem from "./ThemeItem";
import { ThemeMenuContext } from "./ThemeMenuContext";
import styles from "./Themes.module.css";

const Themes = React.forwardRef<HTMLDivElement | null, {}>((props, ref) => {
  const { selectedThemeId } = useContext(ThemeMenuContext);
  const themes = useSelector(allThemesSelector);
  const sortedThemes = useMemo(() => themes.sort(sortThemes), [themes]);
  const [nbNeedsSelectedByTheme, setNbNeedsSelectedByTheme] = useState<Record<string, number>>({});
  const locale = useLocale();
  const { t } = useTranslation();

  const query = useSelector(searchQuerySelector);
  const needs = useSelector(needsSelector);

  const { isMobile } = useWindowSize();

  // count needs selected by theme
  useEffect(() => {
    const nbNeedsSelectedByTheme: Record<string, number> = {};
    for (const needId of query.needs) {
      const needThemeId = needs.find((n) => n._id === needId)?.theme._id.toString();
      if (needThemeId) {
        nbNeedsSelectedByTheme[needThemeId] = (nbNeedsSelectedByTheme[needThemeId] || 0) + 1;
      }
    }
    for (const themeId of query.themes) {
      const theme = themes.find((t) => t._id === themeId);
      if (theme) {
        nbNeedsSelectedByTheme[themeId.toString()] = needs.filter(
          (need) => need.theme._id === themeId,
        ).length;
      }
    }
    setNbNeedsSelectedByTheme(nbNeedsSelectedByTheme);
  }, [query.needs, query.themes, themes, needs]);

  return (
    <div ref={ref} className={isMobile ? styles.ref : undefined}>
      {isMobile ? (
        <Accordion.Root className={styles.accordion} type="single" collapsible>
          {sortedThemes.map(({ _id, mainColor, short }, i) => {
            const count = nbNeedsSelectedByTheme[_id.toString()];
            return (
              <ThemeItemMobile
                className={styles.accordionItem}
                color={mainColor}
                key={i}
                themeId={_id.toString()}
                label={short[locale] ?? ""}
                needCount={count}
              />
            );
          })}
        </Accordion.Root>
      ) : (
        <div
          className={styles.container}
          role="tablist"
          aria-orientation="vertical"
          aria-label={t("Recherche.themeTabs")}
        >
          {sortedThemes.map(({ _id, mainColor, short }, i) => {
            const count = nbNeedsSelectedByTheme[_id.toString()];
            const selected = selectedThemeId === _id;
            const isFirst = i === 0;
            return (
              <ThemeItem
                key={i}
                color={mainColor}
                id={_id.toString()}
                label={short[locale] ?? ""}
                needCount={count}
                selected={selected}
                isFirst={isFirst}
              />
            );
          })}
        </div>
      )}
    </div>
  );
});

Themes.displayName = "Themes";
export default Themes;
