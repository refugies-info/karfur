import React, { Component, Suspense } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, Button, Collapse, CardBody, CardFooter, Spinner } from 'reactstrap';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match'
import AutosuggestHighlightParse from 'autosuggest-highlight/parse'
import Swal from 'sweetalert2';
import debounce from 'lodash.debounce';

import Modal from '../../components/Modals/Modal'
import {randomColor} from '../../components/Functions/ColorFunctions'
import API from '../../utils/API';
import femmeDispo from '../../assets/figma/femmeDispo.svg'
import hommeDispo from '../../assets/figma/hommeDispo.svg'
import CustomCard from '../../components/UI/CustomCard/CustomCard';
import {filtres} from '../Dispositif/data';
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';

import './Dispositifs.scss';

const loading = () => <div className="animated fadeIn pt-1 text-center">Chargement...</div>

const ParkourOnBoard = React.lazy(() => import('../ParkourOnBoard/ParkourOnBoard'));

const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const getSuggestionValue = suggestion => suggestion.titreMarque + " - " + suggestion.titreInformatif;

class Dispositifs extends Component {
  state = {
    dispositifs:[],
    dispositif:{},
    showModal:false,
    showSearch:false,
    value: '',
    suggestions: [],
    showSpinner:true,
    tags: filtres.tags.map(x => ({...x, active: false})),
    color: null
  }

  componentDidMount (){
    this.queryDispositifs()
  }

  queryDispositifs = query => {
    this.setState({ showSpinner: true })
    API.get_dispositif({...query, status:'Actif'}).then(data_res => {
      let dispositifs=data_res.data.data
      this.setState({ dispositifs:dispositifs, showSpinner: false })
    }).catch(()=>this.setState({ showSpinner: false }))
  }
  
  selectTag = (tag, key) => {
    this.setState({tags: this.state.tags.map((x, i) => (i===key ? {...x, active: true} : {...x, active: false})), color: tag.color})
    this.queryDispositifs({'tags':tag.name})
  }

  _toggleModal = (show, dispositif = {}) => {
    this.setState({showModal:show, dispositif:dispositif})
  }

  _toggleSearch = () => this.setState(prevState=>{return {showSearch:!prevState.showSearch}})

  onChange = (_, { newValue }) => this.setState({ value: newValue });

  onSuggestionsFetchRequested = debounce( ({ value }) => this.setState({ suggestions: this.getSuggestions(value) }),1000)

  onSuggestionsClearRequested = () => this.setState({ suggestions: [] });

  getSuggestions = value => {
    console.log(value)
    const escapedValue = escapeRegexCharacters(value.trim());
    if (escapedValue === '') { return [];}
    const regex = new RegExp('.*?' + escapedValue + '.*', 'i');
    return this.state.dispositifs.filter(dispositif => regex.test(dispositif.titreMarque) || regex.test(dispositif.titreInformatif) || regex.test(dispositif.abstract) || regex.test(dispositif.contact) || (dispositif.tags || []).some(x => regex.test(x)) || (dispositif.audience || []).some(x => regex.test(x)) || (dispositif.audienceAge || []).some(x => regex.test(x)) || this.findInContent(dispositif.contenu, regex) );
  }

  findInContent = (contenu, regex) => contenu.some(x => regex.test(x.title) || regex.test(x.content) || (x.children && x.children.length > 0 && this.findInContent (x.children, regex)) );

  onSuggestionSelected = (_,{suggestion}) => this.goToDispositif(suggestion, true)

  goToDispositif = (dispositif={}, fromAutoSuggest=false) => {
    this.props.tracking.trackEvent({ action: 'click', label: 'goToDispositif' + (fromAutoSuggest ? ' - fromAutoSuggest' : ''), value : dispositif._id });
    this.props.history.push('/dispositif' + (dispositif._id ? ('/' + dispositif._id) : ''))
  }

  upcoming = () => Swal.fire( 'Oh non!', 'Cette fonctionnalité n\'est pas encore activée', 'error')

