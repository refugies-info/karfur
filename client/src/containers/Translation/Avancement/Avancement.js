import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, Carousel, CarouselControl, CarouselItem, Col, Row, Progress, CardFooter, Table } from 'reactstrap';
import moment from 'moment/min/moment-with-locales';
import {NavLink} from 'react-router-dom';
import Swal from 'sweetalert2';
  
import track from 'react-tracking';

import API from '../../../utils/API'
import {colorAvancement} from '../../../components/Functions/ColorFunctions';
import {diffData} from './data';
import marioProfile from '../../../assets/mario-profile.jpg'

import './Avancement.scss';
import variables from 'scss/colors.scss';
import FButton from '../../../components/FigmaUI/FButton/FButton';

moment.locale('fr');

class Avancement extends Component {
  state={
    mainView:true,
    title: diffData.all.title,
    headers: diffData.all.headers,
    activeIndex: 0,

    langue:{},
    data: [],
    themes:[],
    itemId:null,
    isLangue: false,
    isExpert:false,
  }

  componentDidMount (){
    let itemId=this.props.match.params.id;
    let isLangue=this.props.location.pathname.includes('/langue');
    let isExpert=this.props.location.pathname.includes('/traductions');
    console.log(itemId, isLangue, isExpert)
    if(isLangue && itemId){
      let i18nCode=null;
      if(this.props.location.state && this.props.location.state.langue && this.props.location.state.langue.i18nCode){
        this.setState({langue:this.props.location.state.langue,
          title: diffData.traducteur.title + ' : ' + this.props.location.state.langue.langueFr,
          headers: diffData.traducteur.headers});
        i18nCode=this.props.location.state.langue.i18nCode;
      }else{
        this._loadLangue(itemId, isExpert);
      }
      this._loadArticles(itemId, i18nCode);
    }else if(isExpert){
      this._loadLangue(itemId, isExpert);
    }
    // this._loadThemes();
    this.setState({itemId:itemId, isExpert:isExpert, isLangue: isLangue})
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
          headers: diffData.traducteur.headers
        })
      })
    }
  }

  _loadTraductions=(langue) => {
    if(langue.i18nCode){
      API.get_tradForReview({'langueCible':langue.i18nCode, 'status' : 'En attente'},{},'articleId userId').then(data_res => {
        let articles=data_res.data.data;
        articles=articles.map(x => {return {_id:x._id,title:x.initialText.title,nombreMots:x.nbMots,avancement:{[langue.i18nCode]:1}, status:x.status, articleId:(x.articleId || {})._id, created_at:x.created_at, user:x.userId}});
        console.log(articles)
        this.setState({data:articles});
      })
    }
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

  switchView= (mainView, element) =>{
    console.log('A vérifier')
    // if(this.state.mainView){
    //   this.setState({
    //     mainView: false,
    //     title: diffData[1 * mainView].title + ' : ' + element.name,
    //     headers: diffData[1 * mainView].headers,
    //     data: strings
    //   })
    // }else{
    //   this.props.history.push('/traduction')
    // }
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

  goToTraduction = (article) => {
    this.props.history.push({
      pathname: '/traduction/'+ (this.state.isExpert ? 'validation/' : '') + article._id,
      search: '?id=' + this.state.langue._id,
      state: { langue: this.state.langue}
    })
  }

  upcoming = () => Swal.fire( 'Oh non!', 'Cette fonctionnalité n\'est pas encore activée', 'error')

  render(){
    const { activeIndex, langue } = this.state;
    const slides = this.state.themes.map((item, key) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={key}
        >
          <Row>
            {item.map((theme) => {
              return (
                <Col key={theme._id}>
                  <Card>
                    <CardHeader>
                      {theme.themeNom}
                    </CardHeader>
                    <CardBody>
                      {theme.themeDescription}
                      <br />
                      Texte de remplissage : Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                      laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation.
                    </CardBody>
                    <CardFooter>
                      Progression :
                      <Progress 
                        color={colorAvancement(theme.avancement)} 
                        value={theme.avancement*100} 
                        className="mb-3" />
                    </CardFooter>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </CarouselItem>
      );
    });

    const AvancementData = () => {
      if(this.props.match.params.id && this.state.data.length>0 && this.state.langue.i18nCode){
        return(
          this.state.data.map((element,key) => {
            const joursDepuis = (new Date().getTime() -  new Date(element.created_at).getTime()) / (1000 * 3600 * 24);
            return (
              <tr 
                key={element._id}
                className="avancement-row pointer"
                onClick={() => this.goToTraduction(element)} >
                <td className="align-middle">{element.isStructure ? "Site" : "Dispositif"}</td>
                <td className="align-middle">{(element.title.fr || element.title).slice(0,30) + ((element.title.fr || element.title).length > 30 ? "..." : "")}</td>
                <td className={"align-middle depuis " + (element.nombreMots > 100 ? "alert" : "success") }>
                  {element.nombreMots}
                </td>
                {this.props.isExpert ? 
                  <td className="align-middle">
                    <div>
                      {Math.round(((element.avancement || {})[this.state.langue.i18nCode] || 0) * 100)} %
                      {' (' + Math.round((element.nombreMots || 0) * (1-((element.avancement || {})[this.state.langue.i18nCode]) || 0)) + ' mots restants)'}
                    </div>
                    <Progress color={colorAvancement((element.avancement || {})[this.state.langue.i18nCode])} value={(element.avancement || {})[this.state.langue.i18nCode]*100} className="mb-3" />
                  </td> :
                  <td className="align-middle">
                    {element.user && [element.user].map((participant) => {
                      return ( 
                        <img
                          key={participant._id} 
                          src={participant.picture ? participant.picture.secure_url : marioProfile} 
                          className="profile-img-pin img-circle"
                          alt="random profiles"
                        />
                      );
                    })}
                  </td> }
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

        {false && <Row>
          <Col xs="24" xl="12">
            <Card>
              <CardHeader>
                <strong>Thèmes</strong>
              </CardHeader>
              <CardBody className="fixHeight">
                <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous}>
                  {slides}
                  <CarouselControl direction="prev" directionText="Précédent" onClickHandler={this.previous} />
                  <CarouselControl direction="next" directionText="Suivant" onClickHandler={this.next} />
                </Carousel>
              </CardBody>
            </Card>
          </Col>
        </Row>}
        
        <Row>
          <Col>
            <h2>
              <NavLink to="/backend/user-profile" className="my-breadcrumb">Mon profil / </NavLink>
              <NavLink to="/backend/user-dashboard" className="my-breadcrumb">Espace traduction / </NavLink>
              {langue.langueFr}
            </h2>
          </Col>
          <Col className="tableau-header align-right">
            <FButton type="outline-black" name="info-outline" fill={variables.noir} className="mr-10">
              Aide
            </FButton>
            <FButton type="dark" name="flip-2-outline">
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

export default track({
    page: 'Avancement',
  })(
    withTranslation()(Avancement)
  );