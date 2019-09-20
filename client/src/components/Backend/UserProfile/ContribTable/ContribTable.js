import React from 'react';
import { Col, Row, Progress, Table } from 'reactstrap';
import Icon from 'react-eva-icons';
import {NavLink} from 'react-router-dom';
import Swal from 'sweetalert2';

import marioProfile from '../../../../assets/mario-profile.jpg';
import {colorStatut} from '../../../Functions/ColorFunctions';
import FButton from '../../../FigmaUI/FButton/FButton';
import { fakeContribution } from '../../../../containers/Backend/UserProfile/data';

import variables from 'scss/colors.scss';

const contribTable = (props) => {
  const contributeur = (props.dataArray || []).length > 0;
  const dataArray = contributeur ? props.dataArray : new Array(5).fill(fakeContribution);
  let data = props.limit ? dataArray.slice(0,props.limit) : dataArray;
  let hideOnPhone = props.hideOnPhone || new Array(props.headers).fill(false)

  const deleteContrib = (e, dispositif) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "La suppression d'un dispositif est irréversible",
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: variables.rouge,
      cancelButtonColor: variables.vert,
      confirmButtonText: 'Oui, le supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value) {
        const newDispositif = {
          dispositifId: dispositif._id,
          status: "Supprimé"
        }
        props.deleteContrib(newDispositif, props.type);
      }
    })
  }

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
                {element.participants && element.participants.map((participant, key) => {
                  return ( 
                    <img
                      key={key} 
                      src={participant.picture ? participant.picture.secure_url : marioProfile} 
                      className="profile-img-pin img-circle"
                      alt="random profiles"
                    />
                  );
                })}
              </td>
              <td className="align-middle pointer fit-content">
                {(props.type !== "user" || ["En attente non prioritaire", "Brouillon", "Rejeté structure", "Rejeté admin", "Inactif"].includes(element.status) ) &&
                  <FButton type="light-action" name="trash-outline" fill={variables.noir} onClick={e => deleteContrib(e, element)} />}                
              </td>
              <td className="align-middle">
                <FButton tag={NavLink} to={"/dispositif/"+element._id} type="light-action" name="eye-outline" fill={variables.noir} />
              </td>
            </tr>
          );
        })}
        {props.limit && dataArray.length > 5 && 
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
    // if(props.overlayRedirect){
      props.history.push("/dispositif")
    // }else{
    //   props.toggleModal('devenirContributeur')
    // }
  }
  if(props.limit){
    return(
      <div className={"tableau-wrapper" + (props.hide ? " swing-out-top-bck" : "")} id="mes-contributions" onAnimationEnd={onAnimationEnd}>
        <Row>
          <Col>
            <h1>{props.title}</h1>
          </Col>
          {props.displayIndicators && contributeur &&
            <Col className="d-flex tableau-header">
              <div className="full-width equi-reparti">
                <div className="d-flex left-element">
                  <h4>345</h4>
                  <span className="texte-small ml-10">mots<br/>rédigés</span>
                </div>
                <div className="d-flex middle-element">
                  <h4>34</h4>
                  <span className="texte-small ml-10">minutes<br/>passées</span>
                </div>
                <div className="d-flex right-element">
                  <h4>22</h4>
                  <span className="texte-small ml-10">personnes<br/>informées</span>
                </div>
                <div>
                  <FButton tag={NavLink} to="/backend/user-dash-contrib" type="dark" name="file-add-outline">
                    Espace contribution
                  </FButton>
                </div>
              </div>
            </Col>}
        </Row>
  
        <div className="tableau">
          {table}

          {!contributeur &&
            <div className="ecran-protection no-contrib">
              {/*props.toggleSection && 
               <div className="close-box" onClick={()=>props.toggleSection('contributions')}>
                  <Icon name="eye-off-2-outline" fill={variables.noir} />
                  <u>Masquer</u>
              </div>*/}
              <div className="content-wrapper">
                <h1>{props.overlayTitle}</h1>
                <span>{props.overlaySpan}</span>
                <FButton type="light-action" name="info-outline" fill={variables.noir} onClick={onBtnClick} >
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