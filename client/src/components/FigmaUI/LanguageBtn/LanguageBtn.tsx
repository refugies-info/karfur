import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FButton from "../FButton/FButton";
import { toggleLangueModalActionCreator } from "services/Langue/langue.actions";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import i18n from "i18n";
import styles from "./LanguageBtn.module.scss";

interface Props {
  hideTextOnMobile?: boolean
}

const LanguageBtn = (props: Props) => {
  const allLanguages = useSelector(allLanguesSelector);
  const current =
    (allLanguages || []).find((x) => x.i18nCode === i18n.language) || null;
  const langueCode =
    allLanguages.length > 0 && current ? current.langueCode : "fr";
  const dispatch = useDispatch();

  return (
    <FButton
      className={styles.language_btn + " mr-10"}
      type="white"
      onClick={() => dispatch(toggleLangueModalActionCreator())}
    >
      <i
        className={`flag-icon flag-icon-${langueCode}`}
        title={langueCode}
        id={langueCode}
      />
      <span className={`${props.hideTextOnMobile ? styles.mobile_hidden : ""} ml-10`}>
        {current ? current.langueLoc : "Langue"}
      </span>
    </FButton>
  );
};

export default LanguageBtn;
