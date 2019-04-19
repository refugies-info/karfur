import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import ScrollableAnchor, { goToAnchor, configureAnchors } from 'react-scrollable-anchor';

import data from './data';
import API from '../../utils/API';
import ParkourNow from '../../components/Frontend/ParkourPerso/ParkourNow';

import './ParkourPerso.scss';

configureAnchors({offset: -60})

class ParkourPerso extends Component {
  state = {
    etapes:data.map((x,id)=> {return {...x, active:id===1}}),
    dispositifs: [],
    articles: [],
    demarches:data.map(x=> {return {...x, checked:false}}),
  }

  componentDidMount (){
    this.getDispositifs({}, 3);
    this.getArticles({}, 3);
  }

  getDispositifs = (filter = {}, limit=null) => {
    API.get_dispositif(filter,{},'', limit).then(data_res => {
      this.setState({
        dispositifs:data_res.data.data.map(x=> {return {...x, checked:false}}), 
      })
    },function(error){console.log(error);return;})
  }

  getArticles = (filter = {}, limit=null) => {
    API.get_article(filter,'fr',{},'', limit).then(data_res => {
      this.setState({
        articles:data_res.data.data.map(x=> {return {...x, checked:false}}), 
      })
    },function(error){console.log(error);return;})
  }

  checkItem = (key, name, etape=null) => {
    let prevState=[...this.state[name + 's']];
    prevState[key].checked = !prevState[key].checked;
    this.setState({[name + 's']: prevState})
    if(name==='demarche'){
      this.setActive(Math.min(key+etape+1, this.state.demarches.length-1));
      goToAnchor('etape-'+Math.min(key+etape+1, this.state.demarches.length-1))
    }
  }

  setActive = (key) => {
    this.setState({etapes: data.map((x,id)=> {return {...x, active:id===key}})})
  }

  render() {
    return (
      <div className="animated fadeIn parkour-perso">
        {this.state.etapes.map((etape, key) => {
          return (
            <div className={"timeline-item" + (etape.active ? " active":"")} key={key}>
              <ScrollableAnchor id={'etape-' + key}>
                <h1 onClick={()=>this.setActive(key)}>{etape.title}</h1>
              </ScrollableAnchor>
              {etape.active && <ParkourNow checkItem={this.checkItem} etape={key} {...this.state}/>}
            </div>
          )}
        )}
      </div>
    )
  }
}

export default track({
    page: 'ParkourPerso',
  })(
    withTranslation()(ParkourPerso)
  );

