import React, { Component } from 'react';
import track from 'react-tracking';
import { withTranslation } from 'react-i18next';
////////A enlever si pas utilisé/////////////:
import Notifications from '../../components/UI/Notifications/Notifications';
import {NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
// import SendToMessenger from './SendToMessenger';
import MessengerSendToMessenger from './MessengerSendToMessenger';

import * as actions from '../../Store/actions';
import LanguageModal from '../../components/Modals/LanguageModal/LanguageModal'
import API from '../../utils/API';

import './HomePage.scss';

class HomePage extends Component {
  state = {
    showModal: false,
    available_languages:[]
  }
  bodyRef=React.createRef();

  componentDidMount (){
    API.get_langues({},{avancement:-1}).then(data_res => {
      this.setState({ available_languages: data_res.data.data })
    },function(error){ console.log(error); return; })


    // const script = document.createElement("script");

    // script.src = "https://connect.facebook.net/en_US/sdk.js";
    // script.async = true;

    // document.body.appendChild(script);

    // const s = document.createElement('script');
    // s.type = 'text/javascript';
    // s.async = true;
    // s.innerHTML = "window.fbAsyncInit = function() {"+
    //   "FB.init({"+
    //     "appId            : '300548213983436',"+
    //     "autoLogAppEvents : true,"+
    //     "xfbml            : true,"+
    //     "version          : 'v3.3'"+
    //   "})"+
    // "}";
    // document.body.appendChild(s);
  }

  changeLanguage = (lng) => {
    this.props.tracking.trackEvent({ action: 'click', label: 'changeLanguage', value : lng });
    const action = { type: actions.TOGGLE_LANGUE, value: lng }
    this.props.dispatch(action)
    if(this.props.i18n.getResourceBundle(lng,"translation")){
      this.props.i18n.changeLanguage(lng);
    }else{console.log('Resource not found in i18next.')}
    this.toggleLanguageModal();
  }

  toggleLanguageModal = () => {
    this.setState(prevState => {return {showModal: !prevState.showModal}})
  }

  handleResponse = (data) => {
    console.log(data);
  }

  handleError = (error) => {
    console.log( error );
  }
  
  render(){
    const { t, i18n } = this.props;
    const languages=[
      {
          name: 'Français',
          key: 'fr'
      },
      {
          name: 'English',
          key: 'en'
      },
      {
          name: 'العربية',
          key: 'ar'
      }
    ]
    //console.log(window.FB)
    // window.FB.Event.subscribe('send_to_messenger', function(e) {
    //   console.log(e)
    // });
    return(
      <div className="animated fadeIn homepage">
          <LanguageModal 
            show={this.state.showModal} 
            current_language={i18n.language}
            toggle={this.toggleLanguageModal} 
            changeLanguage={this.changeLanguage} 
            languages={this.state.available_languages}/>
            
          <section id="hero">
              <div className="hero-container">
              <h1>Bienvenue dans le projet Karfu'R</h1>
              <h2>Vous pouvez naviguer sur le site ou créer un parcours personnalisé d'intégration</h2>
              
              <div className="input-group md-form form-sm form-2 pl-0">
                  <input className="form-control my-0 py-1 amber-border" type="text" placeholder="Chercher" aria-label="Chercher" />
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



          <div>
              <button onClick={() => this.changeLanguage('fr')}>fr</button>
              <button onClick={() => this.changeLanguage('en')}>en</button>
              <button onClick={() => this.changeLanguage('ar')}>ar</button>
              <h1>{this.props.t('Bienvenue')}</h1>
          </div>
          <div>Toolbar, SideDrawer and Backdrop</div>

          {/* <SendToMessenger messengerAppId="300548213983436" pageId="423112408432299" /> */}

          <MessengerSendToMessenger 
            pageId="423112408432299" 
            appId="300548213983436" 
            ctaText="SUBSCRIBE_IN_MESSENGER" />

          <Notifications/>

          <div>{t('Elément principal')}</div>
          <div>{t('Elément secondaire')}</div>
          <div>{t('Troisième élément')}</div>
          <div>{t('Quatrième élément')}</div>
          <div>{t('accueil.Cinquième élément')}</div>
          <div>{t('accueil.Six')}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    languei18nCode: state.langue.languei18nCode
  }
}

export default track({
    page: 'HomePage',
  })(
    connect(mapStateToProps)(
      withTranslation()(HomePage)
    )
  );