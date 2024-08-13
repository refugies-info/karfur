import Separator from "components/UI/Separator";
import { useLocale } from "hooks";
import React, { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { needsSelector } from "services/Needs/needs.selectors";
import Need from "./Need";
import styles from "./Needs.module.css";
import { ThemeMenuContext } from "./ThemeMenuContext";

const Needs: React.FC = () => {
  const locale = useLocale();
  const { search, selectedThemeId } = useContext(ThemeMenuContext);
  const needs = useSelector(needsSelector);

  const displayedNeeds = useMemo(() => {
    if (search) {
      return needs
        .filter((need) => (need[locale]?.text || "").includes(search))
        .sort((a, b) => (a.theme.position > b.theme.position ? 1 : -1));
    }
    return needs
      .filter((need) => need.theme._id === selectedThemeId)
      .sort((a, b) => ((a.position || 0) > (b.position || 0) ? 1 : -1));
  }, [selectedThemeId, needs, search, locale]);

  return (
    <div className={styles.container}>
      <Need label="Tous" />
      <Separator />
      <div className={styles.needs}>
        {displayedNeeds.map((need, i) => {
          return <Need key={i} label={need[locale]?.text || ""} />;
        })}
      </div>
    </div>
  );
};

export default Needs;
