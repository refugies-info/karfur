import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Row, Progress, CardFooter, Table } from 'reactstrap';
import moment from 'moment/min/moment-with-locales';
import {NavLink} from 'react-router-dom';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';  
import track from 'react-tracking';

import API from '../../utils/API'
import {colorAvancement} from '../../components/Functions/ColorFunctions';
import {diffData} from './data';
import marioProfile from '../../assets/mario-profile.jpg';
import FButton from '../../components/FigmaUI/FButton/FButton';
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';

import './Avancement.scss';
import variables from 'scss/colors.scss';

moment.locale('fr');

class Avancement extends Component {
  state={
    mainView:true,
    title: diffData.all.title,
    headers: diffData.all.headers,

    langue:{},
    data: [],
    themes:[],
    itemId:null,
    isLangue: false,
    isExpert:false,
    traductionsFaites: []
  }

  componentDidMount (){
    let itemId=this.props.match.params.id;
    let isLangue=this.props.location.pathname.includes('/langue');
    let isExpert=this.props.location.pathname.includes('/traductions');
    console.log(itemId, isLangue, isExpert)
    let i18nCode=null;
    if(isLangue && itemId){
      if(this.props.location.state && this.props.location.state.langue && this.props.location.state.langue.i18nCode){
        this.setState({langue:this.props.location.state.langue,
          title: diffData.traducteur.title + ' : ' + this.props.location.state.langue.langueFr,
          headers: diffData.traducteur.headers});
        i18nCode=this.props.location.state.langue.i18nCode;
      }else{
        this._loadLangue(itemId, isExpert);
      }
    }else if(isExpert){
      this._loadLangue(itemId, isExpert);
    }
    this._loadArticles(itemId, i18nCode);
    API.get_tradForReview({}, {}, 'userId').then(data => { console.log(data.data.data);
      this.setState({traductionsFaites: data.data.data})
    })
    // this._loadThemes();
    this.setState({itemId, isExpert, isLangue})
    window.scrollTo(0, 0);
  }

  _loadArticles=(itemId, i18nCode=null) => {
    if(itemId){
      let query={};
      if(i18nCode){
        let nom='avancement.'+i18nCode;
        query ={$or : [{[nom]: {'$lt':1} }, {[nom]: null}]};
      }
      API.get_article(query,i18nCode).then(data_res => {
        let articles=data_res.data.data;
        console.log(articles)
        this.setState({data:articles})
      })
    }
  }

  _loadLangue=(itemId, isExpert) => {
    if(itemId){
      API.get_langues({_id:itemId},{'avancement':1}).then(data_res => {
        let langue=data_res.data.data[0];
        this._loadTraductions(langue);
        console.log(langue)
        this.setState({
          langue:langue,
          title: diffData.traducteur.title + ' : ' + langue.langueFr,
          headers: diffData[isExpert ? "expert" : "traducteur"].headers
        })
      })
    }
  }

  _loadTraductions=(langue) => {
    // if(langue.i18nCode){
    //   API.get_tradForReview({'langueCible':langue.i18nCode, 'status' : 'En attente'},{},'articleId userId').then(data_res => {
    //     let articles=data_res.data.data;
    //     articles=articles.map(x => {return {_id:x._id,title:x.initialText.title,nombreMots:x.nbMots,avancement:{[langue.i18nCode]:1}, status:x.status, articleId:(x.articleId || {})._id, created_at:x.created_at, user:x.userId, type: "string"}});
    //     console.log(articles)
    //     this.setState({data:articles});
    //   })
    // }
  }

