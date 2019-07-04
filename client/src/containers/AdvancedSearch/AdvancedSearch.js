import React, { Component, Suspense } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, CardBody, CardFooter, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import querySearch from "stringquery";

import SearchItem from './SearchItem/SearchItem';
import API from '../../utils/API';
import {initial_data} from "./data"
import CustomCard from '../../components/UI/CustomCard/CustomCard';
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';

import './AdvancedSearch.scss';

import variables from 'scss/colors.scss';

const tris = [{name: "Alphabétique"}, {name:"Derniers ajouts"}, {name: "Les plus visités"}, {name: "À traduire"}];
const filtres = [{name: "Démarches"}, {name:"Dispositifs"}, {name: "Articles"}, {name: "Lexique"}, {name: "Annuaire"}];

class AdvancedSearch extends Component {
  state = {
    showSpinner: false,
    recherche: initial_data.map( x => ({...x, active: false})),
    dispositifs: [],
    pinned: [],
    activeFiltre: "Dispositifs",
    activeTri: "Alphabétique"
  }

  componentDidMount (){
    let tag=querySearch(this.props.location.search).tag;
    if(tag) { this.selectTag(decodeURIComponent(tag)) } else { this.queryDispositifs() }
    window.scrollTo(0, 0);
  }

  queryDispositifs = query => {
    this.setState({ showSpinner: true })
    API.get_dispositif({...query, status:'Actif'}).then(data_res => {
      let dispositifs=data_res.data.data
      this.setState({ dispositifs:dispositifs, showSpinner: false })
    }).catch(()=>this.setState({ showSpinner: false }))
  }
  
  selectTag = tag => {
    this.setState({tags: this.state.tags.map(x => (x.name===tag ? {...x, active: true} : {...x, active: false})), color: tag.color})
    this.queryDispositifs({tags: tag})
    this.props.history.replace("/dispositifs?tag="+tag)
  }

  goToDispositif = (dispositif={}, fromAutoSuggest=false) => {
    this.props.tracking.trackEvent({ action: 'click', label: 'goToDispositif' + (fromAutoSuggest ? ' - fromAutoSuggest' : ''), value : dispositif._id });
    this.props.history.push('/dispositif' + (dispositif._id ? ('/' + dispositif._id) : ''))
  }

  upcoming = () => Swal.fire( 'Oh non!', 'Cette fonctionnalité n\'est pas encore activée', 'error')

  selectParam = (key, subitem) => {
    let recherche = [...this.state.recherche];
    recherche[key]={
      ...recherche[key],
      value: subitem.name,
      query: subitem.query || subitem.name,
      active: true
    }
    this.setState({recherche: recherche});
  }

  desactiver = key => this.setState({recherche: this.state.recherche.map((x, i) => i===key ? initial_data[i] : x)});

  render() {
    const {recherche, dispositifs, pinned, showSpinner, activeFiltre, activeTri} = this.state;
    return (
      <div className="animated fadeIn advanced-search">
        <Row className="search-wrapper">
          <Col lg="2" className="mt-250 side-col">
            <EVAIcon name="options-2-outline" fill={variables.noir} className="mr-12" />
            <div className="right-side">
              <b>Trier par :</b> 
              <div className="mt-10 side-options">
                {tris.map((tri, idx) => (
                  <div 
                    key={idx} 
                    className={"side-option" + (tri.name === activeTri ? " active" : "")}
                    onClick={this.upcoming}
                  >
                    {tri.name}
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col lg="8" className="mt-250 central-col">
            <div className="search-bar">
              {recherche.map((d,i) => (
                <SearchItem 
                  key={i}
                  item={d}
                  keyValue={i}
                  selectParam = {this.selectParam}
                  desactiver={this.desactiver}
                />
              ))}
            </div>
            <div className="results-wrapper">
              <Row>
                {[...pinned,...dispositifs].slice(0,8).map((dispositif) => {
                  if(!dispositif.hidden){
                    return (
                      <Col xs="12" sm="6" md="3" className="card-col puff-in-center" key={dispositif._id}>
                        <CustomCard onClick={() => this.goToDispositif(dispositif)}>
                          <CardBody>
                            <EVAIcon name="bookmark" size="xlarge" onClick={(e)=>this.pin(e,dispositif)} fill={(dispositif.pinned ? variables.noir : variables.noirCD)} className="bookmark-icon" />
                            <h3>{dispositif.titreInformatif}</h3>
                            <p>{dispositif.abstract}</p>
                          </CardBody>
                          <CardFooter className={"align-right bg-violet"}>{dispositif.titreMarque}</CardFooter>
                        </CustomCard>
                      </Col>
                    )
                  }else{
                    return false
                  }}
                )}
                <Col xs="12" sm="6" md="3">
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
            </div>
          </Col>
          <Col lg="2" className="mt-250 side-col">
            <EVAIcon name="funnel-outline" fill={variables.noir} className="mr-12" />
            <div className="right-side">
              <b>Filtrer par :</b> 
              <div className="mt-10 side-options">
                {filtres.map((filtre, idx) => (
                  <div 
                    key={idx} 
                    className={"side-option" + (filtre.name === activeFiltre ? " active" : "")}
                    onClick={this.upcoming}
                  >
                    {filtre.name}
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default track({
    page: 'AdvancedSearch',
  })(
    withTranslation()(AdvancedSearch)
  );

