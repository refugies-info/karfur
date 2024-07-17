import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { Container } from "reactstrap";
import { ageFilters, AgeOptions, frenchLevelFilter, FrenchOptions } from "data/searchFilters";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { searchQuerySelector, themesDisplayedValueSelector } from "services/SearchResults/searchResults.selector";
import ThemeDropdown from "../ThemeDropdown";
import LocationDropdown from "../LocationDropdown";
import Filter from "./Filter";
import { FilterOptions } from "./Filter/Filter";

interface Props {
  locationSearch: string;
  themeSearch: string;
  resetDepartment: () => void;
  resetTheme: () => void;
  resetSearch: () => void;
  resetLocationSearch: () => void;
  onChangeDepartmentInput: (e: any) => void;
  onChangeThemeInput: (e: any) => void;
  onChangeSearchInput: (e: any) => void;
  ageOptions: FilterOptions;
  frenchLevelOptions: FilterOptions;
  languagesOptions: FilterOptions;
  selectAgeOption: (selected: AgeOptions[]) => void;
  selectFrenchLevelOption: (selected: FrenchOptions[]) => void;
  selectLanguageOption: (selected: string[]) => void;
}

const Filters = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    locationSearch,
    themeSearch,
    resetLocationSearch,
    resetDepartment,
    onChangeDepartmentInput,
    resetTheme,
    onChangeThemeInput,
    resetSearch,
    onChangeSearchInput,
    ageOptions,
    selectAgeOption,
    frenchLevelOptions,
    selectFrenchLevelOption,
    languagesOptions,
    selectLanguageOption,
  } = props;

  const query = useSelector(searchQuerySelector);

  // THEME
  const themeDisplayedValue = useSelector(themesDisplayedValueSelector);

  // AGE
  const [ageDisplayedValue, setAgeDisplayedValue] = useState<string[]>([]);
  useEffect(() => {
    const values = query.age
      .map((age) => {
        const val = ageFilters.find((a) => a.key === age)?.value;
        //@ts-ignore
        if (val) return t(val);
        return null;
      })
      .filter((v) => v !== null) as string[];
    setAgeDisplayedValue(values);
  }, [query.age, t]);

  // FRENCH LEVEL
  const [frenchLevelDisplayedValue, setFrenchLevelDisplayedValue] = useState<string[]>([]);
  useEffect(() => {
    const values = query.frenchLevel
      .map((frenchLevel) => {
        const val = frenchLevelFilter.find((a) => a.key === frenchLevel)?.value;
        //@ts-ignore
        if (val) return t(val);
        return null;
      })
      .filter((v) => v !== null) as string[];
    setFrenchLevelDisplayedValue(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.frenchLevel]);

  // LANGUAGE
  const languages = useSelector(allLanguesSelector);
  const [languageDisplayedValue, setLanguageDisplayedValue] = useState<string[]>([]);
  useEffect(() => {
    const values = query.language
      .map((ln) => {
        const val = languages.find((a) => a.i18nCode === ln)?.langueFr;
        return val || null;
      })
      .filter((v) => v !== null) as string[];
    setLanguageDisplayedValue(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.language, languages]);

  return (
    <div className="py-4 bg-white">
      <Container className="d-flex gap-3 ">
        <Filter
          label={t("Dispositif.Département", "Département")}
          value={query.departments}
          dropdownMenu={{
            reset: resetDepartment,
            menu: <LocationDropdown locationSearch={locationSearch} resetLocationSearch={resetLocationSearch} />,
          }}
          gaType="department"
        />
        <Filter
          label={t("Recherche.themes", "Thèmes")}
          value={themeDisplayedValue}
          dropdownMenu={{
            reset: resetTheme,
            menu: <ThemeDropdown search={themeSearch} mobile={false} isOpen={true} /> /* TODO: fix isOpen here */,
          }}
          gaType="themes"
        />
        <Filter
          label={t("Recherche.filterAge", "Tranche d'âge")}
          value={ageDisplayedValue}
          dropdownMenu={{
            selected: query.age,
            //@ts-ignore
            selectItem: selectAgeOption,
            options: ageOptions,
          }}
          gaType="age"
        />
        <Filter
          label={t("Recherche.filterFrenchLevel", "Niveau de français")}
          value={frenchLevelDisplayedValue}
          dropdownMenu={{
            selected: query.frenchLevel,
            //@ts-ignore
            selectItem: selectFrenchLevelOption,
            options: frenchLevelOptions,
          }}
          gaType="frenchLevel"
        />
        <Filter
          label={t("Recherche.filterLanguage", "Fiches traduites en")}
          value={languageDisplayedValue}
          dropdownMenu={{
            selected: query.language,
            //@ts-ignore
            selectItem: selectLanguageOption,
            options: languagesOptions,
          }}
          gaType="language"
        />
      </Container>
    </div>
  );
};

export default Filters;