  _loadThemes=() => {
    API.get_themes({}).then(data_res => {
      let themes=data_res.data.data;
      let reduced_themes=themes.reduce((acc, curr, i) => {
        if (i > 0 && i % 3 === 0 && i !== themes.length-1) {
          return {currGrp:[curr], groupedData: [...acc.groupedData, acc.currGrp]}
        }else if(i % 3 !== 0 && i === themes.length-1){
          return {groupedData: [...acc.groupedData, [...acc.currGrp, curr]], currGrp:[]}
        }else if(i % 3 === 0 && i === themes.length-1){
          return {groupedData: [...acc.groupedData, acc.currGrp, [curr]], currGrp:[]}
        }
        return {currGrp: [...acc.currGrp, curr], groupedData: acc.groupedData }
      }, {currGrp: [], groupedData: []}).groupedData;
      this.setState({themes:reduced_themes})
    })
  }

  onExiting = () => {
    this.animating = true;
  }

  onExited = () => {
    this.animating = false;
  }

  next = () => {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === this.state.themes.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous = () => {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? this.state.themes.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToTraduction = (element) => {
    console.log(element)
    this.props.history.push({
      pathname: (this.state.isExpert ? '/validation' : '/traduction') + '/' + element.type + '/' + element._id,
      // pathname: '/traduction/'+ (this.state.isExpert ? 'validation/' : '') + element._id,
      search: '?id=' + this.state.langue._id,
      state: { langue: this.state.langue}
    })
  }

  upcoming = () => Swal.fire( {title: 'Oh non!', text: 'Cette fonctionnalité n\'est pas encore activée', type: 'error', timer: 1500 })

  render(){
    const { langue, isExpert, data } = this.state;

    let traductions = [
      ...data.map(x => ( {
        ...x,
        avancement: Math.max(0, ...((this.state.traductionsFaites || []).filter(y => y.jsonId === x._id).map(z => (z.avancement || -1)) || [])) || 0, 
        users: [...new Set( (this.state.traductionsFaites || []).filter(y => y.jsonId === x._id).map(z => ((z.userId || {})._id) ) || [] ) ].map(id => ({_id : id, picture: (((this.state.traductionsFaites || []).find(t => (t.userId || {})._id === id) || {}).userId || {}).picture || {} })), 
        type: "string",
        _id: ((this.state.traductionsFaites || []).find(y => y.jsonId === x._id && y.avancement === 1) || {})._id,
      } ) ), 
      ...this.props.dispositifs.filter(x => x.status === "Actif" && (x.avancement || {})[this.state.langue.i18nCode] !== 1).map(x => ( {
          _id:x._id, 
          title:x.titreMarque + " - " + x.titreInformatif, 
          nombreMots:x.nbMots,
          avancement: Math.max(0, ...((this.state.traductionsFaites || []).filter(y => y.articleId === x._id).map(z => (z.avancement || -1)) || [])) || 0, 
          status:x.status, 
          created_at:x.created_at, 
          users: [...new Set( (this.state.traductionsFaites || []).filter(y => y.articleId === x._id).map(z => ((z.userId || {})._id) ) || [] ) ].map(id => ({_id : id, picture: (((this.state.traductionsFaites || []).find(t => (t.userId || {})._id === id) || {}).userId || {}).picture || {} })), 
          type: "dispositif"
      } ) )
    ].filter(x => isExpert ? x.avancement === 1 : x.avancement !== 1).sort((a,b)=> a.nombreMots - b.nombreMots);
    
    console.log(traductions, data)

    const AvancementData = () => {
      if(this.props.match.params.id && traductions.length>0 && this.state.langue.i18nCode){
        return(
          traductions.map((element,key) => {
            const joursDepuis = (new Date().getTime() -  new Date(element.created_at).getTime()) / (1000 * 3600 * 24);
            const titre = (element.title || {}).fr || element.title || (element.initialText || {}).title || (element.titreMarque + " - " + element.titreMarque) ||'' ;
            return (
              <tr 
                key={element._id}
                className="avancement-row pointer"
                onClick={() => this.goToTraduction(element)} >
                <td className="align-middle">{element.isStructure ? "Site" : "Dispositif"}</td>
                <td className="align-middle">{titre.slice(0,30) + (titre.length > 30 ? "..." : "")}</td>
                <td className={"align-middle depuis " + (element.nombreMots > 100 ? "alert" : "success") }>
                  {(isExpert ? "" : (Math.round((element.nombreMots || 0) * (element.avancement || 0)) + " / ")) + element.nombreMots}
                </td>
                {isExpert ? 
                  <td className="align-middle">
                    {element.users && [...element.users].map((participant) => {
                      return ( 
                        <img
                          key={participant._id} 
                          src={participant.picture && participant.picture.secure_url ? participant.picture.secure_url : marioProfile} 
                          className="profile-img-pin img-circle mr-10"
                          alt="random profiles"
                        />
                      );
                    })}
                  </td> :
                  <td className="align-middle">
                    <Row>
                      <Col>
                        <Progress color={colorAvancement(element.avancement)} value={element.avancement*100} />
                      </Col>
                      <Col className={'text-'+colorAvancement(element.avancement)}>
                        {element.avancement === 1 ? 
                          <EVAIcon name="checkmark-circle-2" fill={variables.vert} /> :
                          <span>{Math.round((element.avancement || 0) * 100)} %</span> }
                      </Col>
                    </Row>
                  </td>} 
                <td className={"align-middle depuis " + (joursDepuis > 3 ? "alert" : "success") }>
                  {moment(element.created_at).fromNow()}
                </td>
                <td className="align-middle fit-content">
                  <FButton type="light-action" name="bookmark-outline" fill={variables.noir} onClick={e => {e.stopPropagation();this.upcoming();}}/>
                </td>
                <td className="align-middle fit-content">
                  <FButton type="light-action" name="eye-outline" fill={variables.noir} onClick={() => this.goToTraduction(element)}/>
                </td>
              </tr>
            );
          })
        )
      }else{return (<tr><td>Chargement</td><td>Chargement</td><td>Chargement</td><td>Chargement</td><td>Chargement</td><td>Chargement</td></tr>)}
    }

    return(
      <div className="animated fadeIn avancement">        
        <Row>
          <Col>
            <h2>
              <NavLink to="/backend/user-profile" className="my-breadcrumb">Mon profil / </NavLink>
              <NavLink to="/backend/user-dashboard" className="my-breadcrumb">Espace traduction / </NavLink>
              {langue.langueFr}
            </h2>
          </Col>
          <Col className="tableau-header align-right">
            <FButton type="outline-black" name="info-outline" fill={variables.noir} className="mr-10" onClick={this.upcoming}>
              Aide
            </FButton>
            <FButton type="dark" name="flip-2-outline" onClick={this.upcoming}>
              Sélection aléatoire
            </FButton>
          </Col>
        </Row>

        <Row className="avancement-header">
          <Col className="tableau-header">
            <div className="float-right">
              Plus que <b className="big-number">{(this.state.data || []).length}</b> éléments à traduire, on lâche rien !
            </div>
          </Col>
        </Row>
        
        <div className="tableau">
          <Table responsive className="avancement-user-table">
            <thead>
              <tr>
                {this.state.headers.map((element,key) => (<th key={key}>{element}</th> ))}
              </tr>
            </thead>
            <tbody>
              <AvancementData />
            </tbody>
          </Table>
        </div>

        {/* <AvancementLangue 
          mainView={this.state.mainView}
          title={this.state.title}
          headers={this.state.headers}
          data={this.state.data}
          switchView={this.switchView}
        /> */}
      </div>
    );
  }
}

function shuffle(arr) {
  var i,
      j,
      temp;
  for (i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
  }
  return arr;    
};

const mapStateToProps = (state) => {
  return {
    dispositifs: state.dispositif.dispositifs,
  }
}

export default track({
    page: 'Avancement',
  })(
    connect(mapStateToProps)(
      withTranslation()(Avancement)
    )
  );