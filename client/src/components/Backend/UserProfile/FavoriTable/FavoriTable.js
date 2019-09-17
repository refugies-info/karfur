import React from 'react';
import { Col, Row, Table, Button } from 'reactstrap';
import Icon from 'react-eva-icons';
import {NavLink} from 'react-router-dom';
import moment from 'moment/min/moment-with-locales';

import EVAIcon from '../../../UI/EVAIcon/EVAIcon';
import FButton from '../../../FigmaUI/FButton/FButton';

import variables from 'scss/colors.scss';

moment.locale('fr');

const favoriTable = (props) => {
  let data = props.limit ? props.dataArray.slice(0,props.limit) : props.dataArray;
  
  const goToDispositif = (dispositif) => props.history.push("/dispositif/" + dispositif._id)
  const searchTag = tag => props.history.push({ pathname:"/advanced-search", search: '?tag=' + tag })

  let table = (
    <Table responsive className="avancement-user-table">
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
                <EVAIcon name="bookmark" fill={variables.noir} id="bookmarkBtn" />  
              </td>
              <td className="align-middle pointer" onClick={()=>goToDispositif(element)}>
                {element.titreMarque + ' - ' + element.titreInformatif} 
              </td>
              <td className="align-middle">
                {(element.tags || []).map((tag, key) => {
                  return ( 
                    <Button key={key} color="warning" className="tag-btn" onClick={()=>searchTag(tag.short)}>
                      {tag.short}
                    </Button>
                  );
                })}
              </td>
              <td className="align-middle">
                {element.datePin ? moment(element.datePin).fromNow() : ""}
              </td>
              <td className="align-middle fit-content" onClick={()=>props.removeBookmark(element._id)}>
                <FButton type="light-action" name="trash-2-outline" fill={variables.noir} />
              </td>
              <td className="align-middle fit-content">
                <NavLink to={"/dispositif/"+element._id} className="no-decoration" >
                  <FButton type="light-action" name="eye-outline" fill={variables.noir} />
                </NavLink>
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
        </Row>
  
        <div className="tableau">
          {table}

          {!props.hasFavori &&
            <div className="ecran-protection no-fav">
              <div className="content-wrapper">
                <h1>Retrouvez ici vos pages favorites</h1>
                <div className="sous-contenu">
                  Cherchez ce bouton dans les contenus pour les sauvegarder :
                  <EVAIcon name="bookmark-outline" fill={variables.noir} className="bookmark-icon" /> 
                </div>
              </div>
            </div>}
        </div>
      </div>
    )
  }else{
    return table
  }
}

export default favoriTable;