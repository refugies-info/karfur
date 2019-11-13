import React, { Component } from 'react';
import track from 'react-tracking';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import { connect } from 'react-redux';
import { Row, Col, Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import Swal from 'sweetalert2';
import AnchorLink from 'react-anchor-link-smooth-scroll';

////////A enlever si pas utilisé/////////////:
// import Notifications from '../../components/UI/Notifications/Notifications';
// import SendToMessenger from './SendToMessenger';
// import MessengerSendToMessenger from '../../utils/MessengerSendToMessenger';
import { toggle_lang_modal } from '../../Store/actions/index';
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';
import FButton from '../../components/FigmaUI/FButton/FButton';
import LanguageBtn from '../../components/FigmaUI/LanguageBtn/LanguageBtn';
import SearchBar from '../UI/SearchBar/SearchBar';
import API from '../../utils/API';
import FSearchBtn from '../../components/FigmaUI/FSearchBtn/FSearchBtn';

import './HomePage.scss';
import variables from 'scss/colors.scss';
import { filtres } from '../Dispositif/data';
import SearchItem from '../AdvancedSearch/SearchItem/SearchItem';
import { initial_data } from '../AdvancedSearch/data';

const anchorOffset = '120';

class HomePage extends Component {
  state = {
    search: [{ type: 'Dispositifs', children: [] }, { type: 'Articles', children: [] }, { type: 'Démarches', children: [] }],
    value: '',
    suggestions: [],
    users: [],
  }

  componentDidMount (){
    API.get_users({query: {status: "Actif"}, populate: 'roles'}).then(data => this.setState({users: data.data.data}) );
    window.scrollTo(0, 0);
  }

  selectParam = (_, subitem) => subitem && this.props.history.push({ pathname:"/advanced-search", search: '?tag=' + subitem.short });

  upcoming = () => Swal.fire( {title: 'Oh non!', text: 'Cette fonctionnalité n\'est pas encore disponible', type: 'error', timer: 1500 })

  render() {
    const { t } = this.props;
    const {users} = this.state;
    const item = initial_data[0]
    return (
      <div className="animated fadeIn homepage">
        <section id="hero">
          <div className="hero-container">
            <h1>{t("Homepage.Construis ta vie en France", "Construis ta vie en France")}</h1>
            <h5>{t("Homepage.subtitle", {nombre: this.props.dispositifs.length})}</h5>
            
            <div className="search-row">
              <SearchItem  
                item={{...item, value: item.children[0].name}}
                keyValue={0}
                selectParam = {this.selectParam}
                desactiver={()=>{}}
              />
              {/* <h5>Je cherche à</h5>
              <FSearchBtn className={"bg-" + item.short.split(" ").join("-") + " texte-blanc"}>
                <h5>{t("Tags." + item.name, item.name)}</h5>
              </FSearchBtn> */}
            </div>
          </div>
          <div className="chevron-wrapper">
            <div className="slide-animation">
              <AnchorLink offset='60' href="#plan" className="arrowhead-icon header-anchor">
                <div className="slide-background">
                  <EVAIcon className="bottom-slider" name="arrow-circle-down" size="hero"/>
                </div>
              </AnchorLink>
            </div>
          </div>
          <AnchorLink offset='60' href="#plan" className="arrowhead-icon header-anchor d-inline-flex justify-content-center align-items-center">
            <div className="slide-animation">
              <span className="slide-background"></span>
              <EVAIcon className="slide-bottom" name="arrow-circle-down" size="hero"/>
            </div>
          </AnchorLink>
        </section>

        <section id="plan" className="triptique">
          <div className="section-container">
            <h2>{t("Homepage.Vous cherchez ?", "Tu cherches à ?")}</h2>
              
            <Row className="card-row">
              <Col xl="4" lg="4" md="12" sm="12" xs="12" className="card-col">
                <NavLink to="/advanced-search" className="no-decoration">
                  <Card className="demarche-card">
                    <CardHeader>{t("Homepage.À comprendre une démarche", "À comprendre une démarche")}</CardHeader>
                    <CardBody>
                      {/* <span>Je veux comprendre ce que l'administration me demande et bénéficier de mes droits</span> */}
                    </CardBody>
                    <CardFooter>
                      <FButton type="homebtn" name="search-outline" fill={variables.noir}>
                        {t("Homepage.Trouver une démarche", "Trouver une démarche")}
                      </FButton>
                    </CardFooter>
                  </Card>
                </NavLink>
              </Col>
              <Col xl="4" lg="4" md="12" sm="12" xs="12" className="card-col">
                <NavLink to="/advanced-search" className="no-decoration">
                  <Card className="dispo-card">
                    <CardHeader>{t("Homepage.A apprendre", "Rejoindre un dispositif d'accompagnement")}</CardHeader>
                    <CardBody>
                      {/* <span>Je veux rejoindre un dispositif d’accompagnement ou une initiative</span> */}
                    </CardBody>
                    <CardFooter>
                      <FButton type="homebtn" name="search-outline" fill={variables.noir}>
                        {t("Homepage.Trouver un dispositif", "Trouver un dispositif")}
                      </FButton>
                    </CardFooter>
                  </Card>
                </NavLink>
              </Col>
              <Col xl="4" lg="4" md="12" sm="12" xs="12" className="card-col">
                <Card className="parcours-card">
                  <CardHeader>{t("Homepage.creer parcours", "Créer ton parcours personnalisé")}</CardHeader>
                  <CardBody>
                    {/* <span>Je veux réaliser mes projets et me construire un avenir qui me plaît</span> */}
                  </CardBody>
                  <CardFooter>
                    <FButton type="homebtn" disabled name="clock-outline" fill={variables.noir}>
                      Bientôt disponible
                    </FButton>
                    {/*<span>{t("Bientôt disponible !", "Bientôt disponible !")}</span>*/}
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        <section id="contribution" className="contrib">
          <div className="section-container half-width">
            <div className="section-body">
              <h2>{t("Homepage.contributive")}</h2>
              <p className="texte-normal">
                {t("Homepage.contributive subheader")}
                <NavLink className="link ml-10" to="/qui-sommes-nous">
                  {t("En savoir plus", "En savoir plus")}
                </NavLink>
              </p>
            </div>
            <footer className="footer-section">
              {t("Homepage.contributeurs mobilises", {nombre: (users.filter(x => (x.roles || []).some(y=>y.nom==="Contrib" || y.nom==="ExpertTrad")) || []).length })}{' '}
              <FButton tag={NavHashLink} to="/comment-contribuer#ecrire" type="dark">
                {t("Homepage.Je contribue", "Je contribue")}
              </FButton>
            </footer>
          </div>
        </section>

        <section id="multilangues">
          <div className="section-container half-width right-side">
            <div className="section-body">
              <h2>{t("Homepage.disponible langues")}</h2>
              <p className="texte-normal">{t("Homepage.disponible langues subheader")}</p>
              {/*<LanguageBtn />*/}
            </div>
            <footer className="footer-section">
              {t("Homepage.traducteurs mobilises", {nombre: (users.filter(x => (x.roles || []).some(y=>y.nom==="Trad" || y.nom==="ExpertTrad")) || []).length })}{' '}
              <FButton tag={NavHashLink} to={API.isAuth() ? "/backend/user-profile" : "/comment-contribuer#traduire"} type="dark">
                {t("Homepage.Je traduis", "Je traduis")}
              </FButton>
            </footer>
          </div>
        </section>

        <section id="certifiee">
          <div className="section-container half-width">
            <div className="section-body">
              <h2>{t("Homepage.information vérifiée")}</h2>
              <p className="texte-normal">{t("Homepage.information vérifiée subheader")}</p>
            </div>
            <footer>
              <FButton tag={NavHashLink} to="/comment-contribuer#corriger" type="dark">
                {t("En savoir plus", "En savoir plus")}
              </FButton>
            </footer>
          </div>
        </section>

        <section id="explique">
          <div className="section-container half-width right-side">
            <h2>{t("Homepage.Explique les mots difficiles", "Explique les mots difficiles")}</h2>
            <p className="texte-normal">{t("Homepage.explication lexique")}</p>
            <span className="texte-normal">{t("Bientôt disponible !", "Bientôt disponible !")}</span>
            {/*<FButton type="dark" onClick={this.upcoming}>
              Voir le lexique
                </FButton>*/}
          </div>
        </section>
        {/* <div>
            <button onClick={() => this.changeLanguage('fr')}>fr</button>
            <button onClick={() => this.changeLanguage('en')}>en</button>
            <button onClick={() => this.changeLanguage('ar')}>ar</button>
            <h1>{t('Bienvenue')}</h1>
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
    dispositifs: state.dispositif.dispositifs,
  }
}

const mapDispatchToProps = { toggle_lang_modal };

export default track({
  page: 'HomePage',
})(
  connect(mapStateToProps, mapDispatchToProps)(
    withTranslation()(HomePage)
  )
);