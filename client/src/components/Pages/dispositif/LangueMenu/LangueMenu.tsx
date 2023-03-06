import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { GetLanguagesResponse } from "api-types";
import { cls } from "lib/classname";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import styles from "./LangueMenu.module.scss";

interface Props {
  selectedLn: string;
  setSelectedLn: React.Dispatch<React.SetStateAction<string>>;
  label?: string;
  className?: string;
  disabledOptions?: string[];
}

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
      className={cls(styles.dropdown, props.className)}
    >
      <DropdownToggle>
        {props.label}&nbsp;
        <span className={cls(styles.flag, `ms-2 fi fi-${lnCode}`)} title={lnCode} id={lnCode} />
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
            <span
              className={cls(styles.flag, `me-2 fi fi-${ln.langueCode}`)}
              title={ln.langueCode}
              id={ln.langueCode}
            />
            <span className={styles.item_locale}>{ln.langueFr} -</span>
            <span>{ln.langueLoc}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LangueMenu;
