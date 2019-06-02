import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, Carousel, CarouselControl, CarouselItem, Col, Row, Progress, CardFooter, Badge } from 'reactstrap';
import moment from 'moment/min/moment-with-locales';
  
import AvancementTable from '../../../components/Translation/Avancement/AvancementTable'
import track from 'react-tracking';

import API from '../../../utils/API'
import {colorAvancement, colorStatut} from '../../../components/Functions/ColorFunctions'
import {languages} from './languagesData';
import {strings} from './stringsData';
import {themes} from './themesData';
import {diffData} from './data';

import './Avancement.scss';
import AvancementLangue from '../../../components/Translation/Avancement/AvancementLangue/AvancementLangue';

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
      API.get_tradForReview({'langueCible':langue.i18nCode, 'status' : 'En attente'},{},'articleId').then(data_res => {
        let articles=data_res.data.data;
        articles=articles.map(x => {return {_id:x._id,title:x.initialText.title,nombreMots:x.nbMots,avancement:{[langue.i18nCode]:1},status:x.status, articleId:(x.articleId || {})._id}});
        console.log(articles)
        // this.setState({data:articles});
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
            return (
              <tr 
                key={element._id}
                className="avancement-row pointer"
                onClick={() => this.goToTraduction(element)} >
                <td className="align-middle">{element.title.fr || element.title}</td>
                <td className="align-middle">
                  {element.nombreMots}
                </td>
                <td className="align-middle">
                  <div>
                    {Math.round(((element.avancement || {})[this.state.langue.i18nCode] || 0) * 100)} %
                    {' (' + Math.round((element.nombreMots || 0) * (1-((element.avancement || {})[this.state.langue.i18nCode]) || 0)) + ' mots restants)'}
                  </div>
                  <Progress color={colorAvancement((element.avancement || {})[this.state.langue.i18nCode])} value={(element.avancement || {})[this.state.langue.i18nCode]*100} className="mb-3" />
                </td>
                <td className="align-middle">
                  <Badge color={colorStatut(element.status)}>{moment(element.created_at).fromNow()}</Badge>
                </td>
              </tr>
            );
          })
        )
      }else{return (<tr><td>Chargement</td><td>Chargement</td><td>Chargement</td><td>Chargement</td></tr>)}
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
        
        <Row className="avancement-header">
          <Col className="d-inline-flex align-items-end tableau-header">
            <i className={'h1 flag-icon flag-icon-' + langue.langueCode} title={langue.langueCode} id={langue.langueCode}></i>
            <h1>{langue.langueFr}</h1>
            <Progress 
              color={colorAvancement(langue.avancement)} 
              value={langue.avancement*100} />
            <span className={"chiffre-avancement text-" + colorAvancement(langue.avancement)}>{Math.round((langue.avancement || 0)*100)} %</span>
          </Col>
          <Col className="tableau-header">
            <div className="float-right">
              Plus que <b className="big-number">{(this.state.data || []).length}</b> éléments à traduire, on lâche rien !
            </div>
          </Col>
        </Row>

        <AvancementTable headers={this.state.headers} >
          <AvancementData />
        </AvancementTable>
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