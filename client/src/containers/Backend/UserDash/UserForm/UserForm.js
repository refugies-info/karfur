import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row
} from 'reactstrap';
import track from 'react-tracking';
import 'rc-slider/assets/index.css';

import UserChange from '../../../../components/Backend/User/UserChange/UserChange'
import API from '../../../../utils/API'
import {languages} from './data'
import './UserForm.scss'

const nb_lignes = Math.ceil(languages.length / 3);
const reduced_languages=languages.reduce((acc, curr, i) => {
  if (i > 0 && i % nb_lignes === 0) {
    return {currGrp:[curr], groupedData: [...acc.groupedData, acc.currGrp]}
  }else if(i === languages.length-1){
    return {groupedData: [...acc.groupedData, [...acc.currGrp, curr]], currGrp:[]}
  }
  return {currGrp: [...acc.currGrp, curr], groupedData: acc.groupedData }
}, {currGrp: [], groupedData: []}).groupedData;

class UserForm extends Component {
  state={
    username:'Soufiane',
    languages: reduced_languages,
    selectedLanguages: languages.filter(item => item.isChecked).map(function (item) { return item.name; }),
    objectifTemps : 20,
    objectifMots : 600,
    email:'',
    description:''
  }
  
  handleCheck = (event) => {
    let languages = this.state.languages
    let selectedLanguages = this.state.selectedLanguages
    languages.forEach(colonne => {
      colonne.forEach(langue => {
        if (langue.name === event.target.value){
          if(false && event.target.checked){
            //A réactiver une fois le bud d'animation résolu
            selectedLanguages.push(langue.name)
          }else if(!event.target.checked){
            selectedLanguages=selectedLanguages.filter(item => item !== langue.name)
          }
          langue.isChecked =  event.target.checked
        }
      })
    })
    this.setState({
      languages: languages,
      selectedLanguages: selectedLanguages
    })
  }

  handleObjectifTempsChange = (value) => {
    this.setState({objectifTemps: value})
  }

  handleObjectifMotsChange = (value) => {
    this.setState({objectifMots: value})
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  validateForm = () => {
    let user={
      token: localStorage.getItem('token'),
      email:this.state.email,
      description:this.state.description,
      objectifTemps:this.state.objectifTemps,
      objectifMots:this.state.objectifMots,
    }
    console.log(user)
    API.set_user_info(user).then(data => {
      console.log('succes', data.data)
    },error => {
      console.log(error);
      return;
    })
  }
  render() {
    return (
      <div className="animated fadeIn user-form">
        <Card>
          <CardHeader>
            <strong>Formulaire</strong> Traducteur
          </CardHeader>
          <CardBody>
            <UserChange 
              handleCheck={this.handleCheck}
              handleObjectifTempsChange={this.handleObjectifTempsChange}
              handleObjectifMotsChange={this.handleObjectifMotsChange}
              handleChange={this.handleChange}
              {...this.state}
            />
          </CardBody>
          <CardFooter>
            <Row>
              <Col>
                <Button color="success" size="lg" block onClick={this.validateForm}>Valider</Button>
              </Col>
              <Col>
                <Button color="danger" size="lg" block>Annuler</Button>
              </Col>
            </Row>
          </CardFooter>
        </Card>
        
      </div>
    );
  }
}

export default track({
  page: 'UserForm',
}, { dispatchOnMount: true })(UserForm);
