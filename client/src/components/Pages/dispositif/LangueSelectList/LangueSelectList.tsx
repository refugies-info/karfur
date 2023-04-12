import React from "react";
import { useSelector } from "react-redux";
import { GetLanguagesResponse } from "api-types";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Flag from "components/UI/Flag";
import styles from "./LangueSelectList.module.scss";

interface Props {
  selectedLn: string;
  setSelectedLn: React.Dispatch<React.SetStateAction<string>>;
  disabledOptions?: string[];
}

/**
 * List of languages with radio buttons. Can be used at different places across the page.
 */
const LangueSelectList = (props: Props) => {
  const languages = useSelector(allLanguesSelector).sort((a, b) => {
    if (a.langueCode === "fr") return -1;
    if (b.langueCode === "fr") return 1;
    return 0;
  });

  const onClickItem = (language: GetLanguagesResponse) => {
    if (props.disabledOptions?.includes(language.i18nCode)) return; // disabled
    if (language.i18nCode) props.setSelectedLn(language.i18nCode);
  };

  return (
    <div>
      {languages.map((ln, i) => {
        const isSelected = ln.i18nCode === props.selectedLn;
        return (
          <button
            key={i}
            onClick={(e: any) => {
              e.preventDefault();
              onClickItem(ln);
            }}
            disabled={props.disabledOptions?.includes(ln.i18nCode)}
            className={styles.btn}
          >
            <EVAIcon
              name={isSelected ? "radio-button-on" : "radio-button-off"}
              size={24}
              fill={isSelected ? styles.lightTextActionHighBlueFrance : "dark"}
              className="me-2"
            />
            <span>
              {ln.langueFr} {ln.langueCode !== "fr" && `- ${ln.langueLoc}`}
            </span>
            <Flag langueCode={ln.langueCode} className="ms-2" />
          </button>
        );
      })}
    </div>
  );
};

export default LangueSelectList;
