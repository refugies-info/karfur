import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import DropdownMenuMobile from "components/Pages/recherche/DropdownMenuMobile";
import LocationMenu from "components/Pages/recherche/LocationMenu";
import ThemeDropdown from "components/Pages/recherche/ThemeMenu";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import qs from "query-string";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { getPath } from "routes";
import commonStyles from "scss/components/searchHeader.module.scss";
import { searchQuerySelector, themesDisplayedValueSelector } from "services/SearchResults/searchResults.selector";
import SearchInput from "../SearchInput";
import styles from "./HomeSearchHeader.mobile.module.scss";

interface Props {
  resetDepartment: () => void;
  resetTheme: () => void;
  resetSearch: () => void;
  onChangeSearchInput: (e: any) => void;
}

const HomeSearchHeaderMobile = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { resetDepartment, resetTheme, resetSearch, onChangeSearchInput } = props;

  const query = useSelector(searchQuerySelector);

  // SEARCH
  const [searchActive, setSearchActive] = useState(false);

  // LOCATION
  const [locationOpen, setLocationOpen] = useState(false);
  const toggleLocation = useCallback(() => setLocationOpen((o) => !o), []);

  // THEME
  const [themesOpen, setThemesOpen] = useState(false);
  const themeDisplayedValue = useSelector(themesDisplayedValueSelector);
  const toggleThemes = useCallback(() => setThemesOpen((o) => !o), []);

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
              inputValue=""
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
                  <input type="text" placeholder={t("Dispositif.Département", "Département")} autoFocus />
                  <EVAIcon name="close-outline" fill="dark" size={20} className={commonStyles.empty} />
                </div>
              </div>
              <RadixDropdownMenu.Root>
                <RadixDropdownMenu.Portal>
                  <RadixDropdownMenu.Content>
                    <LocationMenu mobile={true} />
                  </RadixDropdownMenu.Content>
                </RadixDropdownMenu.Portal>
              </RadixDropdownMenu.Root>
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
              inputValue=""
              value={themeDisplayedValue.join(", ")}
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
              <ThemeDropdown mobile={true} isOpen={themesOpen} />
            </DropdownMenuMobile>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className={styles.container}>
        <Button onClick={() => setSearchActive(true)} className={styles.btn}>
          <SearchInput
            label={t("Recherche.keyword", "Mot-clé")}
            icon="search-outline"
            active={searchActive}
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
            query: qs.stringify({ ...query }, { arrayFormat: "comma" }),
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
