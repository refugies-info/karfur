import React, { Component } from 'react';
import track from 'react-tracking';
import { Col, Row, Button, Progress, Badge, ListGroup, ListGroupItem, 
  Card, CardHeader, CardBody, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import ReactJoyride from 'react-joyride';

import Widget from './Widget'
import marioProfile from '../../../assets/mario-profile.jpg'
import {languages, past_translation, steps} from './data'
import {colorAvancement, colorStatut} from '../../../components/Functions/ColorFunctions'
import AvancementTable from '../../../components/Translation/Avancement/AvancementTable';

import './UserDash.scss';

const avancement_data={
  title: 'Avancement par langue',
  headers: ['Drapeau', 'Langue', 'Avancement', 'Traducteurs actifs', 'Traduction rapide','Voir les thèmes'],
  data: languages
}

const past_translation_data={
  title: 'Traductions récemment effectuées',
  headers: ['Drapeau', 'Langue', 'Texte traduit','Statut'],
  data: past_translation
}

class UserDash extends Component {
  state={
    images:[],
    runJoyRide:true
  }

  componentDidMount() {
    let images=[]
    var req = require.context('../../../assets/profile_pictures', false, /.*\.jpeg$/);
    req.keys().forEach(function(key){
      images.push(req(key))
    });
    this.setState({images:images})
  }

  navigateToDashLang = () => {
    console.log('clicked')
  }

  render() {
    return (
      <div className="animated fadeIn user-dash">
        <ReactJoyride
          continuous
          steps={steps}
          run={this.state.runJoyRide}
          scrollToFirstStep
          showProgress
          showSkipButton
        />
        <Row>
          <Col>
            <Row>
              <Col className="profile-col">
                <div className="profile-header-container">   
                  <img className="img-circle" src={marioProfile} alt="profile"/>
                  <div className="rank-label-container">
                      <span className="label label-default rank-label">Edit</span>
                  </div>
                </div> 
              </Col>
              <Col>
                <Row className="without-margin">
                  <span>Patricia </span>
                  <Badge className="space-it" pill color="success">Translation master</Badge>
                </Row>
                <br />
                <Row>
                  <Col xs="24" sm="12" lg="6">
                    <Widget 
                      color="success" 
                      header="835 mots traduits"
                      mainText="Encore 42 mots pour atteindre votre objectif quotidien"
                      value={"" +835/(835+42)*100}
                      smallText="Merci pour vos efforts !"
                      className="my-target-widget" />
                  </Col>
                  <Col xs="24" sm="12" lg="6">
                    <Widget 
                      color="warning" 
                      header="45 minutes de traduction"
                      mainText="Encore 15 minutes pour atteindre votre objectif quotidien"
                      value={"" +45/(45+15)*100}
                      smallText="Merci pour vos efforts !" />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col xs="1" className="etale-boutons">
            <Row className="align-items-center third-height">
                <Button block color="primary" className="btn-pill">Call to action</Button>
            </Row>
            <Row className="align-items-center third-height">
              <Button block color="success" className="btn-pill">Call to action</Button>
            </Row>
            <Row className="align-items-center third-height">
              <Button block color="warning" className="btn-pill">Call to action</Button>
            </Row>
          </Col>
        </Row>

        <Row>
          <AvancementTable 
            headers={avancement_data.headers}
            title={avancement_data.title}
            data={avancement_data.data}
            >
            {avancement_data.data.map((element,key) => {
              return (
                <tr 
                  key={key} 
                  onClick={this.navigateToDashLang}>
                  <td className="align-middle">
                    <i className={'flag-icon flag-icon-' + element.code + ' h1'} title={element.code} id={element.code}></i>
                  </td>
                  <td className="align-middle">{element.name}</td>
                  <td className="align-middle">
                    <div>
                      {Math.round(element.avancement * 100)} %
                    </div>
                    <Progress color={colorAvancement(element.avancement)} value={element.avancement*100} className="mb-3" />
                  </td>
                  <td className="align-middle">
                    {this.state.images.slice(element.premiere_image, element.premiere_image + element.nbParticipants).map((pathname, index) => {
                      return ( 
                          <img
                            key={index} 
                            src={pathname}
                            className="profile-img img-circle"
                            alt="random profiles"
                          />
                      );
                    })}
                  </td>
                  <td className="align-middle">
                    <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                      <Button block color="success">Accès rapide</Button>
                    </Col>
                  </td>
                  <td className="align-middle">
                    <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                      <Button block color="info">Voir les thèmes</Button>
                    </Col>
                  </td>
                </tr>
              );
            })}
          </AvancementTable>
        </Row>


        <Row>
          <Col>
            <AvancementTable 
              headers={past_translation_data.headers}
              title={past_translation_data.title}
              data={past_translation_data.data}
              >
              {past_translation_data.data.map((element,key) => {
                return (
                  <tr 
                    key={key} 
                    onClick={this.navigateToDashLang}>
                    <td className="align-middle">
                      <i className={'flag-icon flag-icon-' + element.code + ' h1'} title={element.code} id={element.code}></i>
                    </td>
                    <td className="align-middle">{element.name}</td>
                    <td className="align-middle">
                      {element.titre}
                    </td>
                    <td className="align-middle">
                      <Badge color={colorStatut(element.statut)}>{element.statut}</Badge>
                    </td>
                  </tr>
                );
              })}
            </AvancementTable>
          </Col>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i><strong>Conversation en cours</strong>
              </CardHeader>
              <CardBody>
                <ListGroup>
                  <ListGroupItem active action className="justify-content-between">
                    <ListGroupItemHeading>Les 3 petits cochons</ListGroupItemHeading>
                    <ListGroupItemText>
                      Comment traduire 'maison de briques' en anglais?
                    </ListGroupItemText>
                    <Badge className="float-right" pill color="success">14</Badge>
                  </ListGroupItem>
                  <ListGroupItem action className="justify-content-between">
                    <ListGroupItemHeading>Blanche neige et les 7 nains</ListGroupItemHeading>
                    <ListGroupItemText>
                      On s'accorde sur une traduction commune du nain en espagnol ?
                    </ListGroupItemText>
                    <Badge className="float-right" pill color="info">2</Badge>
                  </ListGroupItem>
                  <ListGroupItem action className="justify-content-between">
                    <ListGroupItemHeading>Les chiens aboient quand la caravane passe</ListGroupItemHeading>
                    <ListGroupItemText>
                      Ca ressemble à un proverbe non?
                    </ListGroupItemText>
                    <Badge className="float-right" pill color="warning">1</Badge>
                  </ListGroupItem>
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default track({
  page: 'UserDash',
})(UserDash);
