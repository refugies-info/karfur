import React from 'react';
import { Col, Row, Progress, Table, Button } from 'reactstrap';
import Icon from 'react-eva-icons';
import {NavLink} from 'react-router-dom';

import marioProfile from '../../../../assets/mario-profile.jpg';
import {colorAvancement, colorStatut} from '../../../Functions/ColorFunctions';

const contribTable = (props) => {
  let data = props.limit ? props.dataArray.slice(0,props.limit) : props.dataArray;
  
  let table = (
    <Table responsive striped className="avancement-user-table">
      <thead>
        <tr>
          {props.headers.map((element,key) => {
            return (
              <th key={key}>{element}</th>
            )}
          )}
        </tr>
      </thead>
      <tbody>
        {data.slice(0,props.limit).map((element,key) => {
          return (
            <tr key={key} >
              <td className="align-middle">
                {element.titreMarque + ' - ' + element.titreInformatif} 
              </td>
              <td className={"align-middle text-"+colorStatut(element.status)}>{element.status}</td>
              <td className="align-middle">
                <Row>
                  <Col>
                    <Progress color={colorAvancement(element.avancement)} value={element.avancement*100} className="mb-3" />
                  </Col>
                  <Col className={'text-'+colorAvancement(element.avancement)}>
                    {Math.round((element.avancement || 0) * 100)} %
                  </Col>
                </Row>
              </td>
              <td className="align-middle langue-item">
                <Icon name={element.creatorId===props.user._id ? "shield-outline" : "people-outline" } fill="#3D3D3D" size="large"/>&nbsp;
                {element.creatorId===props.user._id ? "Propriétaire" : "Contributeur" }
              </td>
              <td className="align-middle">
                {element.participants && element.participants.map((participant) => {
                  return ( 
                    <img
                      key={participant._id} 
                      src={participant.picture ? participant.picture.secure_url : marioProfile} 
                      className="profile-img img-circle"
                      alt="random profiles"
                    />
                  );
                })}
              </td>
              <td className="align-middle">
                <NavLink to={"/dispositif/"+element._id} className="no-decoration" >
                  <Icon name="eye-outline" fill="#3D3D3D" size="large"/>&nbsp;
                  <u>Voir</u>
                </NavLink>
              </td>
            </tr>
          );
        })}
        {props.limit && 
          <tr >
            <td colSpan="6" className="align-middle voir-plus" onClick={()=>props.toggleModal('contributeur')}>
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
      <div className={"tableau-wrapper" + (props.hide ? "swing-out-top-bck" : "")} id="mes-contributions" onAnimationEnd={onAnimationEnd}>
        <Row>
          <Col>
            <h1>{props.title}</h1>
          </Col>
          <Col className="d-flex tableau-header">
            <div className="d-flex left-element">
              <h4>345</h4>
              <span>mots rédigés</span>
            </div>
            <div className="d-flex middle-element">
              <h4>34</h4>
              <span>minutes passées</span>
            </div>
            <div className="d-flex right-element">
              <h4>22</h4>
              <span>personnes informées</span>
            </div>
          </Col>
        </Row>
  
        <div className="tableau">
          {table}
        </div>

        {!props.overlayRedirect && 
          <div className="tableau-footer">
            <Button>
              <NavLink to="/backend/user-dash-contrib" className="no-decoration" >
                <Icon name="options-2-outline" fill="#FFFFFF" />
                <span>Gérer mes articles</span>
              </NavLink>
            </Button>
          </div>}

        {!props.contributeur &&
          <div className="ecran-protection no-contrib">
            {props.toggleSection && 
              <div className="close-box text-white" onClick={()=>props.toggleSection('contributions')}>
                <Icon name="eye-off-2-outline" fill="#FFFFFF" />
                <u>Masquer</u>
              </div>}
            <div className="content-wrapper">
              <h1>{props.overlayTitle}</h1>
              <span>{props.overlaySpan}</span>
              <Button onClick={onBtnClick}>
                <Icon name="award-outline" fill="#3D3D3D" />{' '}
                {props.overlayBtn}
              </Button>
            </div>
          </div>
        }
      </div>
    )
  }else if(show){
    return table
  }else{
    return false
  }
}

export default contribTable;