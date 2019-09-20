import React from 'react';
import { Col, Row, Card, CardBody, CardFooter, Button } from 'reactstrap';
import ContentEditable from 'react-contenteditable';
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';
import FButton from '../../../FigmaUI/FButton/FButton';

const modifyProfile = (props) => {
  let { user, editing } = props;
  // const shortDescription=e=>{
  //   console.log(user.description, (user.description || '').length,e.currentTarget.value)
  //   return (user.description || '').length>120 && e.preventDefault()
  // }
  return (
    <Card className="profile-modify">
      <div className={"shadow-wrapper" + (editing ? " active" : "")}>
        <CardBody>
          <Row>
            <Col xl="4" lg="4" md="4" sm="4" xs="4" className="handleBetween">
              Pseudonyme :
            </Col>
            <Col xl="8" lg="8" md="8" sm="8" xs="8">
              <ContentEditable
                id="username"
                html={user.username || ''}
                disabled={!editing}
                onChange={props.handleChange} />
            </Col>
          </Row>
          <Row>
            <Col xl="4" lg="4" md="4" sm="4" xs="4" className="handleBetween">
              E-mail :
            </Col>
            <Col xl="8" lg="8" md="8" sm="8" xs="8">
              <ContentEditable
                id="email"
                html={user.email || ''}
                disabled={!editing}
                onChange={props.handleChange} />
            </Col>
          </Row>
          <Row>
            <Col lxl="4" g="4" md="4" sm="4" xs="4" className="handleBetween">
              À propos :
            </Col>
            <Col xl="8" lg="8" md="8" sm="8" xs="8">
              <ContentEditable
                id="description"
                html={user.description || ''}
                disabled={!editing}
                onChange={props.handleChange} />
            </Col>
          </Row>
        </CardBody>
      </div>
      {editing && 
        <CardFooter className="mt-10">
          <Button color="secondary" className="cancel-btn d-flex align-items-center" onClick={props.toggleEditing}>
            <EVAIcon className="margin-right-8 d-inline-flex" name="close-circle-outline" />
            Annuler
          </Button>
          <Button color="success" className="validate-btn d-flex align-items-center" onClick={props.validateProfile}>
            <EVAIcon className="margin-right-8 d-inline-flex" name="checkmark-circle-outline" />
            Valider
          </Button>
        </CardFooter>}
    </Card>
  )
}

export default modifyProfile;