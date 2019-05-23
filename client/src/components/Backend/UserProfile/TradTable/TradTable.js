import React from 'react';
import { Col, Row, Progress, Table, Button } from 'reactstrap';
import Icon from 'react-eva-icons';
import {NavLink} from 'react-router-dom';

import marioProfile from '../../../../assets/mario-profile.jpg';
import {colorAvancement, colorStatut} from '../../../Functions/ColorFunctions';

const tradTable = (props) => {
  let data = props.limit ? props.dataArray.slice(0,props.limit) : props.dataArray;
  
  const langueItem = i18nCode => {
    let langue = props.langues.find(x => x.i18nCode === i18nCode);
    if(langue && langue.langueCode && langue.langueFr){
      return (
        <>
          <i className={'flag-icon flag-icon-' + langue.langueCode} title={langue.langueCode} id={langue.langueCode}></i>
          <span>{langue.langueFr}</span>
        </>
      )
    }else{return false}
  }
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
                    {Math.round((element.avancement || 0) * 100)} %
                  </Col>
                </Row>
              </td>
              <td className="align-middle langue-item">
                {langueItem(element.langueCible)}
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
                <NavLink to={"/traduction/"+element.articleId} className="no-decoration" >
                  <Icon name="eye-outline" fill="#3D3D3D" size="large"/>&nbsp;
                  <u>Voir</u>
                </NavLink>
              </td>
            </tr>
          );
        })}
        {props.limit && 
          <tr >
            <td colSpan="6" className="align-middle voir-plus" onClick={()=>props.toggleModal('traducteur')}>
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
        <Row>
          <Col>
            <h1>{props.title}</h1>
          </Col>
          <Col className="d-flex tableau-header">
            <div className="d-flex left-element">
              <h4>{props.motsRediges}</h4>
              <span>mots rédigés</span>
            </div>
            <div className="d-flex middle-element">
              <h4>{props.minutesPassees}</h4>
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

        <div className="tableau-footer">
          <Button>
            <NavLink to="/backend/user-dashboard" className="no-decoration" >
              <Icon name="options-2-outline" fill="#FFFFFF" />
              <span>Gérer mes traductions</span>
            </NavLink>
          </Button>
        </div>

        {!props.traducteur &&
          <div className="ecran-protection no-trad">
            <div className="close-box text-white">
              <Icon name="eye-off-2-outline" fill="#FFFFFF" />
              <u>Masquer</u>
            </div>
            <div className="content-wrapper">
              <h1>Ici, vous pourrez accéder à vos traductions</h1>
              <NavLink to="/backend/user-dashboard" className="no-decoration" >
                <Button>Commencer à traduire</Button>
              </NavLink>
            </div>
          </div>
        }
      </div>
    )
  }else{
    return table
  }
}

export default tradTable;