import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, Button, Card, CardBody, CardFooter, Collapse } from 'reactstrap';
import {NavLink} from 'react-router-dom';
import Cookies from 'js-cookie';

import API from '../../utils/API';
import data from './data'
import CustomCard from '../../components/UI/CustomCard/CustomCard';
import {randomColor} from '../../components/Functions/ColorFunctions';
import SpringButtonParkour from '../../components/UI/SpringButton/SpringButtonParkour';

import './ParkourOnBoard.scss';

let user={_id:null, cookies:{}};
class ParkourOnBoard extends Component {
  state = {
    dispositifs: [],
    open:new Array(data.length+1).fill(false),
    data: data,
    isToggleOpen:false,
    pinned:[],
  }
  
  componentDidMount (){
    this.getDispositifs(this.state.data);
    this.retrieveCookies();
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
    // let dataC=Cookies.getJSON('data');
    // if(dataC){ this.setState({data:data.map((x,key)=> {return {...x, value:dataC[key] || x.value}})})}
    // let pinnedC=Cookies.getJSON('pinnedC');
    // if(pinnedC){ this.setState({pinned:pinnedC})}
    // console.log(Cookies.get())
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

  render() {
    let QuestionItem = (props) => {
      return(
        <div className="question-line">
          {props.item.title}&nbsp;
          {this.state.open[props.id] ?
            <div className="buttons-wrapper" >
              <SpringButtonParkour 
                element={props.item}
                setValue={(key,item)=>this.setValue(key,item,props.id)}
                toggleButtons={()=>this.toggleButtons(props.id)} />
            </div>
            :
            <Button color={props.item.color} onClick={()=>this.toggleButtons(props.id)}>{props.item.value}</Button>
          }
          &nbsp;{props.item.title2}
        </div>
      )
    }
    return (
      <div className="animated fadeIn parkour-on-board">
        <Row className="full-width">
          <Col lg="6" className="left-panel">
            <h1>
              Découvrez les initiatives qui vous concernent : 
            </h1>
            <div className="questionnaire-main">
              {this.state.data.slice(0,3).map((item, id) =>  <QuestionItem key={id} item={item} id={id} />)}
              {!this.state.isToggleOpen && 
                <Button className="m-0 p-0 animated fadeIn continue-btn" color="info" onClick={this.toggle} aria-expanded={this.state.isToggleOpen} aria-controls="accordion">
                  <i className="fa fa-chevron-down"></i> Continuer le questionnaire
                </Button>
              }
              <Collapse isOpen={this.state.isToggleOpen} data-parent="accordion" id="accordion">
                {this.state.data.slice(3,this.state.data.length).map((item, id) =>  <QuestionItem key={id+3} item={item} id={id+3} />)}
                <Button className="m-0 p-0 animated fadeIn continue-btn" color="info" onClick={this.toggle} aria-expanded={this.state.isToggleOpen} aria-controls="accordion">
                  <i className="fa fa-chevron-up"></i> Réduire le questionnaire
                </Button>
              </Collapse>
            </div>
            <footer className="left-footer">
              <NavLink to="/parcours-perso">
                <Button color="danger" size="lg" block className="parcours-button">
                  <i className="cui-sort-ascending icons"></i> Voir mon parcours
                </Button>
              </NavLink>
            </footer>
          </Col>
          <Col lg="6" className="right-panel">
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
      </div>
    )
  }
}

export default track({
    page: 'ParkourOnBoard',
  })(
    withTranslation()(ParkourOnBoard)
  );

