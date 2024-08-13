import { useLocale } from "hooks";
import { sortThemes } from "lib/sortThemes";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { needsSelector } from "services/Needs/needs.selectors";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import { themesSelector } from "services/Themes/themes.selectors";
import { ThemeMenuContext } from "./ThemeMenuContext";
import styles from "./Themes.module.css";

const Themes: React.FC = () => {
  const { selectedThemeId, setSelectedThemeId } = useContext(ThemeMenuContext);
  const themes = useSelector(themesSelector);
  const sortedThemes = useMemo(() => themes.sort(sortThemes), [themes]);
  const [nbNeedsSelectedByTheme, setNbNeedsSelectedByTheme] = useState<Record<string, number>>({});
  const locale = useLocale();

  const query = useSelector(searchQuerySelector);
  const needs = useSelector(needsSelector);

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
    <div className={styles.container}>
      {sortedThemes.map(({ _id, colors, short }, i) => {
        const nbNeeds = nbNeedsSelectedByTheme[_id.toString()];
        const selected = selectedThemeId === _id;
        return (
          <button
            key={i}
            className={styles.item}
            style={
              selected
                ? {
                    backgroundColor: colors.color100,
                  }
                : undefined
            }
            onClick={() => setSelectedThemeId(_id)}
          >
            {short[locale] ?? ""}
            {nbNeeds && nbNeeds > 0 && (
              <span
                style={{
                  backgroundColor: !selected ? colors.color100 : "white",
                  color: !selected ? "white" : colors.color100,
                }}
                className={styles.theme_badge}
              >
                {nbNeeds || 0}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Themes;
