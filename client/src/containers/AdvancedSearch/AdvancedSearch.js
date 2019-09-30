import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, CardBody, CardFooter, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import querySearch from "stringquery";
import _ from "lodash";
// import Cookies from 'js-cookie';

import SearchItem from './SearchItem/SearchItem';
import API from '../../utils/API';
import {initial_data} from "./data"
import CustomCard from '../../components/UI/CustomCard/CustomCard';
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';
import {filtres} from "../Dispositif/data";

import './AdvancedSearch.scss';
import variables from 'scss/colors.scss';

const tris = [{name: "A > Z", value: "titreInformatif"}, {name:"Derniers ajouts", value: "created_at"}, {name: "Les plus visités", value:"nbVues"}];

let user={_id:null, cookies:{}};
class AdvancedSearch extends Component {
  state = {
    showSpinner: false,
    recherche: initial_data.map( x => ({...x, active: false})),
    dispositifs: [],
    nbVues: [],
    pinned: [],
    activeFiltre: "Dispositifs",
    activeTri: "A > Z",
    tags: filtres.tags,
    data: [], //inutilisé, à remplacer par recherche quand les cookies sont stabilisés
    order: "created_at",
    croissant: true,
  }

  componentDidMount (){
    this.retrieveCookies();
    let tag=querySearch(this.props.location.search).tag;
    if(tag) { this.selectTag(decodeURIComponent(tag)) } else { this.queryDispositifs() }
    this._initializeEvents();
    window.scrollTo(0, 0);
  }

  queryDispositifs = (query=null) => {
    this.setState({ showSpinner: true })
    query = query || this.state.recherche.filter(x => x.active && x.queryName!=='localisation').map(x => (
      x.queryName === "audienceAge" ? 
      { "audienceAge.bottomValue": { $lt: x.topValue}, "audienceAge.topValue": { $gt: x.bottomValue} } :
      {[x.queryName]: x.query}
    )).reduce((acc, curr) => ({...acc, ...curr}),{});
    console.log(query)
    API.get_dispositif({query: {...query, status:'Actif'}}).then(data_res => {
      let dispositifs=data_res.data.data;
      if(query["tags.name"]){       //On réarrange les résultats pour avoir les dispositifs dont le tag est le principal en premier
        dispositifs = dispositifs.sort((a,b)=> (a.tags.findIndex(x => x ? x.short === query["tags.name"] : 99) - b.tags.findIndex(x => x ? x.short === query["tags.name"] : 99)))
      }
      dispositifs = dispositifs.map(x => ({...x, nbVues: (this.state.nbVues.find(y=>y._id === x._id) || {}).count }))     //Je rajoute la donnée sur le nombre de vues par dispositif
        .filter(x => !this.state.pinned.some(y=>y._id===x._id))
      this.setState({ dispositifs:dispositifs, showSpinner: false })
    }).catch(()=>this.setState({ showSpinner: false }))
  }
  
  selectTag = (tag = {}) => {
    this.setState(pS => ({tags: pS.tags.map(x => (x.short===tag ? {...x, active: true} : {...x, active: false})), color: (tag || {}).color}))
    this.queryDispositifs({["tags.short"]: tag})
    this.props.history.replace("/advanced-search?tag="+tag)
  }
  
  _initializeEvents = () => {
    API.aggregate_events([
      {$match:
        {'action': 'readDispositif',
         'label': 'dispositifId',
         'value': { $ne: null } } },
      {$group:
         { _id : "$value",
          count:{ $sum: 1}}}
    ]).then(data_res => { 
      const countEvents = data_res.data.data;
      this.setState(pS => ({nbVues: countEvents, dispositifs: pS.dispositifs.map(x => ({...x, nbVues: (countEvents.find(y=>y._id === x._id) || {}).count })) }));
    })
  }

  retrieveCookies = () => {
    // Cookies.set('data', 'ici un test');
    // let dataC=Cookies.getJSON('data');
    // if(dataC){ this.setState({data:data.map((x,key)=> {return {...x, value:dataC[key] || x.value}})})}
    // let pinnedC=Cookies.getJSON('pinnedC');
    // if(pinnedC){ this.setState({pinned:pinnedC})}
    //data à changer en recherche après
    if(API.isAuth()){
      API.get_user_info().then(data_res => {
        let u=data_res.data.data;
        user={_id:u._id, cookies:u.cookies || {}}
        this.setState({
          pinned:user.cookies.parkourPinned || [],
          dispositifs:[...this.state.dispositifs].filter(x => !((user.cookies.parkourPinned || []).find( y=> y._id === x._id))),
          ...(user.cookies.parkourData && user.cookies.parkourData.length>0 && 
            {data:this.state.data.map((x,key)=> {return {...x, value: (user.cookies.parkourData[key] || x.value), query: (x.children.find(y=> y.name === (user.cookies.parkourData[key] || x.value)) || {}).query }})})
        })
      })
    }
  }

  pin = (e,dispositif) => {
    e.preventDefault();
    e.stopPropagation();
    dispositif.pinned=!dispositif.pinned;
    let prevState=[...this.state.dispositifs];
    console.log(this.state.dispositifs, this.state.pinned,dispositif)
    this.setState({
      dispositifs: dispositif.pinned ? prevState.filter(x => x._id !== dispositif._id) : [...prevState,dispositif],
      pinned: dispositif.pinned ? 
        [...this.state.pinned,dispositif] :
        this.state.pinned.filter(x=> x._id !== dispositif._id)
    },()=>{
      console.log(this.state.dispositifs, this.state.pinned)
      user.cookies.parkourPinned=this.state.pinned;
      API.set_user_info(user);
    })
  }

