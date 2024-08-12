import { useLocale } from "hooks";
import { cls } from "lib/classname";
import { sortThemes } from "lib/sortThemes";
import React, { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { themesSelector } from "services/Themes/themes.selectors";
import { ThemeMenuContext } from "./ThemeMenuContext";
import styles from "./Themes.module.css";

const Themes: React.FC = () => {
  const { selectedThemeId } = useContext(ThemeMenuContext);
  const themes = useSelector(themesSelector);
  const sortedThemes = useMemo(() => themes.sort(sortThemes), [themes]);
  const locale = useLocale();

  return (
    <div className={styles.container}>
      {sortedThemes.map(({ _id, colors, short }, i) => (
        <span
          key={i}
          className={cls(styles.item, selectedThemeId === _id && styles.selectedItem)}
          style={
            selectedThemeId === _id
              ? {
                  backgroundColor: colors.color100,
                }
              : undefined
          }
        >
          {short[locale] ?? ""}
        </span>
      ))}
    </div>
  );
};

export default Themes;
