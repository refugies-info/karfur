import { GetNeedResponse, GetThemeResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import React, { useContext, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import { ThemeMenuContext } from "~/components/Pages/recherche/ThemeMenu/ThemeMenuContext";
import { useLocale } from "~/hooks";
import { sortThemes } from "~/lib/sortThemes";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { themesSelector } from "~/services/Themes/themes.selectors";
import ResultsSection from "./ResultsSection";
import styles from "./SearchResults.module.css";

interface SectionData {
  theme: GetThemeResponse;
  needs: GetNeedResponse[];
}

const SearchResults: React.FC = () => {
  const { search } = useContext(ThemeMenuContext);
  const allNeeds = useSelector(needsSelector);
  const locale = useLocale();
  const themes = useSelector(themesSelector);
  const announce = useAnnounce();
  const { t } = useTranslation();

  const sectionData = useMemo(() => {
    const selectedNeeds = allNeeds.filter((need) => need[locale].text.toLowerCase().includes(search.toLowerCase()));
    const sortedThemes = themes.sort(sortThemes);
    return sortedThemes.reduce<SectionData[]>((acc, theme) => {
      return [...acc, { theme, needs: selectedNeeds.filter((need) => need.theme._id === theme._id) }];
    }, []);
  }, [themes, allNeeds, locale, search]);

  const needsCount = sectionData.reduce((acc, { needs }) => acc + needs.length, 0);

  useEffect(() => {
    announce(t("Recherche.themeSearchResults", { count: needsCount, search }), { priority: "interrupt", delay: 1000 });
  }, [needsCount, announce, search, t]);

  return (
    <div className={styles.container}>
      {sectionData
        .filter(({ needs }) => needs.length > 0)
        .map(({ theme, needs }, i) => {
          return <ResultsSection key={i} theme={theme} needs={needs} />;
        })}
    </div>
  );
};

export default SearchResults;
