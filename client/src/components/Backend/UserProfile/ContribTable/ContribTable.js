import React from 'react';
import { Col, Row, Progress, Table } from 'reactstrap';
import Icon from 'react-eva-icons';
import {NavLink} from 'react-router-dom';

import marioProfile from '../../../../assets/mario-profile.jpg';
import {colorAvancement, colorStatut} from '../../../Functions/ColorFunctions';
import FButton from '../../../FigmaUI/FButton/FButton';

import variables from 'scss/colors.scss';
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

const contribTable = (props) => {
  let data = props.limit ? props.dataArray.slice(0,props.limit) : props.dataArray;
  let hideOnPhone = props.hideOnPhone || new Array(props.headers).fill(false)

  let table = (
    <Table responsive className="avancement-user-table">
      <thead>
        <tr>
          {props.headers.map((element,key) => (<th key={key} className={hideOnPhone[key] ? "hideOnPhone" : ""}>{element}</th> ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(0,props.limit).map((element,key) => {
          let titre = element.titreMarque + ' - ' + element.titreInformatif;
          return (
            <tr key={key} onClick={()=>props.history.push("/dispositif/"+element._id)}>
              <td className="align-middle">
                {props.windowWidth > 768 ? titre : (titre.slice(0,24) + (titre.length > 24 && "..."))}
              </td>
              <td className="align-middle">
                <div className={"status-pill bg-"+colorStatut(element.status)}>{element.status}</div>
              </td>
              <td className="align-middle hideOnPhone">
                <Row>
                  <Col>
                    <Progress color={colorAvancement(element.avancement)} value={element.avancement*100} className="mb-3" />
                  </Col>
                  <Col className={'text-'+colorAvancement(element.avancement)}>
                    {element.avancement === 1 ? 
                      <EVAIcon name="checkmark-circle-2" fill={variables.vert} /> :
                      <span>{Math.round((element.avancement || 0) * 100)} %</span> }
                  </Col>
                </Row>
              </td>
              <td className="align-middle langue-item hideOnPhone">
                <Icon name={element.creatorId===props.user._id ? "shield-outline" : "people-outline" } fill="#3D3D3D" size="large"/>&nbsp;
                {element.creatorId===props.user._id ? "Propriétaire" : "Contributeur" }
              </td>
              <td className="align-middle hideOnPhone">
                {element.participants && element.participants.map((participant) => {
                  return ( 
                    <img
                      key={participant._id} 
                      src={participant.picture ? participant.picture.secure_url : marioProfile} 
                      className="profile-img-pin img-circle"
                      alt="random profiles"
                    />
                  );
                })}
              </td>
              <td className="align-middle">
                <FButton tag={NavLink} to={"/dispositif/"+element._id} type="light-action" name="eye-outline" fill={variables.noir} />
              </td>
            </tr>
          );
        })}
        {props.limit && 
          <tr >
            <td colSpan="6" className="align-middle voir-plus" onClick={()=>props.toggleModal('contributions')}>
              <Icon name="expand-outline" fill="#3D3D3D" size="large"/>&nbsp;
              Voir plus
            </td>
          </tr>
        }
      </tbody>
    </Table>
  )
  
  let show=true;
  const onAnimationEnd = e => show=false;

  const onBtnClick = () => {
    if(props.overlayRedirect){
      props.history.push("/dispositif")
    }else{
      props.toggleModal('devenirContributeur')
    }
  }
  if(props.limit){
    return(
      <div className={"tableau-wrapper" + (props.hide ? " swing-out-top-bck" : "")} id="mes-contributions" onAnimationEnd={onAnimationEnd}>
        <Row>
          <Col>
            <h1>{props.title}</h1>
          </Col>
          {props.displayIndicators && props.contributeur &&
            <Col className="d-flex tableau-header">
              <Row className="full-width">
                <Col lg="3" md="4" sm="6" xs="12" className="d-flex left-element">
                  <h4>345</h4>
                  <span className="texte-small ml-10">mots rédigés</span>
                </Col>
                <Col lg="3" md="4" sm="6" xs="12" className="d-flex middle-element">
                  <h4>34</h4>
                  <span className="texte-small ml-10">minutes passées</span>
                </Col>
                <Col lg="3" md="4" sm="12" xs="12" className="d-flex right-element">
                  <h4>22</h4>
                  <span className="texte-small ml-10">
                    personnes
                    informées
                  </span>
                </Col>
                <Col lg="3" md="4" sm="12" xs="12">
                  <FButton tag={NavLink} to="/backend/user-dash-contrib" type="dark" name="file-add-outline">
                    Espace contribution
                  </FButton>
                </Col>
              </Row>
            </Col>}
        </Row>
  
        <div className="tableau">
          {table}

          {!props.contributeur &&
            <div className="ecran-protection no-contrib">
              {props.toggleSection && 
                <div className="close-box" onClick={()=>props.toggleSection('contributions')}>
                  <Icon name="eye-off-2-outline" fill={variables.noir} />
                  <u>Masquer</u>
                </div>}
              <div className="content-wrapper">
                <h1>{props.overlayTitle}</h1>
                <span>{props.overlaySpan}</span>
                <FButton type="light" name="info-outline" fill={variables.noir} onClick={onBtnClick} >
                  {props.overlayBtn}
                </FButton>
              </div>
            </div>}
        </div>
      </div>
    )
  }else if(show){
    return table
  }else{
    return false
  }
}

export default contribTable;