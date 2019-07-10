import React, { Component } from 'react';
import track from 'react-tracking';
import { withTranslation } from 'react-i18next';
import Autosuggest from 'react-autosuggest';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { Row, Col, Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import Swal from 'sweetalert2';

////////A enlever si pas utilisé/////////////:
import Notifications from '../../components/UI/Notifications/Notifications';
// import SendToMessenger from './SendToMessenger';
import MessengerSendToMessenger from '../../utils/MessengerSendToMessenger';
import API from '../../utils/API';
import { toggle_lang_modal } from '../../Store/actions/index';
import SVGIcon from "../../components/UI/SVGIcon/SVGIcon"
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';
import FButton from '../../components/FigmaUI/FButton/FButton';
import LanguageBtn from '../../components/FigmaUI/LanguageBtn/LanguageBtn';

import './HomePage.scss';
import variables from 'scss/colors.scss';

const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const getSuggestionValue = suggestion => {
  console.log('la');
  return suggestion.titreInformatif ? (suggestion.titreMarque + " - " + suggestion.titreInformatif) : suggestion.title;}
const renderSectionTitle = section => <strong>{section.title}</strong>
const getSectionSuggestions = section => section.children;

class HomePage extends Component {
  state = {
    search: [{ type: 'Dispositifs', children: [] }, { type: 'Articles', children: [] }, { type: 'Démarches', children: [] }],
    value: '',
    suggestions: [],
  }

  componentDidMount() {
    API.get_dispositif({ status: 'Actif' }).then(data => {
      let dispositifs = data.data.data
      this.setState({ search: this.state.search.map(x => x.type === 'Dispositifs' ? { ...x, children: dispositifs } : x) })
    })
    API.get_article({ isStructure: { $ne: true } }).then(data => {
      let articles = data.data.data;
      this.setState({ search: this.state.search.map(x => x.type === 'Articles' ? { ...x, children: articles } : x) })
    })
  }

  onChange = (_, { newValue }) => this.setState({ value: newValue });

  onSuggestionsFetchRequested = debounce(({ value }) => {console.log('ici');this.setState({ suggestions: this.getSuggestions(value) })}, 200)

  onSuggestionsClearRequested = () => this.setState({ suggestions: [] });

  getSuggestions = value => {
    console.log(value);
    const escapedValue = escapeRegexCharacters(value.trim());
    if (escapedValue === '') { return []; }
    const regex = new RegExp('.*?' + escapedValue + '.*', 'i');
    return this.props.dispositifs.filter(dispositif => regex.test(dispositif.titreMarque) || regex.test(dispositif.titreInformatif) || regex.test(dispositif.abstract) || regex.test(dispositif.contact) || (dispositif.tags || []).some(x => regex.test(x)) || (dispositif.audience || []).some(x => regex.test(x)) || (dispositif.audienceAge || []).some(x => regex.test(x)) || this.findInContent(dispositif.contenu, regex));
  }

  findInContent = (contenu, regex) => contenu.some(x => regex.test(x.title) || regex.test(x.content) || (x.children && x.children.length > 0 && this.findInContent(x.children, regex)));

  validate = (suggestion) => {
    this.props.history.push((suggestion.titreMarque ? '/dispositif/' : '/article/') + suggestion._id)
  }

  upcoming = () => Swal.fire( 'Oh non!', 'Cette fonctionnalité n\'est pas encore disponible', 'error')

  render() {
    const { t } = this.props;

    const renderSuggestion = suggestion => <span onClick={() => this.validate(suggestion)}>{suggestion.titreInformatif ? (suggestion.titreMarque + " - " + suggestion.titreInformatif) : suggestion.title}</span>
    const inputProps = { placeholder: 'Chercher', value: this.state.value, onChange: this.onChange };
    return (
      <div className="animated fadeIn homepage">
        <section id="hero">
          <div className="hero-container">
            <h1>Construire sa vie en France</h1>
            <h5>Cherchez un des 13 dispositifs, démarches ou articles dédiés aux personnes réfugiées</h5>
            <div className="search-row">
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
                {/*  <input className="form-control my-0 py-1 amber-border" type="text" placeholder="Chercher" aria-label="Chercher" /> */}
                <div className="input-group-append">
                  <span className="input-group-text amber lighten-3" id="basic-text1">
                    Valider
                  </span>
                </div>
              </div>
              <div>
                <div>ou essayez la</div>
                <NavLink to="/advanced-search">
                  <FButton type="dark">
                    <SVGIcon name="fire" className="mr-10" />
                    Super recherche
                  </FButton>
                </NavLink>
              </div>
            </div>
          </div>
          <EVAIcon className="arrowhead-icon" name="arrowhead-down-outline" fill={variables.noir} />
        </section>

        <section id="plan">
          <div className="section-container">
            <h2>Vous cherchez ?</h2>

            <Row className="card-row">
              <Col lg="4" className="card-col">
                <Card className="cursor-pointer" onClick={this.upcoming}>
                  <CardHeader>Comprendre une démarche</CardHeader>
                  <CardBody>
                    <span>Je veux comprendre ce que l'administration me demande et bénéficier de mes droits</span>
                  </CardBody>
                  <CardFooter>
                    <FButton type="dark" name="search-outline">
                      Chercher une démarche
                    </FButton>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="4" className="card-col">
                <NavLink to="/dispositifs" className="no-decoration">
                  <Card>
                    <CardHeader>Apprendre, travailler, me former, rencontrer</CardHeader>
                    <CardBody>
                      <span>Je veux rejoindre un dispositif d’accompagnement ou une initiative</span>
                    </CardBody>
                    <CardFooter>
                      <FButton type="dark" name="search-outline">
                        Trouver un dispositif
                      </FButton>
                    </CardFooter>
                  </Card>
                </NavLink>
              </Col>
              <Col lg="4" className="card-col">
                <Card className="cursor-pointer" onClick={this.upcoming}>
                  <CardHeader>Créer mon parcours personnalisé</CardHeader>
                  <CardBody>
                    <span>Je veux réaliser mes projets et me construire un avenir qui me plaît</span>
                  </CardBody>
                  <CardFooter>
                    <FButton type="dark" name="search-outline">
                      Créer un parcours
                    </FButton>
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
              <p>Agi’r est une plateforme ouverte à la contribution, comme Wikipédia. Son objectif est de centraliser et de garder à jour un maximum d’informations pratiques pour aider les réfugiés à prendre leurs marques en France.</p>
              <NavLink to="/qui-sommes-nous">
                <u>En savoir plus</u>
              </NavLink>
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
              <p>Agi’r est lisible dans les 10 langues les plus parlées par les personnes réfugiées. Participez à l’effort de traduction pour rendre l’information toujours plus accessible.</p>
              <LanguageBtn />
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
              <p>Les contenus proposés sont relus, corrigés et si besoin certifiés avant d’être publiés afin d’éviter les erreurs et les informations périmées.</p>
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
            <p>Passez la souris sur un mot pour accéder à sa définition. Consulter le Lexique pour apprendre les nombreux mots spécifiques aux démarches administratives.</p>
            <FButton type="dark" onClick={this.upcoming}>
              Voir le lexique
            </FButton>
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