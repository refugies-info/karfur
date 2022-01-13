import React from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import FButton from "../FButton/FButton";

import { toggleLangueModalActionCreator } from "../../../services/Langue/langue.actions";

import "./LanguageBtn.module.scss";

const languageBtn = (props) => {
  const current =
    (props.langues || []).find((x) => x.i18nCode === props.i18n.language) || {};
  const langueCode =
    props.langues.length > 0 && current ? current.langueCode : "fr";

  return (
    <FButton
      type="white"
      className="language-btn mr-10"
      onClick={props.toggleLangueModal}
    >
      <i
        className={"flag-icon flag-icon-" + langueCode}
        title={langueCode}
        id={langueCode}
      />
      {!props.hideText && (
        <span className="ml-10 language-name">
          {current.langueLoc || "Langue"}
        </span>
      )}
    </FButton>
  );
};

const mapStateToProps = (state) => {
  return {
    languei18nCode: state.langue.languei18nCode,
    langues: state.langue.langues,
  };
};

const mapDispatchToProps = {
  toggleLangueModal: toggleLangueModalActionCreator,
};

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(languageBtn)
);
