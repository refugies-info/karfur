import React from 'react';
import { Col, Row, Table } from 'reactstrap';
import Icon from 'react-eva-icons';
import moment from 'moment/min/moment-with-locales';

import marioProfile from '../../../../assets/mario-profile.jpg';
import FButton from '../../../FigmaUI/FButton/FButton';
import { fakeMembre } from '../../../../containers/Backend/UserDashStruct/data';

import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

moment.locale('fr');

const membersTable = (props) => {
  const hasMembers = (props.dataArray || []).length > 0;
  const dataArray = hasMembers ? props.dataArray : new Array(5).fill(fakeMembre);
  let data = props.limit ? dataArray.slice(0,props.limit) : dataArray;
  const hideOnPhone = props.hideOnPhone || new Array(props.headers).fill(false)

  data = data.map(x => ({
    ...x, 
    ...props.users.find(y => y._id === x.userId),
    structRole: ((x.roles || []).includes("administrateur") ? "administrateur" : ((x.roles || []).includes("contributeur") ? "contributeur" : "membre")),
  }));

  const table = (
    <Table responsive className="avancement-user-table">
      <thead>
        <tr>
          {props.headers.map((element,key) => (<th key={key} className={hideOnPhone[key] ? "hideOnPhone" : ""}>{element}</th> ))}
        </tr>
      </thead>
      <tbody>
        {data.map((element,key) => {
          const joursLastC = (new Date().getTime() -  new Date(element.last_connected).getTime()) / (1000 * 3600 * 24);
          const newWordingRole = element.structRole === "administrateur" ? "Responsable" :
            element.structRole === "contributeur" ? "Rédacteur" :
              element.structRole === "membre" ? "Membre simple" : element.structRole;
          return (
            <tr key={key} >
              <td className="align-middle">
                <img
                  src={element.picture ? element.picture.secure_url : marioProfile} 
                  className="profile-img-pin img-circle mr-10"
                  alt="user profile"
                />
                {element.username}
              </td>
              <td className="align-middle">
                <FButton type="light-action role-btn" onClick={() => props.editMember(element)}>
                  {newWordingRole}
                  <EVAIcon name="edit-outline" className="ml-10 edit-icon" />
                </FButton>
              </td>
              <td className="align-middle hideOnPhone">
                {element.connected ? <span className="depuis success">Actuellement en ligne</span> :
                  element.last_connected ? <span>{moment(element.last_connected).calendar()} <span className={"depuis " + (joursLastC > 3 ? "alert" : "success")}>{moment(element.last_connected).fromNow()}</span></span> : ""}
              </td>
              <td className="align-middle hideOnPhone">
                {element.added_at ? moment(element.added_at).calendar() : ""}
              </td>
              <td className="align-middle fit-content hideOnPhone">
                {/* <FButton type="light-action" name="person-outline" fill={variables.noir} onClick={props.upcoming} /> */}
              </td>
              <td className="align-middle fit-content hideOnPhone">
                {/* <FButton type="light-action" name="message-circle-outline" fill={variables.noir} onClick={props.upcoming} /> */}
              </td>
              <td className="align-middle fit-content hideOnPhone">
                {/* <FButton type="light-action" name="eye-outline" fill={variables.noir} onClick={props.upcoming} /> */}
              </td>
            </tr>
          );
        })}
        {props.limit && dataArray.length > 5 && 
          <tr >
            <td colSpan="8" className="align-middle voir-plus" onClick={()=>props.toggleModal('members')}>
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
          {(((props.structure.membres || []).find(x => x.userId === props.user._id) || {}).roles || []).some(y => y==="administrateur" || y==="contributeur") && 
            <Col xl="auto" lg="auto" md="auto" sm="12" xs="12" className="tableau-header no-margin">
              <FButton type="dark" name="options-2-outline" onClick={()=>props.toggleModal("addMember")}>
                Ajouter un membre
              </FButton>
            </Col>}
        </Row>
  
        <div className="tableau">
          {table}
        </div>
      </div>
    )
  }else{
    return table
  }
}

export default membersTable;