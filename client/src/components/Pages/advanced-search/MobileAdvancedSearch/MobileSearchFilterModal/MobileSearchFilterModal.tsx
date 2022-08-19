import React from "react";
import { Modal } from "reactstrap";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Streamline from "assets/streamline";
import {
  AvailableFilters,
  getSearchTheme,
  searchAge,
  searchFrench,
} from "data/searchFilters";
import { Language, Theme } from "types/interface";
import { AgeFilter, FrenchLevelFilter } from "data/searchFilters";
import styles from "./MobileSearchFilterModal.module.scss";
import { activatedLanguages } from "data/activatedLanguages";
import LanguageText from "components/UI/Language";
import { useSelector } from "react-redux";
import { themesSelector } from "services/Themes/themes.selectors";
import { useRouter } from "next/router";
import { getThemeName } from "lib/getThemeName";

interface ThemeButtonProps {
  theme: Theme;
  onClick: () => void;
}
const ThemeButton = (props: ThemeButtonProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <button
      onClick={props.onClick}
      className={`${styles.filter_btn} ${styles.theme}`}
      style={{ backgroundColor: props.theme.colors.color100 }}
    >
      {getThemeName(props.theme, router.locale)}
      <Streamline
        name={props.theme.icon}
        stroke={"white"}
        width={22}
        height={22}
      />
    </button>
  );
};

interface FilterButtonProps {
  item: AgeFilter | FrenchLevelFilter;
  onClick: () => void;
}
const FilterButton = (props: FilterButtonProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <button
      onClick={props.onClick}
      className={`${styles.filter_btn} ${styles.other}`}
    >
      <div className="m-auto">
        {t("Tags." + props.item.name, props.item.name)}
      </div>
    </button>
  );
};

interface LanguageButtonProps {
  item: Language;
  onClick: () => void;
}
const LanguageButton = (props: LanguageButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      className={`${styles.filter_btn} ${styles.other}`}
    >
      <LanguageText langueCode={props.item.langueCode} />
    </button>
  );
};

interface Props {
  selectOption: (item: string, type: AvailableFilters) => void;
  toggle: () => void;
  type: AvailableFilters;
  show: boolean;
  title: string;
  defaultTitle: string;
  sentence: string;
  defaultSentence: string;
}

export const MobileSearchFilterModal = (props: Props) => {
  const { t } = useTranslation();

  const themes = useSelector(themesSelector);
  const searchTheme = getSearchTheme(themes);
  let data: Theme[] | AgeFilter[] | FrenchLevelFilter[] | Language[] = [];
  if (props.type === "theme") {
    data = searchTheme.children || [];
  } else if (props.type === "age") {
    data = searchAge.children || [];
  } else if (props.type === "frenchLevel") {
    data = searchFrench.children || [];
  } else if (props.type === "langue") {
    data = activatedLanguages;
  }

  const selectOption = (item: string, type: AvailableFilters) => {
    props.selectOption(item, type);
    props.toggle();
  };

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className={styles.modal}
      contentClassName={styles.modal_content}
    >
      <div className={styles.title}>
        <p className={styles.title_text}>
          {" "}
          {t(props.sentence, props.defaultSentence)}
        </p>
        <button className={styles.title_btn} onClick={props.toggle}>
          {t(props.title, props.defaultTitle)}
          <EVAIcon name="close" fill="#FFFFFF" size="large" />
        </button>
      </div>
      {data.map((item, index: number) => (
        <div key={index}>
          {props.type === "theme" ? (
            <ThemeButton
              theme={item as Theme}
              onClick={() => selectOption((item as Theme).name.fr, props.type)}
            />
          ) : props.type === "age" || props.type === "frenchLevel" ? (
            <FilterButton
              item={item as AgeFilter | FrenchLevelFilter}
              onClick={() =>
                selectOption(
                  (item as AgeFilter | FrenchLevelFilter).name,
                  props.type
                )
              }
            />
          ) : props.type === "langue" ? (
            <LanguageButton
              item={item as Language}
              onClick={() =>
                selectOption((item as Language).i18nCode, props.type)
              }
            />
          ) : null}
        </div>
      ))}
    </Modal>
  );
};
