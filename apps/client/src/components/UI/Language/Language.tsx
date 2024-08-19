import React from "react";
import { activatedLanguages } from "data/activatedLanguages";
import styles from "./Language.module.scss";

interface Props {
  langueCode?: string;
  i18nCode?: string;
}

const Language = (props: Props) => {
  if (!props.langueCode && !props.i18nCode) return null;
  const language = activatedLanguages.find((ln) => {
    if (props.langueCode) return ln.langueCode === props.langueCode;
    else if (props.i18nCode) return ln.i18nCode === props.i18nCode;
    return null;
  });
  if (!language) return null;

  return (
    <span className={styles.container}>
      <span className={"fi fi-" + language.langueCode} title={language.langueCode} id={language.langueCode} />
      <span>{language.langueFr}</span>
      {language.langueCode !== "fr" && (
        <>
          {" - "}
          {language.langueLoc}
        </>
      )}
    </span>
  );
};

export default Language;