  reorder = tri => {
    console.log(tri, this.state.dispositifs);
    const order = tri.value,  croissant = order === this.state.order ? !this.state.croissant : true;
    this.setState(pS => ({dispositifs: pS.dispositifs.sort((a,b)=> {
      const aValue = _.get(a, order), bValue = _.get(b, order);
      return aValue > bValue ? (croissant ? 1 : -1) : aValue < bValue ? (croissant ? -1 : 1) : 0;
    }), order: tri.value, activeTri: tri.name, croissant: croissant}))
  }

  goToDispositif = (dispositif={}, fromAutoSuggest=false) => {
    this.props.tracking.trackEvent({ action: 'click', label: 'goToDispositif' + (fromAutoSuggest ? ' - fromAutoSuggest' : ''), value : dispositif._id });
    this.props.history.push('/dispositif' + (dispositif._id ? ('/' + dispositif._id) : ''))
  }

  upcoming = () => Swal.fire( {title:'Oh non!', text:'Cette fonctionnalité n\'est pas encore activée', type:'error', timer: 1500})

  selectParam = (key, subitem) => {
    let recherche = [...this.state.recherche];
    recherche[key]={
      ...recherche[key],
      value: subitem.name,
      query: subitem.query || subitem.name,
      active: true,
      ...(subitem.bottomValue && {bottomValue: subitem.bottomValue}),
      ...(subitem.topValue && {topValue: subitem.topValue}),
    }
    this.setState({recherche: recherche}, ()=> this.queryDispositifs());
  }

  desactiver = key => this.setState({recherche: this.state.recherche.map((x, i) => i===key ? initial_data[i] : x)}, ()=> this.queryDispositifs());

  render() {
    const {recherche, dispositifs, pinned, showSpinner, activeFiltre, activeTri} = this.state;
    const {t} = this.props;
    return (
      <div className="animated fadeIn advanced-search">
        <Row className="search-wrapper">
          <Col lg="2" className="mt-250 side-col">
            <EVAIcon name="options-2-outline" fill={variables.noir} className="mr-12" />
            <div className="right-side">
              <b>{t("AdvancedSearch.Trier par", "Trier par :")}</b> 
              <div className="mt-10 side-options">
                {tris.map((tri, idx) => (
                  <div 
                    key={idx} 
                    className={"side-option" + (tri.name === activeTri ? " active" : "")}
                    onClick={()=>this.reorder(tri)}
                  >
                    {t("AdvancedSearch." + tri.name, tri.name)}
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
                {[...pinned,...dispositifs].map((dispositif) => {
                  if(!dispositif.hidden){
                    let shortTag = null;
                    if(dispositif.tags && dispositif.tags.length > 0 && dispositif.tags[0] && dispositif.tags[0].short){ shortTag = (dispositif.tags[0].short || {}).replace(/ /g, "-") }
                    return (
                      <Col xs="12" sm="6" md="3" className="card-col puff-in-center" key={dispositif._id}>
                        <CustomCard onClick={() => this.goToDispositif(dispositif)}>
                          <CardBody>
                            <EVAIcon 
                              name="bookmark" 
                              size="xlarge" 
                              onClick={(e)=>this.pin(e,dispositif)} 
                              fill={(dispositif.pinned ? variables.noir : variables.noirCD)} 
                              className={"bookmark-icon" + (dispositif.pinned ? " pinned":"")} 
                            />
                            <h5>{dispositif.titreInformatif}</h5>
                            <p>{dispositif.abstract}</p>
                          </CardBody>
                          <CardFooter className={"align-right bg-" + shortTag}>{dispositif.titreMarque}</CardFooter>
                        </CustomCard>
                      </Col>
                    )
                  }else{
                    return false
                  }}
                )}
                {!showSpinner && [...pinned,...dispositifs].length === 0 &&
                  <Col xs="12" sm="6" md="3" className="no-result" onClick={()=>this.selectTag()}>
                    <CustomCard>
                      <CardBody>
                        <h5>{t("Aucun résultat", "Aucun résultat")}</h5>
                        <p>{t("Elargir recherche", "Essayez d’élargir votre recherche en désactivant certains tags")} </p>
                      </CardBody>
                      <CardFooter className="align-right">
                        {t("Désolé", "Désolé")}...
                      </CardFooter>
                    </CustomCard>
                  </Col>}
                <Col xs="12" sm="6" md="3">
                  <CustomCard addcard="true" onClick={this.goToDispositif}>
                    <CardBody>
                      {showSpinner ?
                        <Spinner color="success" /> : 
                        <span className="add-sign">+</span> }
                    </CardBody>
                    <CardFooter className="align-right">
                      {showSpinner ? t("Chargement", "Chargement") + "..." : t("Créer un dispositif", "Créer un dispositif")}
                    </CardFooter>
                  </CustomCard>
                </Col>
              </Row>
            </div>
          </Col>
          {/* <Col lg="2" className="mt-250 side-col">
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
          </Col> */}
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

