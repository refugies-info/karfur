import { fr } from "@codegouvfr/react-dsfr";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { filterType, SortOptions, sortOptions, TypeOptions } from "data/searchFilters";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { cls } from "~/lib/classname";
import { Event } from "~/lib/tracking";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import {
  searchQuerySelector,
  searchResultsSelector,
  themesDisplayedSelector,
} from "~/services/SearchResults/searchResults.selector";
import styles from "./ResultsFilter.module.css";

const ResultsFilter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const themesDisplayed = useSelector(themesDisplayedSelector);
  const filteredResult = useSelector(searchResultsSelector);
  const [open, setOpen] = useState(false);

  const nbDemarches = filteredResult.demarches.length;
  const nbDispositifs = filteredResult.dispositifs.length + filteredResult.dispositifsSecondaryTheme.length;

  const getCount = (type: string) => {
    switch (type) {
      case "all":
        return `(${nbDemarches + nbDispositifs})`;
      case "demarche":
        return `(${nbDemarches})`;
      case "dispositif":
        return `(${nbDispositifs})`;
      default:
        return "";
    }
  };

  const noResult = nbDemarches + nbDispositifs === 0;

  useEffect(() => {
    // if we select 1 theme, and sort option was "theme", change it
    if (themesDisplayed.length === 1 && query.sort === "theme") {
      dispatch(addToQueryActionCreator({ sort: "date" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themesDisplayed.length]);

  const selectType = useCallback(
    (key: TypeOptions) => {
      dispatch(addToQueryActionCreator({ type: key }));
      Event("USE_SEARCH", "use type filter", "click type");
    },
    [dispatch],
  );

  const toggleSort = useCallback(() => {
    setOpen((o) => {
      if (!o) Event("USE_SEARCH", "open filter", "sort");
      return !o;
    });
  }, []);

  const selectSort = useCallback(
    (key: SortOptions) => {
      dispatch(addToQueryActionCreator({ sort: key }));
      Event("USE_SEARCH", "click filter", "sort");
    },
    [dispatch],
  );

  return (
    <div className={cls(styles.container, noResult && styles.no_result)}>
      <div className={styles.tabs}>
        <div className={styles.tabs_inner}>
          {filterType.map((option, i) => (
            <button
              key={i}
              className={cls(styles.tab_button, query.type === option.key && styles.tab_button_selected)}
              onClick={() => selectType(option.key)}
            >
              <>
                <span
                  className={cls(
                    styles.tab_button_label,
                    query.type === option.key && styles.tab_button_label_selected,
                  )}
                >
                  {/* @ts-ignore */}
                  {t(option.value)} {getCount(option.key)}
                </span>
              </>
            </button>
          ))}
        </div>
      </div>

      <DropdownMenu.Root open={open} modal={true} onOpenChange={toggleSort}>
        <DropdownMenu.Trigger className={styles.sort_container} asChild>
          <button>
            <span className={styles.sort_label}>
              {/* @ts-ignore */}
              {t(sortOptions.find((opt) => opt.key === query.sort)?.value || "")}
            </span>
            <i className={fr.cx("ri-expand-up-down-line", "fr-icon--sm")}></i>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className={styles.sort_menu_content}>
            {sortOptions
              .filter((option) => {
                // do not show theme option if 1 theme only is selected
                if (themesDisplayed.length === 1 && option.key === "theme") return false;
                // do not show location if no department
                if (query.departments.length === 0 && option.key === "location") return false;
                return true;
              })
              .map((option, i) => {
                const isSelected = query.sort === option.key;
                return (
                  <DropdownMenu.Item key={i} asChild>
                    <button onClick={() => selectSort(option.key)} className={cls(styles.sort_menu_item)}>
                      {/* @ts-ignore */}
                      <>{t(option.value)}</>
                      {isSelected && <EVAIcon name="checkmark-outline" fill="blue" size={20} />}
                    </button>
                  </DropdownMenu.Item>
                );
              })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default ResultsFilter;
