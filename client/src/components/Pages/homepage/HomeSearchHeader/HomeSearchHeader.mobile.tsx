import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { Button, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import {
  inputFocusedSelector,
  searchQuerySelector,
  themesDisplayedValueSelector
} from "services/SearchResults/searchResults.selector";
import { setInputFocusedActionCreator } from "services/SearchResults/searchResults.actions";
import { cls } from "lib/classname";
import SearchInput from "components/Pages/recherche/SearchInput";
import DropdownMenuMobile from "components/Pages/recherche/DropdownMenuMobile";
import LocationDropdown from "components/Pages/recherche/LocationDropdown";
import ThemeDropdown from "components/Pages/recherche/ThemeDropdown";
import { getPath } from "routes";
import { useRouter } from "next/router";
import qs from "query-string";
import styles from "./HomeSearchHeader.mobile.module.scss";
import commonStyles from "scss/components/searchHeader.module.scss";

interface Props {
  // filterProps
  locationSearch: string;
  resetLocationSearch: () => void;
  themeSearch: string;
  resetDepartment: () => void;
  resetTheme: () => void;
  resetSearch: () => void;
  onChangeDepartmentInput: (e: any) => void;
  onChangeThemeInput: (e: any) => void;
  onChangeSearchInput: (e: any) => void;
}

const HomeSearchHeaderMobile = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    locationSearch,
    resetLocationSearch,
    themeSearch,
    resetDepartment,
    onChangeDepartmentInput,
    resetTheme,
    onChangeThemeInput,
    resetSearch,
    onChangeSearchInput
  } = props;

  const query = useSelector(searchQuerySelector);
  const inputFocused = useSelector(inputFocusedSelector);

  // SEARCH
  const setSearchActive = useCallback(
    (active: boolean) => dispatch(setInputFocusedActionCreator("search", active)),
    [dispatch]
  );

  // LOCATION
  const [locationOpen, setLocationOpen] = useState(false);
  const toggleLocation = useCallback(() => setLocationOpen((o) => !o), []);

  // THEME
  const [themesOpen, setThemesOpen] = useState(false);
  const themeDisplayedValue = useSelector(themesDisplayedValueSelector);
  const toggleThemes = useCallback(() => setThemesOpen((o) => !o), []);

  // hide axeptio button when popup opens
  useEffect(() => {
    if (locationOpen || themesOpen) {
      if (window.hideAxeptioButton) window.hideAxeptioButton();
    } else {
      if (window.showAxeptioButton) window.showAxeptioButton();
    }
  }, [locationOpen, themesOpen]);

  return (
    <>
      <div className={styles.container}>
        <Dropdown
          isOpen={locationOpen}
          toggle={toggleLocation}
          className={cls(styles.dropdown, commonStyles.separator)}
        >
          <DropdownToggle>
            <SearchInput
              label={t("Dispositif.Département", "Département")}
              icon={query.departments.length > 0 ? "pin" : "pin-outline"}
              active={locationOpen}
              setActive={() => {}}
              onChange={onChangeDepartmentInput}
              inputValue={locationSearch}
              loading={false}
              value={query.departments.join(", ")}
              placeholder={t("Dispositif.Département", "Département")}
              smallIcon={true}
              noInput={true}
              noEmptyBtn={true}
              onHomepage={true}
            />
          </DropdownToggle>
          <DropdownMenu className={commonStyles.menu}>
            <DropdownMenuMobile
              title={t("Dispositif.Départements", "Départements")}
              icon="pin-outline"
              close={toggleLocation}
              reset={resetDepartment}
              showFooter={query.departments.length > 0}
            >
              <div className={commonStyles.content}>
                <div className={commonStyles.input}>
                  <EVAIcon name="search-outline" fill="dark" size={20} />
                  <input
                    type="text"
                    placeholder={t("Dispositif.Département", "Département")}
                    onChange={onChangeDepartmentInput}
                    value={locationSearch}
                    autoFocus
                  />
                </div>
              </div>
              <LocationDropdown
                locationSearch={locationSearch}
                resetLocationSearch={resetLocationSearch}
                mobile={true}
              />
            </DropdownMenuMobile>
          </DropdownMenu>
        </Dropdown>

        <Dropdown isOpen={themesOpen} toggle={toggleThemes} className={styles.dropdown}>
          <DropdownToggle>
            <SearchInput
              label={t("Recherche.themes", "Thèmes")}
              icon="list-outline"
              active={themesOpen}
              setActive={() => {}}
              onChange={onChangeThemeInput}
              inputValue={themeSearch}
              value={themeDisplayedValue}
              placeholder={t("Recherche.themes", "Thèmes")}
              smallIcon={true}
              noInput={true}
              noEmptyBtn={true}
              onHomepage={true}
            />
          </DropdownToggle>
          <DropdownMenu className={commonStyles.menu} persist>
            <DropdownMenuMobile
              title={t("Recherche.themes", "Thèmes")}
              icon="list-outline"
              close={toggleThemes}
              reset={resetTheme}
              showFooter={query.themes.length > 0 || query.needs.length > 0}
            >
              <div className={commonStyles.content}>
                <div className={commonStyles.input}>
                  <EVAIcon name="search-outline" fill="dark" size={20} />
                  <input
                    type="text"
                    placeholder={t("Recherche.themesPlaceholder", "Rechercher dans les thèmes")}
                    onChange={onChangeThemeInput}
                    value={themeSearch}
                  />
                </div>
              </div>
              <ThemeDropdown search={themeSearch} mobile={true} isOpen={themesOpen} />
            </DropdownMenuMobile>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className={styles.container}>
        <Button onClick={() => setSearchActive(true)} className={styles.btn}>
          <SearchInput
            label={t("Recherche.keyword", "Mot-clé")}
            icon="search-outline"
            active={inputFocused.search}
            setActive={setSearchActive}
            onChange={onChangeSearchInput}
            inputValue={query.search}
            value={query.search}
            placeholder={t("Recherche.keywordPlaceholder", "Mission locale, titre de séjour...")}
            resetFilter={resetSearch}
            focusout={true}
            onHomepage={true}
          />
        </Button>
      </div>

      <Button
        onClick={() => {
          router.push({
            pathname: getPath("/recherche", router.locale),
            query: qs.stringify({ ...query }, { arrayFormat: "comma" })
          });
        }}
        className={commonStyles.submit}
        disabled={
          !query.search && query.departments.length === 0 && query.themes.length === 0 && query.needs.length === 0
        }
      >
        <EVAIcon name="search-outline" fill="white" size={24} className={commonStyles.icon} />
        {t("Rechercher")}
      </Button>
    </>
  );
};

export default HomeSearchHeaderMobile;
