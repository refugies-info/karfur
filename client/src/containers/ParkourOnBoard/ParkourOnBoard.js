import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, Button, Card, CardHeader, CardBody, CardFooter, Collapse, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {NavLink} from 'react-router-dom';
import Cookies from 'js-cookie';
import Icon from 'react-eva-icons';

import API from '../../utils/API';
import data from './data'
import CustomCard from '../../components/UI/CustomCard/CustomCard';
import {randomColor} from '../../components/Functions/ColorFunctions';
import SpringButtonParkour from '../../components/UI/SpringButton/SpringButtonParkour';
import AudioBtn from '../UI/AudioBtn/AudioBtn'

import './ParkourOnBoard.scss';

let user={_id:null, cookies:{}};
class ParkourOnBoard extends Component {
  state = {
    dispositifs: [],
    count_dispositifs:0,
    open:new Array(data.length+1).fill(false),
    data: data,
    isToggleOpen:false,
    pinned:[],
    showBookmarkModal:false
  }
  
  componentDidMount (){
    this.getDispositifs(this.state.data);
    this.retrieveCookies();
    API.count_dispositifs().then(data => {
      this.setState({ count_dispositifs:data.data })
    },function(error){console.log(error);return;})
  }

  getDispositifs = (data) => {
    let filter={};
    data.map((x,id) => (id<3 || this.state.isToggleOpen) ? filter[x.queryName] = x.query || x.value : undefined);
    API.get_dispositif(filter).then(data_res => {
      let dispositifs=data_res.data.data;
      this.setState({
        dispositifs:dispositifs.filter(x => !this.state.pinned.find( y => y._id === x._id)), 
      })
    },function(error){console.log(error);return;})
  }

  retrieveCookies = () => {
    Cookies.set('data', 'ici un test');
    let dataC=Cookies.getJSON('data');
    // if(dataC){ this.setState({data:data.map((x,key)=> {return {...x, value:dataC[key] || x.value}})})}
    let pinnedC=Cookies.getJSON('pinnedC');
    // if(pinnedC){ this.setState({pinned:pinnedC})}
    console.log(Cookies.get(), dataC, pinnedC)
    API.get_user_info().then(data_res => {
      let u=data_res.data.data;
      user={_id:u._id, cookies:u.cookies || {}}
      this.setState({
        pinned:user.cookies.parkourPinned || [],
        dispositifs:[...this.state.dispositifs].filter(x => !((user.cookies.parkourPinned || []).find( y=> y._id === x._id))),
        ...(user.cookies.parkourData && user.cookies.parkourData.length>0 && 
          {data:this.state.data.map((x,key)=> {return {...x, value:user.cookies.parkourData[key] || x.value}})})
      })
    },function(error){console.log(error);return;})
  }

  toggleButtons = (id) => {
    let prevState=[...this.state.open];
    prevState[id]=!prevState[id];
    this.setState({open:prevState.map((x,key)=> key===id ? x : false)})
  }

  setValue = (key,item, id) => {
    let state=[...this.state.data];
    state[id].value=item.name;
    if(item.query){state[id].query=item.query}
    this.setState({data:state});
    this.getDispositifs(state);
    this.toggleButtons(id);
    user.cookies.parkourData=state.map(x=>{return x.value});
    API.set_user_info(user);
    Cookies.set('data',state.map(x=>{return x.value}), {path:this.props.location.pathname})
  }

  toggle = () => {
    this.setState({isToggleOpen:!this.state.isToggleOpen},()=>this.getDispositifs(this.state.data))
  }

  pin = (e,dispositif) => {
    e.preventDefault();
    dispositif.pinned=!dispositif.pinned;
    let prevState=[...this.state.dispositifs];
    this.setState({
      dispositifs: prevState.map(x => {return x._id === dispositif._id ? {...x, hidden : dispositif.pinned, pinned: false} : x}),
      pinned: dispositif.pinned ? 
        [...this.state.pinned,dispositif] :
        this.state.pinned.filter(x=> x._id !== dispositif._id)
    },()=>{
      user.cookies.parkourPinned=this.state.pinned;
      API.set_user_info(user);
    })
  }

  _toggleBookmarkModal = () => {
    this.setState(prevState=>({showBookmarkModal:!prevState.showBookmarkModal}))
  }

