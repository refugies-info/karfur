import React, { useEffect, useMemo, useState, memo, useCallback } from "react";
import { Collapse } from "reactstrap";
import { ObjectId } from "mongodb";
import { useSelector } from "react-redux";
import { themesSelector } from "services/Themes/themes.selectors";
import { needsSelector } from "services/Needs/needs.selectors";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import { cls } from "lib/classname";
import { sortThemes } from "lib/sortThemes";
import { Event } from "lib/tracking";
import { queryDispositifsWithoutThemes } from "lib/recherche/queryContents";
import useLocale from "hooks/useLocale";
import NeedsList from "./NeedsList";
import { getInitialTheme } from "./functions";
import styles from "./ThemeDropdown.module.scss";
import ThemeButton from "./ThemeButton";

interface Props {
  search: string;
  mobile: boolean;
}

const ThemeDropdown = (props: Props) => {
  const locale = useLocale();

  const themes = useSelector(themesSelector);
  const sortedThemes = themes.sort(sortThemes);
  const needs = useSelector(needsSelector);
  const query = useSelector(searchQuerySelector);
  const allDispositifs = useSelector(activeDispositifsSelector);
  const initialTheme = getInitialTheme(needs, sortedThemes, query.needs, query.themes, props.mobile);

  const [themeSelected, setThemeSelected] = useState<ObjectId | null>(initialTheme);
  const [nbNeedsSelectedByTheme, setNbNeedsSelectedByTheme] = useState<Record<string, number>>({});
  const [nbDispositifsByNeed, setNbDispositifsByNeed] = useState<Record<string, number>>({});
  const [nbDispositifsByTheme, setNbDispositifsByTheme] = useState<Record<string, number>>({});

  const onClickTheme = useCallback(
    (themeId: ObjectId) => {
      setThemeSelected((old) => {
        if (old === themeId) return null;
        return themeId;
      });
      Event("USE_SEARCH", "use theme filter", "click theme");
    },
    [setThemeSelected]
  );

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

  // count dispositifs by need and theme
  useEffect(() => {
    const newNbDispositifsByNeed: Record<string, number> = {};
    const newNbDispositifsByTheme: Record<string, number> = {};

    queryDispositifsWithoutThemes(query, allDispositifs, "fr").then((dispositifs) => {
      for (const dispositif of dispositifs) {
        for (const needId of dispositif.needs || []) {
          newNbDispositifsByNeed[needId.toString()] = (newNbDispositifsByNeed[needId.toString()] || 0) + 1;
        }

        const themeId = dispositif.theme.toString();
        newNbDispositifsByTheme[themeId] = (newNbDispositifsByTheme[themeId] || 0) + 1;
        for (const theme of dispositif.secondaryThemes || []) {
          newNbDispositifsByTheme[theme.toString()] = (newNbDispositifsByTheme[theme.toString()] || 0) + 1;
        }
      }

      setNbDispositifsByTheme(newNbDispositifsByTheme);
      setNbDispositifsByNeed(newNbDispositifsByNeed);
    });
  }, [query, allDispositifs]);

  const displayedNeeds = useMemo(() => {
    if (props.search) {
      return needs
        .filter((need) => (need[locale]?.text || "").includes(props.search))
        .sort((a, b) => (a.theme.position > b.theme.position ? 1 : -1));
    }
    return needs
      .filter((need) => need.theme._id === themeSelected)
      .sort((a, b) => ((a.position || 0) > (b.position || 0) ? 1 : -1));
  }, [themeSelected, needs, props.search, locale]);

  const isThemeDisabled = (themeId: ObjectId) => {
    const nbDispositifs = nbDispositifsByTheme[themeId.toString()];
    return !nbDispositifs || nbDispositifs === 0;
  };

  return (
    <div className={styles.container}>
      <div className={cls(styles.themes, props.search && styles.hidden)}>
        {sortedThemes.map((theme, i) => (
          <div key={i}>
            <ThemeButton
              theme={theme}
              selected={themeSelected === theme._id}
              disabled={isThemeDisabled(theme._id)}
              mobile={props.mobile}
              nbNeeds={nbNeedsSelectedByTheme[theme._id.toString()]}
              onClick={() => onClickTheme(theme._id)}
            />

            {props.mobile && (
              <Collapse isOpen={themeSelected === theme._id}>
                <NeedsList
                  search={props.search}
                  displayedNeeds={displayedNeeds}
                  themeSelected={themeSelected}
                  nbDispositifsByNeed={nbDispositifsByNeed}
                  nbDispositifsByTheme={nbDispositifsByTheme}
                />
              </Collapse>
            )}
          </div>
        ))}
      </div>
      {(!props.mobile || props.search) && (
        <NeedsList
          search={props.search}
          displayedNeeds={displayedNeeds}
          themeSelected={themeSelected}
          nbDispositifsByNeed={nbDispositifsByNeed}
          nbDispositifsByTheme={nbDispositifsByTheme}
        />
      )}
    </div>
  );
};

export default memo(ThemeDropdown);