  render() {
    const { t } = this.props;
    let {showSpinner, tags, color} = this.state;
    const renderSuggestion = (suggestion, { query }) => {
      const suggestionText = `${suggestion.titreMarque} - ${suggestion.titreInformatif}`;
      const matches = AutosuggestHighlightMatch(suggestionText, query + ' ' + query);
      const parts = AutosuggestHighlightParse(suggestionText, matches);
      return (
        <span className={'suggestion-content'}>
          <span className="name">
            {parts.map((part, index) => {
              const className = part.highlight ? 'highlight' : null;
  
              return <span className={className} key={index}>{part.text}</span>;
            })}
          </span>
        </span>
      );
    }

    const inputProps = { placeholder: 'Chercher', value: this.state.value, onChange: this.onChange };
    
    return (
      <div className="animated fadeIn dispositifs">
        <section id="hero">
          <div className="hero-container">
            <Row className="full-width">
              <Col lg="3">
                <img src={femmeDispo} alt="femme"/>
              </Col>
              <Col lg="6">
                <h1 className="text-white">{t('Dispositifs.Header')}</h1>
                <h2>{t('Dispositifs.Subheader')}</h2>
                
                <div className="input-group md-form form-sm form-1 pl-0 search-bar inner-addon right-addon">
                  <Autosuggest 
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    onSuggestionSelected={this.onSuggestionSelected} />
                  <i className="fa fa-search text-grey search-btn" aria-hidden="true"></i>
                </div>
              </Col>
              <Col lg="3">
                <img src={hommeDispo} alt="homme"/>
              </Col>
            </Row>
          </div>
        </section>

        <section id="advanced_search">
          <Collapse isOpen={this.state.showSearch}>
            <Suspense fallback={loading()}>
              <ParkourOnBoard />
            </Suspense>
          </Collapse>
          <Button className="btn-toggle-search" color="dark" onClick={this._toggleSearch} style={{ marginBottom: '1rem' }}>
            <h3>
              {this.state.showSearch ? t("Masquer la recherche avancée") : t("Afficher la recherche avancée")} &nbsp;&nbsp;
              <EVAIcon name={"chevron-" + (this.state.showSearch ? "up" : "down") + "-outline"} />
            </h3>
          </Button>
        </section>

        <section id="menu_dispo">
          <Row className="align-items-center themes">
            {tags.map((tag, key) =>(
              <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0" key={tag.name}>
                <Button block outline={!tag.active} color={tag.color} onClick={()=>this.selectTag(tag, key)}>
                  {t("Tags." + tag.name)}
                </Button>
              </Col>
            ))}
            <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
              <span className="toggler active" data-toggle="grid"><span className="fa fa-th-large" /></span>
              <span className="toggler" data-toggle="list" onClick={this.upcoming}><span className="fa fa-th-list" /></span>{/*  or use entypo library from weloveicons */}
            </Col>
          </Row>
          <Row>
            {this.state.dispositifs.map((dispositif) => {
              return (
                <Col xs="9" sm="4" md="3" key={dispositif._id}>
                  <CustomCard onClick={() => this.goToDispositif(dispositif)}>
                    <CardBody>
                      <h3>{dispositif.titreInformatif}</h3>
                      <p>{dispositif.abstract}</p>
                    </CardBody>
                    <CardFooter className={"align-right bg-"+ (color || randomColor())}>{dispositif.titreMarque}</CardFooter>
                  </CustomCard>
                </Col>
              )}
            )}
            <Col xs="9" sm="4" md="3">
              <CustomCard addcard="true" onClick={this.goToDispositif}>
                <CardBody>
                  {showSpinner ?
                    <Spinner color="success" /> : 
                    <span className="add-sign">+</span> }
                </CardBody>
                <CardFooter className="align-right bg-secondary text-white">
                  {showSpinner ? "Chargement..." : "Créer un nouveau dispositif"}
                </CardFooter>
              </CustomCard>
            </Col>
          </Row>
        </section>

        {/* <Modal show={this.state.showModal} modalClosed={()=>this._toggleModal(false)} classe='modal-dispo'>
          <div className="left-text">
            <h3>Faire son service civique</h3>
            <p>Avec le programme <i>Volont'r</i></p>
          </div>
          <Button block color="info" className="right-button">Formation professionnelle</Button>
          <footer className='modal-footer'>
            <Button outline color="success" size="lg" block onClick={this.goToDispositif}>Y accéder</Button>
          </footer>
        </Modal> */}
      </div>
    )
  }
}

export default track({
    page: 'Dispositifs',
  })(
    withTranslation()(Dispositifs)
  );

