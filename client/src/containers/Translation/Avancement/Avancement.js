import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';

import {languages} from './languagesData';
import {strings} from './stringsData';

import './Avancement.css';
import AvancementLangue from '../../../components/Translation/Avancement/AvancementLangue';

const diffData=[
  {
    title:'Avancement par langue',
    headers:['Langue', 'Drapeau', 'Avancement', 'Statut']
  },
  {
    title:'Avancement de ',
    headers:['Titre', 'Nombre de mots', 'Avancement', 'Statut']
  }
]

class Avancement extends Component {
  state={
    mainView:true,
    title: diffData[0].title,
    headers: diffData[0].headers,
    data: languages,
  }

  switchView= (mainView, element) =>{
    if(this.state.mainView){
      this.setState({
        mainView: false,
        title: diffData[1 * mainView].title + ' : ' + element.name,
        headers: diffData[1 * mainView].headers,
        data: strings
      })
    }else{
      this.props.history.push('/traduction')
    }
  }

  render(){
    return(
      <div className="animated fadeIn avancement">
        <AvancementLangue 
          mainView={this.state.mainView}
          title={this.state.title}
          headers={this.state.headers}
          data={this.state.data}
          switchView={this.switchView}
        />
      </div>
    );
  }
}

export default track({
    page: 'Avancement',
  })(
    withTranslation()(Avancement)
  );