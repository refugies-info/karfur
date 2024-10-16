import * as Accordion from "@radix-ui/react-accordion";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ThemeItemMobile from "~/components/Pages/recherche/ThemeMenu/ThemeItem.mobile";
import { useLocale, useWindowSize } from "~/hooks";
import { sortThemes } from "~/lib/sortThemes";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import { themesSelector } from "~/services/Themes/themes.selectors";
import ThemeItem from "./ThemeItem";
import { ThemeMenuContext } from "./ThemeMenuContext";
import styles from "./Themes.module.css";

const Themes: React.FC = () => {
  const { selectedThemeId } = useContext(ThemeMenuContext);
  const themes = useSelector(themesSelector);
  const sortedThemes = useMemo(() => themes.sort(sortThemes), [themes]);
  const [nbNeedsSelectedByTheme, setNbNeedsSelectedByTheme] = useState<Record<string, number>>({});
  const locale = useLocale();

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
        nbNeedsSelectedByTheme[themeId.toString()] = needs.filter((need) => need.theme._id === themeId).length;
      }
    }
    setNbNeedsSelectedByTheme(nbNeedsSelectedByTheme);
  }, [query.needs, query.themes, themes, needs]);

  return (
    <>
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
        <div className={styles.container}>
          {sortedThemes.map(({ _id, mainColor, short }, i) => {
            const count = nbNeedsSelectedByTheme[_id.toString()];
            const selected = selectedThemeId === _id;
            return (
              <ThemeItem
                key={i}
                color={mainColor}
                id={_id.toString()}
                label={short[locale] ?? ""}
                needCount={count}
                selected={selected}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default Themes;
