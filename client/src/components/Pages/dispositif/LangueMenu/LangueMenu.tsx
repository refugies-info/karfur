import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { GetLanguagesResponse } from "api-types";
import { cls } from "lib/classname";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import Flag from "components/UI/Flag";
import styles from "./LangueMenu.module.scss";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";

interface Props {
  selectedLn: string;
  setSelectedLn: React.Dispatch<React.SetStateAction<string>>;
  label?: string;
  withFlag?: boolean;
  className?: string;
  disabledOptions?: string[];
}

/**
 * Dropdown showing a list of languages. Can be used at different places across the page.
 */
const LangueMenu = (props: Props) => {
  const languages = useSelector(allLanguesSelector);
  const [open, setOpen] = useState(false);

  const onClickItem = (language: GetLanguagesResponse) => {
    if (props.disabledOptions?.includes(language.i18nCode)) return; // disabled
    if (language.i18nCode) props.setSelectedLn(language.i18nCode);
    setOpen(false);
  };

  const lnCode = languages.find((ln) => ln.i18nCode === props.selectedLn)?.langueCode;

  return (
    <Dropdown
      isOpen={open}
      direction="down"
      toggle={() => setOpen((o) => !o)}
      className={cls(styles.dropdown, open && styles.open, props.className)}
    >
      <DropdownToggle>
        {props.label}&nbsp;
        {props.withFlag && <Flag langueCode={lnCode} className="ms-2" />}
        <EVAIcon name={open ? "chevron-up" : "chevron-down"} size={16} fill="dark" className={styles.icon} />
      </DropdownToggle>
      <DropdownMenu className={styles.menu}>
        {languages.map((ln, i) => (
          <DropdownItem
            key={i}
            onClick={() => onClickItem(ln)}
            className={cls(styles.item, ln.i18nCode === props.selectedLn && styles.selected)}
            toggle={false}
            disabled={props.disabledOptions?.includes(ln.i18nCode)}
          >
            <Flag langueCode={ln.langueCode} className="me-2" />
            <span className={styles.item_locale}>{ln.langueFr} -</span>
            <span>{ln.langueLoc}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LangueMenu;
