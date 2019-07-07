import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button } from 'reactstrap';

import {toggle_lang_modal} from "../../../Store/actions/index";

import './LanguageBtn.scss'

const languageBtn = (props) => {

  const CurrentLanguageIcon = () => {
    let current = props.langues.find(x => x.i18nCode === props.i18n.language)
    if (props.langues.length > 0 && current){
      return <i className={'flag-icon flag-icon-' + current.langueCode} title={current.langueCode} id={current.langueCode} />
    }else{
      return <i className={'flag-icon flag-icon-fr'} title="fr" id="fr"></i>
    }
  }

  return(
    <Button className="language-btn" onClick={props.toggle_lang_modal}>
      <CurrentLanguageIcon />
    </Button>
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