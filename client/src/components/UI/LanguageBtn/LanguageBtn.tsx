import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FButton from "../FButton/FButton";
import { toggleLangueModalActionCreator } from "services/Langue/langue.actions";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import styles from "./LanguageBtn.module.scss";
import { useRouter } from "next/router";

interface Props {
  hideTextOnMobile?: boolean;
}

const LanguageBtn = (props: Props) => {
  const allLanguages = useSelector(allLanguesSelector);
  const router = useRouter();
  const current = (allLanguages || []).find((x) => x.i18nCode === router.locale) || null;
  const langueCode = allLanguages.length > 0 && current ? current.langueCode : "fr";
  const dispatch = useDispatch();

  return (
    <FButton
      className={styles.language_btn + " me-2"}
      type="white"
      onClick={() => dispatch(toggleLangueModalActionCreator())}
    >
      <span className={`fi fi-${langueCode}`} title={langueCode} id={langueCode} />
      <span className={`${props.hideTextOnMobile ? styles.mobile_hidden : ""} ms-2`}>
        {current ? current.langueLoc : "Langue"}
      </span>
    </FButton>
  );
};

export default LanguageBtn;
