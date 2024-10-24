import { GetLanguagesResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import Flag from "~/components/UI/Flag";
import { cls } from "~/lib/classname";
import { allLanguesSelector } from "~/services/Langue/langue.selectors";
import styles from "./LanguageDropdown.module.scss";

interface Props {
  languageSelected: GetLanguagesResponse | undefined;
  onSelectItem: (ln: GetLanguagesResponse) => void;
}

const LanguageDropdown = (props: Props) => {
  const { t } = useTranslation();
  const { languageSelected, onSelectItem } = props;
  const languages = useSelector(allLanguesSelector);
  const [open, setOpen] = useState(false);

  const onClickItem = (language: GetLanguagesResponse) => {
    onSelectItem(language);
    setOpen(false);
  };

  const language = languageSelected?.langueFr.toLowerCase() || "français";

  return (
    <Dropdown isOpen={open} direction="down" toggle={() => setOpen((o) => !o)} className={cls(styles.dropdown)}>
      <DropdownToggle>
        <span className={styles.value}>
          {t(`LanguageDropdown.en_${language}`, `en ${language}`)}
          <Flag langueCode={languageSelected?.langueCode || "fr"} className="mx-2" />
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
            <Flag langueCode={ln.langueCode || "fr"} className="mx-2" />
            <span className={styles.item_locale}>{ln.langueFr} -</span>
            <span>{ln.langueLoc}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageDropdown;
