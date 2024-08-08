import { GetDispositifsResponse, Id } from "@refugies-info/api-types";
import useLocale from "hooks/useLocale";
import { cls } from "lib/classname";
import { queryDispositifsWithoutThemes } from "lib/recherche/queryContents";
import { sortThemes } from "lib/sortThemes";
import { Event } from "lib/tracking";
import debounce from "lodash/debounce";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Collapse } from "reactstrap";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import { languei18nSelector } from "services/Langue/langue.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { hasErroredSelector, isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { needsSelector } from "services/Needs/needs.selectors";
import { SearchQuery } from "services/SearchResults/searchResults.reducer";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import { themesSelector } from "services/Themes/themes.selectors";
import { getInitialTheme } from "./functions";
import NeedsList from "./NeedsList";
import ThemeButton from "./ThemeButton";
import styles from "./ThemeMenu.module.scss";

interface Props {
  mobile: boolean;
  isOpen: boolean;
}

const debouncedQuery = debounce(
  (
    query: SearchQuery,
    dispositifs: GetDispositifsResponse[],
    locale: string,
    callback: (res: GetDispositifsResponse[]) => void,
  ) => {
    return queryDispositifsWithoutThemes(query, dispositifs, locale).then((res) => callback(res));
  },
  500,
);

const ThemeMenu = (props: Props) => {
  const locale = useLocale();
  const dispatch = useDispatch();

  const themes = useSelector(themesSelector);
  const sortedThemes = themes.sort(sortThemes);
  const needs = useSelector(needsSelector);
  const query = useSelector(searchQuerySelector);
  const allDispositifs = useSelector(activeDispositifsSelector);
  const initialTheme = getInitialTheme(needs, sortedThemes, query.needs, query.themes, props.mobile);
  const languei18nCode = useSelector(languei18nSelector);

  const [themeSelected, setThemeSelected] = useState<Id | null>(initialTheme);
  const [nbNeedsSelectedByTheme, setNbNeedsSelectedByTheme] = useState<Record<string, number>>({});
  const [nbDispositifsByNeed, setNbDispositifsByNeed] = useState<Record<string, number>>({});
  const [nbDispositifsByTheme, setNbDispositifsByTheme] = useState<Record<string, number>>({});

  const [search, setSearch] = useState(""); // TODO: use this when search restored in component

  const onClickTheme = useCallback(
    (themeId: Id) => {
      setThemeSelected((old) => {
        if (old === themeId && props.mobile) return null;
        return themeId;
      });
      Event("USE_SEARCH", "use theme filter", "click theme");
    },
    [setThemeSelected, props.mobile],
  );

  // fetch dispositifs if not done already
  const isDispositifsLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS));
  const hasDispositifsError = useSelector(hasErroredSelector(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS));
  useEffect(() => {
    if (allDispositifs.length === 0 && !isDispositifsLoading && !hasDispositifsError) {
      dispatch(fetchActiveDispositifsActionsCreator());
    }
  }, [allDispositifs.length, isDispositifsLoading, hasDispositifsError, dispatch]);

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
    if (props.isOpen) {
      debouncedQuery(query, allDispositifs, languei18nCode, (dispositifs) => {
        const newNbDispositifsByNeed: Record<string, number> = {};
        const newNbDispositifsByTheme: Record<string, number> = {};
        for (const dispositif of dispositifs) {
          for (const needId of dispositif.needs || []) {
            newNbDispositifsByNeed[needId.toString()] = (newNbDispositifsByNeed[needId.toString()] || 0) + 1;
          }

          const themeId = dispositif.theme;
          if (!themeId) continue;
          newNbDispositifsByTheme[themeId.toString()] = (newNbDispositifsByTheme[themeId.toString()] || 0) + 1;
          for (const theme of dispositif.secondaryThemes || []) {
            newNbDispositifsByTheme[theme.toString()] = (newNbDispositifsByTheme[theme.toString()] || 0) + 1;
          }
        }

        setNbDispositifsByTheme(newNbDispositifsByTheme);
        setNbDispositifsByNeed(newNbDispositifsByNeed);
      });
    }
  }, [query, allDispositifs, needs, sortedThemes, props.mobile, languei18nCode, props.isOpen]);

  // reset selected theme when popup opens
  useEffect(() => {
    if (props.isOpen) {
      setThemeSelected(getInitialTheme(needs, sortedThemes, query.needs, query.themes, props.mobile));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  const displayedNeeds = useMemo(() => {
    if (search) {
      return needs
        .filter((need) => (need[locale]?.text || "").includes(search))
        .sort((a, b) => (a.theme.position > b.theme.position ? 1 : -1));
    }
    return needs
      .filter((need) => need.theme._id === themeSelected)
      .sort((a, b) => ((a.position || 0) > (b.position || 0) ? 1 : -1));
  }, [themeSelected, needs, search, locale]);

  const isThemeDisabled = (themeId: Id) => {
    const nbDispositifs = nbDispositifsByTheme[themeId.toString()];
    return !nbDispositifs || nbDispositifs === 0;
  };

  return (
    <div className={styles.container}>
      <div className={cls(styles.themes, search && styles.hidden)}>
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
                  search={search}
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
      {(!props.mobile || search) && (
        <NeedsList
          search={search}
          displayedNeeds={displayedNeeds}
          themeSelected={themeSelected}
          nbDispositifsByNeed={nbDispositifsByNeed}
          nbDispositifsByTheme={nbDispositifsByTheme}
        />
      )}
    </div>
  );
};

export default memo(ThemeMenu);
