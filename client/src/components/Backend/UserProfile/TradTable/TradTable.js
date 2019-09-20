import React from 'react';
import { Col, Row, Progress, Table } from 'reactstrap';
import Icon from 'react-eva-icons';
import {NavLink} from 'react-router-dom';

import marioProfile from '../../../../assets/mario-profile.jpg';
import {colorAvancement, colorStatut} from '../../../Functions/ColorFunctions';
import FButton from '../../../FigmaUI/FButton/FButton';
import { fakeTraduction } from '../../../../containers/Backend/UserProfile/data';

import variables from 'scss/colors.scss';
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

const tradTable = (props) => {
  const traducteur = (props.dataArray || []).length > 0;
  const dataArray = traducteur ? props.dataArray : new Array(5).fill(fakeTraduction);
  let data = props.limit ? dataArray.slice(0,props.limit) : dataArray;
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
    <Table responsive className="avancement-user-table">
      <thead>
        <tr>
          {props.headers.map((element,key) => (<th key={key} className={hideOnPhone[key] ? "hideOnPhone" : ""}>{element}</th> ))}
        </tr>
      </thead>
      <tbody>
        {data.map((element,key) => {
          const titre= element.title || (element.initialText || {}).title || '';
          return (
            <tr 
              key={key} 
              onClick={() => props.history.push({
                pathname: "/traduction/" + (element.type || "string") + "/" + element.articleId, 
                search: '?id=' + ((props.langues || []).find(x => x.i18nCode === element.langueCible) || {})._id,
                state: { langue: (props.langues || []).find(x => x.i18nCode === element.langueCible)}
              })} >
              <td className="align-middle">
                {props.windowWidth > 768 ? titre : (titre.slice(0,24) + (titre.length > 24 ? "..." : ""))}
              </td>
              <td className="align-middle">
                <div className={"status-pill bg-"+colorStatut(element.status)}>{element.status}</div>
              </td>
              <td className="align-middle hideOnPhone">
                <Row>
                  <Col>
                    <Progress color={colorAvancement(element.avancement)} value={element.avancement*100} />
                  </Col>
                  <Col className={'text-'+colorAvancement(element.avancement)}>
                    {element.avancement === 1 ? 
                      <EVAIcon name="checkmark-circle-2" fill={variables.vert} /> :
                      <span>{Math.round((element.avancement || 0) * 100)} %</span> }
                  </Col>
                </Row>
              </td>
              <td className="align-middle langue-item">
                {langueItem(element.langueCible)}
              </td>
              <td className="align-middle hideOnPhone">
                {element.participants && element.participants.map((participant) => ( 
                  <img
                    key={participant._id} 
                    src={participant.picture ? participant.picture.secure_url : marioProfile} 
                    className="profile-img-pin img-circle"
                    alt="random profiles"
                  />
                ))}
              </td>
              <td className="align-middle">
                <FButton 
                  tag={NavLink} 
                  to={{
                    pathname: "/traduction/" + (element.type || "string") + "/" + element.articleId, 
                    search: '?id=' + ((props.langues || []).find(x => x.i18nCode === element.langueCible) || {})._id,
                    state: { langue: (props.langues || []).find(x => x.i18nCode === element.langueCible)}
                  }} 
                  type="light-action" 
                  name="eye-outline" 
                  fill={variables.noir} />
              </td>
            </tr>
          );
        })}
        {props.limit && dataArray.length > 5 && 
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
  const onAnimationEnd = () => show=false;

  const startTrad = () => {
    if(props.inUserDash){
      document.getElementById("progression-traduction").scrollIntoView({ behavior: 'smooth', block: 'end' });
    }else if(props.user.selectedLanguages && props.user.selectedLanguages.length>0){
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
          {props.displayIndicators && traducteur &&
            <Col className="d-flex tableau-header">
              <div className="full-width equi-reparti">
                <div className="d-flex left-element">
                  <h4>{props.motsRediges}</h4>
                  <span className="texte-small ml-10">mots<br/>rédigés</span>
                </div>
                <div className="d-flex middle-element">
                  <h4>{props.minutesPassees}</h4>
                  <span className="texte-small ml-10">minutes<br/>passées</span>
                </div>
                <div className="d-flex right-element">
                  <h4>22</h4>
                  <span className="texte-small ml-10">personnes<br/>informées</span>
                </div>
                <FButton tag={NavLink} to="/backend/user-dashboard" type="dark" name="file-add-outline">
                  Espace traduction
                </FButton>
              </div>
            </Col>}
        </Row>
  
        <div className="tableau">
          {table}

          {!traducteur &&
            <div className="ecran-protection no-trad">
              {/*props.toggleSection && 
                <div className="close-box text-white" onClick={()=>{props.toggleSection('traductions');}}>
                  <Icon name="eye-off-2-outline" fill="#FFFFFF" />
                  <u>Masquer</u>
              </div>*/}
              <div className="content-wrapper">
                <h1>{props.overlayTitle}</h1>
                <span>{props.overlaySpan}</span>
                <FButton type="light-action" name="play-circle-outline" fill={variables.noir} onClick={startTrad} >
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

export default tradTable;