  render() {
    let QuestionItem = (props) => {
      return(
        <div className="question-line">
          {props.item.title}&nbsp;
          <Button color={props.item.color} onClick={()=>this.toggleButtons(props.id)}>{props.item.value}</Button>
          &nbsp;{props.item.title2}
        </div>
      )
    }

    let SpringItem = (props) => {
      if(this.state.open[props.id]){
        return(
          <div className="buttons-wrapper" >
            <SpringButtonParkour 
              element={props.item}
              setValue={(key,item)=>this.setValue(key,item,props.id)}
              toggleButtons={()=>this.toggleButtons(props.id)} />
          </div>
        )
      }else{return false;}
    }

    return (
      <div className="animated fadeIn parkour-on-board">
        <Row className="full-width">
          <Col lg="6" className="left-panel">
            <Card>
              <CardHeader>
                Découvrez les initiatives qui vous concernent : 
              </CardHeader>
              <CardBody className="questionnaire-main">
                {this.state.data.slice(0,3).map((item, id) =>  <QuestionItem key={id} item={item} id={id} />)}
                {this.state.data.slice(0,3).map((item, id) => <SpringItem key={id} item={item} id={id} />)}
                
                {!this.state.isToggleOpen && 
                  <Button className="animated fadeIn continue-btn" color="secondary" onClick={this.toggle} aria-expanded={this.state.isToggleOpen} aria-controls="accordion">
                    <i className="fa fa-chevron-down"></i> Continuer le questionnaire
                  </Button>
                }
                <Collapse isOpen={this.state.isToggleOpen} data-parent="accordion" id="accordion">
                  {this.state.data.slice(3,this.state.data.length).map((item, id) =>  <QuestionItem key={id+3} item={item} id={id+3} />)}
                  {this.state.data.slice(3,this.state.data.length).map((item, id) => <SpringItem key={id+3} item={item} id={id+3} />)}
                
                  <Button className="m-0 p-0 animated fadeIn continue-btn" color="info" onClick={this.toggle} aria-expanded={this.state.isToggleOpen} aria-controls="accordion">
                    <i className="fa fa-chevron-up"></i> Réduire le questionnaire
                  </Button>
                </Collapse>
              </CardBody>
              <CardFooter>
                <Button color="white" className="btn-pill bookmark-button" onClick={this._toggleBookmarkModal}>
                  <Icon name="bookmark-outline" fill="#3D3D3D"/>
                </Button>
                <NavLink to="/parcours-perso">
                  <Button size="lg" className="parcours-button">
                    <Icon name="options-2-outline" fill="#FFFFFF"/> &nbsp;
                    Voir mon parcours
                  </Button>
                </NavLink>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="6" className="right-panel">
            <div className="header">
              {this.state.dispositifs.length} résultat{this.state.dispositifs.length>1 && "s"} sur {this.state.count_dispositifs}
              <AudioBtn />
            </div>
            <Row>
              {[...this.state.pinned,...this.state.dispositifs].slice(0,8).map((dispositif) => {
                if(!dispositif.hidden){
                  return (
                    <Col xs="12" sm="6" md="4" className="card-col puff-in-center" key={dispositif._id}>
                      <NavLink to={'/dispositif/'+dispositif._id}>
                        <CustomCard>
                          <CardBody>
                            <i onClick={(e)=>this.pin(e,dispositif)} className={"fa fa-map-pin pin-icon" + (dispositif.pinned ? " active" : "")}></i>
                            <h3>{dispositif.titreInformatif}</h3>
                            <p>{dispositif.abstract}</p>
                          </CardBody>
                          <CardFooter className={"align-right bg-"+randomColor()}>{dispositif.titreMarque}</CardFooter>
                        </CustomCard>
                      </NavLink>
                    </Col>
                  )
                }else{
                  return false
                }}
              )}
              <Col xs="12" sm="6" md="4" className="card-col">
                <NavLink to={'/dispositif'}>
                  <CustomCard addcard="true" onClick={this.goToDispositif}>
                    <CardBody>
                      <span className="add-sign">+</span>
                    </CardBody>
                    <CardFooter className={"align-right bg-secondary"}>Créer un nouveau dispositif</CardFooter>
                  </CustomCard>
                </NavLink>
              </Col>
            </Row>
          </Col>
        </Row>
        <Modal isOpen={this.state.showBookmarkModal} toggle={this._toggleBookmarkModal} className="bookmark-modal">
          <ModalHeader>
            <span>Recherche sauvegardée</span>
            <i className="bookmark-icon">
              <Icon name="bookmark" fill="#F6B93B" size="xlarge" />
            </i>
          </ModalHeader>
          <ModalBody>
            Votre recherche est désormais disponible dans votre profil dans la rubrique&nbsp;
            <NavLink to="/"><b>Mes recherches</b></NavLink>
          </ModalBody>
          <ModalFooter>
            <Button block color="secondary" onClick={this._toggleBookmarkModal} className="btn-go">
              <Icon name="arrow-forward-outline" fill="#3D3D3D" size="large" />
              Aller voir
            </Button>
            <Button block color="success" onClick={this._toggleBookmarkModal}>Ok merci</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default track({
    page: 'ParkourOnBoard',
  })(
    withTranslation()(ParkourOnBoard)
  );

