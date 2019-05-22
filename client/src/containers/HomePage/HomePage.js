import React, { Component } from 'react';
import track from 'react-tracking';
import { withTranslation } from 'react-i18next';
import Autosuggest from 'react-autosuggest';
import {NavLink} from 'react-router-dom';
import { connect } from 'react-redux';

////////A enlever si pas utilisé/////////////:
import Notifications from '../../components/UI/Notifications/Notifications';
// import SendToMessenger from './SendToMessenger';
import MessengerSendToMessenger from '../../utils/MessengerSendToMessenger';
import API from '../../utils/API';

import './HomePage.scss';

const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const getSuggestionValue = suggestion => suggestion.titreInformatif ? (suggestion.titreMarque + " - " + suggestion.titreInformatif) : suggestion.title;
const renderSectionTitle = section => <strong>{section.title}</strong>
const getSectionSuggestions = section => section.children;

class HomePage extends Component {
  state = {
    search:[{type:'Dispositifs', children:[]}, {type:'Articles', children:[]}, {type:'Démarches', children:[]}],
    value: '',
    suggestions: [],
  }

  componentDidMount (){
    API.get_dispositif({status:'Actif'}).then(data => {
      let dispositifs=data.data.data
      this.setState({ search:this.state.search.map(x => x.type==='Dispositifs' ? {...x, children:dispositifs} : x) })
    })
    API.get_article({isStructure: {$ne: true}}).then(data => {
      let articles=data.data.data;
      this.setState({ search:this.state.search.map(x => x.type==='Articles' ? {...x, children: articles} : x) })
    })
  }

  onChange = (_, { newValue }) => this.setState({ value: newValue });

  onSuggestionsFetchRequested = ({ value }) => this.setState({ suggestions: this.getSuggestions(value) });

  onSuggestionsClearRequested = () => this.setState({ suggestions: [] });

  getSuggestions = (value) => {
    const escapedValue = escapeRegexCharacters(value.trim());
    
    if (escapedValue === '') { return [];}
  
    const regex = new RegExp('.*?' + escapedValue + '.*', 'i');
    
    return this.state.search
      .map(section => {
        return {
          title: section.type,
          children: section.children.filter(child => regex.test(child.titreMarque || child.title))
        };
      })
      .filter(section => section.children.length > 0);
  }

  validate = (suggestion) => {
    this.props.history.push((suggestion.titreMarque ? '/dispositif/' : '/article/') + suggestion._id)
  }

  render(){
    const { t } = this.props;
    
    const renderSuggestion = suggestion => <span onClick={()=>this.validate(suggestion)}>{suggestion.titreInformatif ? (suggestion.titreMarque + " - " + suggestion.titreInformatif) : suggestion.title}</span>
    const inputProps = { placeholder: 'Chercher', value:this.state.value, onChange: this.onChange };
    return(
      <div className="animated fadeIn homepage">            
          <section id="hero">
              <div className="hero-container">
              <h1>Bienvenue dans le projet Karfu'R</h1>
              <h2>Vous pouvez naviguer sur le site ou créer un parcours personnalisé d'intégration</h2>

              <div className="input-group md-form form-sm form-2 pl-0">
                <Autosuggest 
                    multiSection={true}
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    renderSectionTitle={renderSectionTitle}
                    getSectionSuggestions={getSectionSuggestions}
                    inputProps={inputProps} />
{/* 
                <input className="form-control my-0 py-1 amber-border" type="text" placeholder="Chercher" aria-label="Chercher" /> */}
                <div className="input-group-append">
                    <span className="input-group-text amber lighten-3" id="basic-text1">
                    <i className="fa fa-search text-grey"
                        aria-hidden="true"></i></span>
                </div>
              </div>

              <hr />
              <p>ou</p>
              <hr />

              <NavLink to="/parcours-on-board" className="btn-get-started">Créer un parcours personnalisé</NavLink>
              </div>
          </section>



          {/* <div>
              <button onClick={() => this.changeLanguage('fr')}>fr</button>
              <button onClick={() => this.changeLanguage('en')}>en</button>
              <button onClick={() => this.changeLanguage('ar')}>ar</button>
              <h1>{this.props.t('Bienvenue')}</h1>
          </div>
          <div>Toolbar, SideDrawer and Backdrop</div>

          <SendToMessenger messengerAppId="300548213983436" pageId="423112408432299" />

          <MessengerSendToMessenger 
            pageId="423112408432299" 
            appId="300548213983436" 
            ctaText="SEND_THIS_TO_ME"
            language= 'fr_FR'
            size="xlarge"
            dataRef="/dispositif/5cd43ce8b472e46bd90e8f58" />

          <Notifications/>

          <div>{t('Elément principal')}</div>
          <div>{t('Elément secondaire')}</div>
          <div>{t('Troisième élément')}</div>
          <div>{t('Quatrième élément')}</div>
          <div>{t('accueil.Cinquième élément')}</div>
          <div>{t('accueil.Six')}</div> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    languei18nCode: state.langue.languei18nCode,
  }
}

export default track({
    page: 'HomePage',
  })(
    connect(mapStateToProps)(
      withTranslation()(HomePage)
    )
  );