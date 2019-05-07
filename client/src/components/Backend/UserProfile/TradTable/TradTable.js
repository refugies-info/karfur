import React from 'react';
import { Col, Row, Progress, Table } from 'reactstrap';
import Icon from 'react-eva-icons';

import marioProfile from '../../../../assets/mario-profile.jpg';
import {colorAvancement, colorStatut} from '../../../Functions/ColorFunctions';

const tradTable = (props) => {
  let data = props.limit ? props.traductions.slice(0,props.limit) : props.traductions;
  
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
                {(element.initialText || {}).title}
              </td>
              <td className={"align-middle text-"+colorStatut(element.status)}>{element.status}</td>
              <td className="align-middle">
                <Row>
                  <Col>
                    <Progress color={colorAvancement(element.avancement)} value={element.avancement*100} className="mb-3" />
                  </Col>
                  <Col className={'text-'+colorAvancement(element.avancement)}>
                    {Math.round(element.avancement * 100)} %
                  </Col>
                </Row>
              </td>
              <td className="align-middle">
                <Icon name={element.userId===props.user._id ? "shield-outline" : "people-outline" } fill="#3D3D3D" size="large"/>&nbsp;
                {element.userId===props.user._id ? "Propriétaire" : "Contributeur" }
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
                <Icon name="eye-outline" fill="#3D3D3D" size="large"/>&nbsp;
                <u>Voir</u>
              </td>
            </tr>
          );
        })}
        {props.limit && 
          <tr >
            <td colSpan="6" className="align-middle voir-plus" onClick={props.toggleModal}>
              <Icon name="expand-outline" fill="#3D3D3D" size="large"/>&nbsp;
              Voir plus
            </td>
          </tr>
        }
      </tbody>
    </Table>
  )
  
  if(props.limit){
    return(
      <div className="tableau-wrapper" id="contributions">
        <h1>Mes traductions</h1>
        <div className="float-right update-profile">
          <Icon name="edit-outline" fill="#828282" className="edit-icon" size="large"/>
          <u>Changer mes objectifs</u>
        </div>
  
        <div className="tableau">
          <div className="d-flex tableau-header">
            <div className="right-element">
              <h4>22</h4>
              <span>personnes ont profité de votre contribution</span>
            </div>
          </div>
  
          {table}
        </div>
      </div>
    )
  }else{
    return table
  }
}

export default tradTable;