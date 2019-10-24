import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import FButton from '../FButton/FButton';

import {toggle_lang_modal} from "../../../Store/actions/index";

import './LanguageBtn.scss'

const languageBtn = (props) => {
  const current = (props.langues || []).find(x => x.i18nCode === props.i18n.language) || {};
  const langueCode = props.langues.length > 0 && current ? current.langueCode : "fr";

  return(
    <FButton type="outline-black" className="language-btn" onClick={props.toggle_lang_modal}>
      <i className={'mr-10 flag-icon flag-icon-' + langueCode} title={langueCode} id={langueCode} />
      <span className="language-name">{current.langueLoc || "Langue"}</span>
    </FButton>
  )
}

const mapStateToProps = (state) => {
  return {
    languei18nCode: state.langue.languei18nCode,
    langues: state.langue.langues,
  }
}

const mapDispatchToProps = {toggle_lang_modal};

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(languageBtn)
);