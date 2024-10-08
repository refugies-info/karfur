import React, { useContext, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocale } from "~/hooks";
import { needsSelector } from "~/services/Needs/needs.selectors";
import AllNeedsItem from "./AllNeedsItem";
import NeedItem from "./NeedItem";
import styles from "./Needs.module.css";
import { ThemeMenuContext } from "./ThemeMenuContext";

const Needs: React.FC = () => {
  const locale = useLocale();
  const { search, selectedThemeId, nbDispositifsByTheme } = useContext(ThemeMenuContext);
  const needs = useSelector(needsSelector);
  const { t } = useTranslation();
  const needsContainerRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const firstFocusable = needsContainerRef.current?.querySelector(
      "[tabindex], a, button, input, radio, select, textarea",
    ) as HTMLElement;
    firstFocusable?.focus();
  }, [selectedThemeId]);

  return (
    <div className={styles.container}>
      <AllNeedsItem />
      <div className={styles.needs} ref={needsContainerRef}>
        {displayedNeeds.map((need, i) => {
          return <NeedItem key={i} need={need} />;
        })}
      </div>
    </div>
  );
};

export default Needs;
