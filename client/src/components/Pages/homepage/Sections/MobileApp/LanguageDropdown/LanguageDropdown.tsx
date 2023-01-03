import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { cls } from "lib/classname";
import { Language } from "types/interface";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./LanguageDropdown.module.scss";

interface Props {
  languageSelected: Language | undefined;
  onSelectItem: (ln: Language) => void;
}

const LanguageDropdown = (props: Props) => {
  const { t } = useTranslation();
  const { languageSelected, onSelectItem } = props;
  const languages = useSelector(allLanguesSelector);
  const [open, setOpen] = useState(false);

  const onClickItem = (language: Language) => {
    onSelectItem(language);
    setOpen(false);
  };

  return (
    <Dropdown isOpen={open} direction="down" toggle={() => setOpen((o) => !o)} className={cls(styles.dropdown)}>
      <DropdownToggle>
        <span className={styles.value}>
          {`${t("Homepage.mobileAppInLanguage")} ${languageSelected?.langueLoc.toLowerCase() || "français"}`}
          <span
            className={cls(styles.flag, `fi fi-${languageSelected?.langueCode || "fr"}`)}
            title={languageSelected?.langueCode || "fr"}
            id={languageSelected?.langueCode || "fr"}
          />
        </span>
        <EVAIcon className={styles.icon} name="chevron-down-outline" fill="dark" size={24} />
      </DropdownToggle>
      <DropdownMenu className={styles.menu} flip={false}>
        {languages.map((ln, i) => (
          <DropdownItem
            key={i}
            onClick={() => onClickItem(ln)}
            className={cls(styles.item, ln.i18nCode === (languageSelected?.i18nCode || "fr") && styles.selected)}
            toggle={false}
          >
            <span className={cls(styles.flag, `fi fi-${ln.langueCode}`)} title={ln.langueCode} id={ln.langueCode} />
            <span className={styles.item_locale}>{ln.langueFr} -</span>
            <span>{ln.langueLoc}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageDropdown;
