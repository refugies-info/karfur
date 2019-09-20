import React, { Component } from 'react';
import track from 'react-tracking';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
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

import './HomePage.scss';
import variables from 'scss/colors.scss';

const anchorOffset = '120';

class HomePage extends Component {
  state = {
    search: [{ type: 'Dispositifs', children: [] }, { type: 'Articles', children: [] }, { type: 'Démarches', children: [] }],
    value: '',
    suggestions: [],
  }

  componentDidMount (){
    window.scrollTo(0, 0);
  }

  upcoming = () => Swal.fire( {title: 'Oh non!', text: 'Cette fonctionnalité n\'est pas encore disponible', type: 'error', timer: 1500 })

  render() {
    // const { t } = this.props;
    return (
      <div className="animated fadeIn homepage">
        <section id="hero">
          <div className="hero-container">
            <h1>Construire sa vie en France</h1>
            <h5>Cherchez un des {this.props.dispositifs.length} dispositifs, démarches ou articles dédiés aux personnes réfugiées</h5>
            
            <div className="search-row">
              <SearchBar 
                validateTest="Valider"
                className="input-group"
                placeholder="Rechercher..."
              />
              <div className="try-it-out mr-10">ou</div>
              <FButton tag={NavLink} to="/advanced-search" name="flash" type="dark" className="large-btn">
                Super recherche
              </FButton>
            </div>
          </div>
          <AnchorLink href="#plan" className="arrowhead-icon header-anchor d-inline-flex justify-content-center align-items-center">
            <EVAIcon className="slide-bottom" name="arrowhead-down-outline" size="xlarge" fill={variables.noir} />
          </AnchorLink>
        </section>

        <section id="plan">
          <div className="section-container">
            <h2>Vous cherchez ?</h2>

            <Row className="card-row">
              <Col lg="4" className="card-col">
                <Card className="cursor-pointer" onClick={this.upcoming}>
                  <CardHeader>À comprendre une démarche</CardHeader>
                  <CardBody>
                    {/* <span>Je veux comprendre ce que l'administration me demande et bénéficier de mes droits</span> */}
                  </CardBody>
                  <CardFooter>
                    {/*<FButton type="outline-black" name="search-outline" fill={variables.noir}>
                      Chercher une démarche
                    </FButton>*/}
                    <span>Bientôt disponible !</span>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="4" className="card-col">
                <NavLink to="/advanced-search" className="no-decoration">
                  <Card>
                    <CardHeader>À apprendre, travailler, vous former, rencontrer</CardHeader>
                    <CardBody>
                      {/* <span>Je veux rejoindre un dispositif d’accompagnement ou une initiative</span> */}
                    </CardBody>
                    <CardFooter>
                      <FButton type="outline-black" name="search-outline" fill={variables.noir}>
                        Trouver un dispositif
                      </FButton>
                    </CardFooter>
                  </Card>
                </NavLink>
              </Col>
              <Col lg="4" className="card-col">
                <Card className="cursor-pointer" onClick={this.upcoming}>
                  <CardHeader>À créer votre parcours personnalisé</CardHeader>
                  <CardBody>
                    {/* <span>Je veux réaliser mes projets et me construire un avenir qui me plaît</span> */}
                  </CardBody>
                  <CardFooter>
                    {/*<FButton type="outline-black" name="search-outline" fill={variables.noir}>
                      Créer un parcours
                  </FButton>*/}
                    <span>Bientôt disponible !</span>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        <section id="contribution">
          <div className="section-container half-width">
            <div className="section-body">
              <h2>Ouverte à la contribution</h2>
              <p className="text-normal">
                Agi’r est une plateforme ouverte à la contribution, comme Wikipédia. Son objectif est de centraliser et de garder à jour un maximum d’informations pratiques pour aider les réfugiés à prendre leurs marques en France.
                {" "}
                <NavLink to="/qui-sommes-nous">
                  <u>En savoir plus</u>
                </NavLink>
              </p>
            </div>
            <footer>
              Déjà 230 contributeurs et contributrices engagés :
              <FButton tag={NavLink} to="/backend/user-profile" type="dark" className="ml-10">
                Je contribue
              </FButton>
            </footer>
          </div>
        </section>

        <section id="multilangues">
          <div className="section-container half-width right-side">
            <div className="section-body">
              <h2>Disponible en plusieurs langues</h2>
              <p className="text-normal">Agi’r est lisible dans les 10 langues les plus parlées par les personnes réfugiées. Participez à l’effort de traduction pour rendre l’information toujours plus accessible.</p>
              {/*<LanguageBtn />*/}
            </div>
            <footer>
              Déjà 32 traducteurs et traductrices mobilisés :
              <FButton tag={NavLink} to="/backend/user-profile" type="dark" className="ml-10">
                Je traduis
              </FButton>
            </footer>
          </div>
        </section>

        <section id="certifiee">
          <div className="section-container half-width">
            <div className="section-body">
              <h2>De l’information vérifiée et certifiée par l’État</h2>
              <p className="text-normal">Les contenus proposés sont relus, corrigés et si besoin certifiés avant d’être publiés afin d’éviter les erreurs et les informations périmées.</p>
            </div>
            <footer>
              Nous ne censurons aucun contenu :
              <FButton type="dark" className="ml-10" onClick={this.upcoming}>
                Notre charte éditoriale
              </FButton>
            </footer>
          </div>
        </section>

        <section id="explique">
          <div className="section-container half-width right-side">
            <h2>Explique les mots difficiles</h2>
            <p className="text-normal">Passez la souris sur un mot pour accéder à sa définition. Consulter le Lexique pour apprendre les nombreux mots spécifiques aux démarches administratives.</p>
            <span className="text-normal">Bientôt disponible !</span>
            {/*<FButton type="dark" onClick={this.upcoming}>
              Voir le lexique
                </FButton>*/}
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