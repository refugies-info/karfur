import React, { Component } from 'react';
import track from 'react-tracking';
import { withTranslation } from 'react-i18next';
////////A enlever si pas utilisé/////////////:
import Notifications from '../../components/UI/Notifications/Notifications';

import LanguageModal from '../../components/Modals/LanguageModal/LanguageModal'
import './HomePage.scss';

class HomePage extends Component {
  state = {
    showModal: false
  }

  changeLanguage = (lng) => {
      this.props.tracking.trackEvent({ action: 'click', label: 'changeLanguage', value : lng });
      this.props.i18n.changeLanguage(lng);
      this.setState({showModal:false})
  }

  render(){
    console.log(process.env)
    const { t } = this.props;
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
    return(
      <div className="animated fadeIn homepage">
          <LanguageModal show={this.state.showModal} changeFn={this.changeLanguage} languages={languages}/>
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

              <a href="/base/welcome_parcours" className="btn-get-started">Créer un parcours personnalisé</a>
              </div>
          </section>



          <div>
              <button onClick={() => this.changeLanguage('fr')}>fr</button>
              <button onClick={() => this.changeLanguage('en')}>en</button>
              <button onClick={() => this.changeLanguage('ar')}>ar</button>
              <h1>{this.props.t('Bienvenue')}</h1>
          </div>
          <div>Toolbar, SideDrawer and Backdrop</div>
          
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

export default track({
    page: 'HomePage',
  })(
    withTranslation()(HomePage)
  );