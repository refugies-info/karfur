import React from 'react';
import { Col, Row, Progress, Table, Button } from 'reactstrap';
import Icon from 'react-eva-icons';
import {NavLink} from 'react-router-dom';

import marioProfile from '../../../../assets/mario-profile.jpg';
import {colorAvancement, colorStatut} from '../../../Functions/ColorFunctions';
import SVGIcon from '../../../UI/SVGIcon/SVGIcon';

const tradTable = (props) => {
  let data = props.limit ? props.dataArray.slice(0,props.limit) : props.dataArray;
  let hideOnPhone = props.hideOnPhone || new Array(props.headers).fill(false)

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
          {props.headers.map((element,key) => (<th key={key} className={hideOnPhone[key] ? "hideOnPhone" : ""}>{element}</th> ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(0,props.limit).map((element,key) => {
          let titre= (element.initialText || {}).title || '';
          return (
            <tr key={key} >
              <td className="align-middle">
                {props.windowWidth > 768 ? titre : (titre.slice(0,24) + (titre.length > 24 && "..."))}
              </td>
              <td className={"align-middle text-"+colorStatut(element.status)}>{element.status}</td>
              <td className="align-middle hideOnPhone">
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
              <td className="align-middle hideOnPhone">
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
                  <Icon name="eye-outline" fill="#3D3D3D" size="large"/>
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
  
  let show=true;
  const onAnimationEnd = e => show=false;

  const startTrad = () => {
    if(props.user.selectedLanguages && props.user.selectedLanguages.length>0){
      props.history.push("/backend/user-dashboard")
    }else{
      props.toggleModal('devenirTraducteur')
    }
  }

  if(props.limit && show){
    return(
      <div className={"tableau-wrapper" + (props.hide ? " swing-out-top-bck" : "")} id="mes-traductions" onAnimationEnd={onAnimationEnd}>
        <Row>
          <Col>
            <h1>{props.title}</h1>
          </Col>
          <Col className="d-flex tableau-header">
            <Row className="full-width">
              <Col lg="auto" md="4" sm="6" xs="12" className="d-flex left-element">
                <h4>{props.motsRediges}</h4>
                <span>mots rédigés</span>
              </Col>
              <Col lg="auto" md="4" sm="6" xs="12" className="d-flex middle-element">
                <h4>{props.minutesPassees}</h4>
                <span>minutes passées</span>
              </Col>
              <Col lg="auto" md="4" sm="12" xs="12" className="d-flex right-element">
                <h4>22</h4>
                <span>personnes informées</span>
              </Col>
            </Row>
          </Col>
        </Row>
  
        <div className="tableau">
          {table}
        </div>

        <div className="tableau-footer">
          <NavLink to="/backend/user-dashboard" className="no-decoration" >
            <Button>
              <Icon name="options-2-outline" fill="#FFFFFF" />
              <span>Gérer mes traductions</span>
            </Button>
          </NavLink>
        </div>

        {!props.traducteur &&
          <div className="ecran-protection no-trad">
            {props.toggleSection && 
              <div className="close-box text-white" onClick={()=>{props.toggleSection('traductions');}}>
                <Icon name="eye-off-2-outline" fill="#FFFFFF" />
                <u>Masquer</u>
              </div>}
            <div className="content-wrapper">
              <h1>{props.overlayTitle}</h1>
              <span>{props.overlaySpan}</span>
              <Button onClick={startTrad}>
                <SVGIcon name="translate" />{' '}
                {props.overlayBtn}
              </Button>
            </div>
          </div>}
      </div>
    )
  }else if(show){
    return table
  }else{
    return false
  }
}

export default tradTable;