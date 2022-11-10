import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Button, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { useTranslation } from "next-i18next";
import { cls } from "lib/classname";
import { Event } from "lib/tracking";
import { filterType, SortOptions, sortOptions, TypeOptions } from "data/searchFilters";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./ResultsFilter.module.scss";

interface Props {
  nbDemarches: number;
  nbDispositifs: number;
  nbThemesSelected: number;
  selectedSort: SortOptions;
  setSelectedSort: Dispatch<SetStateAction<SortOptions>>;
  selectedType: TypeOptions;
  setSelectedType: Dispatch<SetStateAction<TypeOptions>>;
  showSort: boolean;
}

const ResultsFilter = (props: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const getCount = (type: string) => {
    switch (type) {
      case "all":
        return `(${props.nbDemarches + props.nbDispositifs})`;
      case "demarche":
        return `(${props.nbDemarches})`;
      case "dispositif":
        return `(${props.nbDispositifs})`;
      default:
        return "";
    }
  };

  const noResult = props.nbDemarches + props.nbDispositifs === 0;

  const { nbThemesSelected, setSelectedSort, selectedSort, setSelectedType } = props;
  useEffect(() => {
    // if we select 1 theme, and sort option was "theme", change it
    if (nbThemesSelected === 1 && selectedSort === "theme") {
      setSelectedSort("date");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nbThemesSelected]);

  const selectType = useCallback(
    (key: TypeOptions) => {
      setSelectedType(key);
      Event("USE_SEARCH", "use type filter", "click type");
    },
    [setSelectedType]
  );

  const toggleSort = useCallback(() => {
    setOpen((o) => {
      if (!o) Event("USE_SEARCH", "open filter", "sort");
      return !o;
    });
  }, [setOpen]);

  const selectSort = useCallback(
    (key: SortOptions) => {
      setSelectedSort(key);
      Event("USE_SEARCH", "click filter", "sort");
    },
    [setSelectedSort]
  );

  return (
    <div className={cls(styles.container, noResult && styles.no_result)}>
      <Container className={styles.container_inner}>
        <div className={styles.types}>
          {filterType.map((option, i) => (
            <Button
              key={i}
              className={cls(styles.btn, props.selectedType === option.key && styles.selected)}
              onClick={() => selectType(option.key)}
            >
              {t(option.value)} {getCount(option.key)}
            </Button>
          ))}
        </div>

        {props.showSort && (
          <Dropdown isOpen={open} toggle={toggleSort}>
            <DropdownToggle className={styles.dropdown}>
              <EVAIcon name="swap-outline" fill="black" size={20} className={styles.icon} />
              {t(sortOptions.find((opt) => opt.key === props.selectedSort)?.value || "")}
            </DropdownToggle>
            <DropdownMenu className={styles.menu}>
              {sortOptions
                .filter((option) => {
                  // do not show theme option if 1 theme only is selected
                  if (props.nbThemesSelected === 1) return option.key !== "theme";
                  return true;
                })
                .map((option, i) => {
                  const isSelected = props.selectedSort === option.key;
                  return (
                    <DropdownItem
                      key={i}
                      onClick={() => selectSort(option.key)}
                      className={cls(styles.item, isSelected && styles.selected)}
                    >
                      {t(option.value)}
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
