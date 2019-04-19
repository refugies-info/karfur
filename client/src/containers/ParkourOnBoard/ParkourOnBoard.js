import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, Button, Card, CardBody, CardFooter, Collapse } from 'reactstrap';
import {NavLink} from 'react-router-dom';

import API from '../../utils/API';
import data from './data'
import CustomCard from '../../components/UI/CustomCard/CustomCard';
import {randomColor} from '../../components/Functions/ColorFunctions';
import SpringButtonParkour from '../../components/UI/SpringButton/SpringButtonParkour';

import './ParkourOnBoard.scss';

class ParkourOnBoard extends Component {
  state = {
    dispositifs: [],
    open:new Array(data.length+1).fill(false),
    data:data,
    isToggleOpen:false,
  }

  componentDidMount (){
    this.getDispositifs(this.state.data);
  }

  getDispositifs = (data) => {
    let filter={};
    data.map((x,id) => (id<3 || this.state.isToggleOpen) ? filter[x.queryName] = x.query || x.value : undefined);
    API.get_dispositif(filter).then(data_res => {
      let dispositifs=data_res.data.data;
      this.setState({
        dispositifs:dispositifs, 
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
  }

  toggle = () => {
    this.setState({isToggleOpen:!this.state.isToggleOpen},()=>this.getDispositifs(this.state.data))
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
              {this.state.dispositifs.map((dispositif) => {
                return (
                  <Col xs="12" sm="6" md="4" className="card-col" key={dispositif._id}>
                    <NavLink to={'/dispositif/'+dispositif._id}>
                      <CustomCard>
                        <CardBody>
                          <h3>{dispositif.titreInformatif}</h3>
                          <p>{dispositif.abstract}</p>
                        </CardBody>
                        <CardFooter className={"align-right bg-"+randomColor()}>{dispositif.titreMarque}</CardFooter>
                      </CustomCard>
                    </NavLink>
                  </Col>
                )}
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

