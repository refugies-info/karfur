import React from 'react';
import { Col, Row, Table, Button } from 'reactstrap';
import Icon from 'react-eva-icons';
import moment from 'moment/min/moment-with-locales';

import EVAIcon from '../../../UI/EVAIcon/EVAIcon';
import { countrySide } from "../../../../assets/figma/index"

import variables from 'scss/colors.scss';
import FButton from '../../../FigmaUI/FButton/FButton';

moment.locale('fr');

const actionTable = (props) => {
  let data = props.limit ? [...props.dataArray].slice(0,props.limit) : props.dataArray;
  let hideOnPhone = props.hideOnPhone || new Array(props.headers).fill(false)

  const jsUcfirst = string => {return string && string.length > 1 && (string.charAt(0).toUpperCase() + string.slice(1, string.length - 1))}

  let table = (
    <Table responsive className="avancement-user-table">
      <thead>
        <tr>
          {props.headers.map((element,key) => (<th key={key} className={hideOnPhone[key] ? "hideOnPhone" : ""}>{element}</th> ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(0,props.limit).map((element,key) => {
          const joursDepuis = (new Date().getTime() -  new Date(element.depuis).getTime()) / (1000 * 3600 * 24);
          return (
            <tr key={key} onClick={()=>props.showSuggestion(element)}>
              <td className="align-middle">
                <div className="dot-circle" />
              </td>
              <td className="align-middle">
                {element.titre} 
              </td>
              <td className="align-middle hideOnPhone">
                <Icon name={element.owner ? "shield-outline" : "people-outline" } fill="#3D3D3D" size="large"/>&nbsp;
                {element.owner ? "Propriétaire" : "Contributeur" }
              </td>
              <td className="align-middle">
                <EVAIcon className="mr-8" name={element.action === "questions" ? "question-mark-circle-outline" : "bulb-outline"} fill={variables.noir} />
                {jsUcfirst(element.action)}
              </td>
              <td className={"align-middle hideOnPhone depuis " + (joursDepuis > 3 ? "alert" : "success") }>
                {element.depuis ? moment(element.depuis).fromNow() : ""}
              </td>
              <td className="align-middle pointer fit-content" onClick={e=>{e.stopPropagation();props.archive(element)}}>
                <FButton type="light-action" name="archive-outline" fill={variables.noir} />
              </td>
              <td className="align-middle pointer fit-content" onClick={()=>props.showSuggestion(element)}>
                <FButton type="light-action" name="eye-outline" fill={variables.noir} />
              </td>
            </tr>
          );
        })}
        {props.limit && 
          <tr >
            <td colSpan="6" className="align-middle voir-plus" onClick={()=>props.toggleModal('action')}>
              <Icon name="expand-outline" fill="#3D3D3D"/>&nbsp;
              Voir plus
            </td>
          </tr>
        }
      </tbody>
    </Table>
  )
  
  if(props.limit){
    return(
      <div className="tableau-wrapper" id="actions-requises">
        <Row>
          <Col>
            <h1>
              {props.title}
              <sup className="nb-actions">{props.dataArray.length}</sup>
            </h1>
          </Col>
          <Col className="tableau-header no-margin" lg="1">
            <FButton type="dark" name="options-2-outline" onClick={props.upcoming}>
              Paramétrer
            </FButton>
          </Col>
        </Row>
  
        <div className="tableau">
          {table}
        </div>

        {!props.hasNotifs &&
          <div className="ecran-protection no-notifs">
            <div className="content-wrapper">
              <img src={countrySide} />
              <h1>Aucune notification</h1>
              <div className="sous-contenu">
                Ne vous inquiétez pas, ça ne va pas tarder... ;)
              </div>
            </div>
          </div>}
      </div>
    )
  }else{
    return table
  }
}

export default actionTable;