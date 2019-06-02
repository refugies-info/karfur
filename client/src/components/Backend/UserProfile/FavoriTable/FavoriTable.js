import React from 'react';
import { Col, Row, Progress, Table, Button } from 'reactstrap';
import Icon from 'react-eva-icons';
import {NavLink} from 'react-router-dom';

import marioProfile from '../../../../assets/mario-profile.jpg';
import {colorAvancement, colorStatut} from '../../../Functions/ColorFunctions';
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

const favoriTable = (props) => {
  let data = props.limit ? props.dataArray.slice(0,props.limit) : props.dataArray;
  
  const goToDispositif = (dispositif) => props.history.push("/dispositif/" + dispositif._id)
  const searchTag = tag => props.history.push({ pathname:"/dispositifs", search: '?tag=' + tag })

  let table = (
    <Table responsive striped className="avancement-user-table">
      <thead>
        <tr>
          {props.headers.map((element,key) => (<th key={key}>{element}</th> ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(0,props.limit).map((element,key) => {
          return (
            <tr key={key} >
              <td className="align-middle">
                <Icon name="bookmark" fill="#3D3D3D" id="bookmarkBtn" />  
              </td>
              <td className="align-middle pointer" onClick={()=>goToDispositif(element)}>
                {element.titreMarque + ' - ' + element.titreInformatif} 
              </td>
              <td className="align-middle">
                {(element.tags || []).map((tag, key) => {
                  return ( 
                    <Button key={key} color="warning" outline className="tag-btn" onClick={()=>searchTag(tag)}>
                      {tag}
                    </Button>
                  );
                })}
              </td>
              <td className="align-middle pointer" onClick={()=>props.removeBookmark(element._id)}>
                <Icon name="close-circle-outline" fill="#3D3D3D"/>
                <u>Supprimer</u>
              </td>
            </tr>
          );
        })}
        {props.limit && 
          <tr >
            <td colSpan="6" className="align-middle voir-plus" onClick={()=>props.toggleModal('favori')}>
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
      <div className="tableau-wrapper" id="mes-favoris">
        <Row>
          <Col>
            <h1>{props.title}</h1>
          </Col>
          <Col className="d-flex tableau-header no-margin pointer" lg="1">
            <div className="d-flex left-element" onClick={()=>props.removeBookmark('all')}>
              <span> <u>Tout supprimer</u> </span>
            </div>
          </Col>
        </Row>
  
        <div className="tableau">
          {table}
        </div>

        {!props.hasFavori &&
          <div className="ecran-protection no-fav">
            <div className="content-wrapper">
              <h1>Retrouvez ici vos pages favorites</h1>
              <div className="sous-contenu">
                Sauvegardez-les en cliquant sur cette icône dans les dispositifs :
                <EVAIcon name="bookmark-outline" fill="#3D3D3D" className="bookmark-icon" /> 
              </div>
            </div>
          </div>}
      </div>
    )
  }else{
    return table
  }
}

export default favoriTable;