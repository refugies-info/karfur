import React from "react";
import { activatedLanguages } from "data/activatedLanguages";
import styles from "./Language.module.scss";

interface Props {
  langueCode: string;
}

const Language = (props: Props) => {
  const language = activatedLanguages.find(
    (ln) => ln.langueCode === props.langueCode
  );
  if (!language) return null;

  return (
    <span className={styles.container}>
      <i
        className={"flag-icon flag-icon-" + language.langueCode}
        title={language.langueCode}
        id={language.langueCode}
      />
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
