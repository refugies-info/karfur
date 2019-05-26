import React, { Component, Suspense } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, Button, Collapse, CardBody, CardFooter, Spinner } from 'reactstrap';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match'
import AutosuggestHighlightParse from 'autosuggest-highlight/parse'
import Swal from 'sweetalert2';

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
  }

  componentDidMount (){
    this.queryDispositifs({status:'Actif'})
  }

  queryDispositifs = query => {
    this.setState({ showSpinner: true })
    API.get_dispositif(query).then(data_res => {
      let dispositifs=data_res.data.data
      this.setState({ dispositifs:dispositifs, showSpinner: false })
    }).catch(()=>this.setState({ showSpinner: false }))
  }

  _toggleModal = (show, dispositif = {}) => {
    this.setState({showModal:show, dispositif:dispositif})
  }

  _toggleSearch = () => this.setState(prevState=>{return {showSearch:!prevState.showSearch}})

  onChange = (_, { newValue }) => this.setState({ value: newValue });

  onSuggestionsFetchRequested = ({ value }) => this.setState({ suggestions: this.getSuggestions(value) });

  onSuggestionsClearRequested = () => this.setState({ suggestions: [] });

  getSuggestions = (value) => {
    const escapedValue = escapeRegexCharacters(value.trim());
    if (escapedValue === '') { return [];}
    const regex = new RegExp('.*?' + escapedValue + '.*', 'i');
    return this.state.dispositifs.filter(dispositif => regex.test(dispositif.titreMarque) || regex.test(dispositif.titreInformatif));
  }

  onSuggestionSelected = (_,{suggestion}) => this.goToDispositif(suggestion, true)

  goToDispositif = (dispositif={}, fromAutoSuggest=false) => {
    this.props.tracking.trackEvent({ action: 'click', label: 'goToDispositif' + (fromAutoSuggest ? ' - fromAutoSuggest' : ''), value : dispositif._id });
    this.props.history.push('/dispositif' + (dispositif._id ? ('/' + dispositif._id) : ''))
  }

  upcoming = () => Swal.fire( 'Oh non!', 'Cette fonctionnalité n\'est pas encore activée', 'error')

  render() {
    let {showSpinner} = this.state;
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
                <h1 className="text-white">Construire sa vie en France</h1>
                <h2>Ici, vous pourrez comprendre comment ouvrir vos droits sociaux, trouver un emploi, trouver des cours de français</h2>
                
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
              {this.state.showSearch ? "Masquer la recherche avancée" : "Afficher la recherche avancée"} &nbsp;&nbsp;
              <EVAIcon name={"chevron-" + (this.state.showSearch ? "up" : "down") + "-outline"} />
            </h3>
          </Button>
        </section>

        <section id="menu_dispo">
          <Row className="align-items-center themes">
            {filtres.tags.map(tag =>(
              <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0" key={tag}>
                <Button block outline color={randomColor()} onClick={()=>this.queryDispositifs({'tags':tag})}>{tag}</Button>
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
                    <CardFooter className={"align-right bg-"+randomColor()}>{dispositif.titreMarque}</CardFooter>
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

