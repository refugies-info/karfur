import React, { useCallback, useEffect, useState } from "react";
import { Button, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { cls } from "lib/classname";
import { Event } from "lib/tracking";
import { filterType, SortOptions, sortOptions, TypeOptions } from "data/searchFilters";
import {
  searchQuerySelector,
  searchResultsSelector,
  themesDisplayedSelector,
} from "services/SearchResults/searchResults.selector";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./ResultsFilter.module.scss";

interface Props {}

const ResultsFilter = (props: Props) => {
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
      <Container className={styles.container_inner}>
        <div className={styles.types}>
          {filterType.map((option, i) => (
            <Button
              key={i}
              className={cls(styles.btn, query.type === option.key && styles.selected)}
              onClick={() => selectType(option.key)}
            >
              <>
                {/* @ts-ignore */}
                {t(option.value)} {getCount(option.key)}
              </>
            </Button>
          ))}
        </div>

        {!query.search && (
          <Dropdown isOpen={open} toggle={toggleSort}>
            <DropdownToggle className={styles.dropdown}>
              <EVAIcon name="swap-outline" fill="black" size={20} className={styles.icon} />
              {/* @ts-ignore */}
              <>{t(sortOptions.find((opt) => opt.key === query.sort)?.value || "")}</>
            </DropdownToggle>
            <DropdownMenu className={styles.menu}>
              {sortOptions
                .filter((option) => {
                  // do not show theme option if 1 theme only is selected
                  if (themesDisplayed.length === 1) return option.key !== "theme";
                  return true;
                })
                .map((option, i) => {
                  const isSelected = query.sort === option.key;
                  return (
                    <DropdownItem
                      key={i}
                      onClick={() => selectSort(option.key)}
                      className={cls(styles.item, isSelected && styles.selected)}
                    >
                      {/* @ts-ignore */}
                      <>{t(option.value)}</>
                      {isSelected && <EVAIcon name="checkmark-outline" fill="white" size={20} />}
                    </DropdownItem>
                  );
                })}
            </DropdownMenu>
          </Dropdown>
        )}
      </Container>
    </div>
  );
};

export default ResultsFilter;
