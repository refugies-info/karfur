import React from 'react';
import { Col, Row, Card, CardBody, CardFooter } from 'reactstrap';
import ContentEditable from 'react-contenteditable';
import { withTranslation } from 'react-i18next';

import FButton from '../../../FigmaUI/FButton/FButton';

const modifyProfile = (props) => {
  const { t, user, editing } = props;
  return (
    <Card className="profile-modify">
      <div className={"shadow-wrapper" + (editing ? " active" : "")}>
        <CardBody>
          <Row>
            <Col xl="4" lg="4" md="4" sm="4" xs="4" className="handleBetween">
              <b>{t("UserProfile.Pseudonyme", "Pseudonyme :")}</b>
            </Col>
            <Col xl="8" lg="8" md="8" sm="8" xs="8" className="handleBetween">
              <ContentEditable
                id="username"
                html={user.username || ''}
                disabled={!editing}
                onChange={props.handleChange} />
            </Col>
          </Row>
          <Row>
            <Col xl="4" lg="4" md="4" sm="4" xs="4" className="handleBetween">
              <b>{t("UserProfile.E-mail", "E-mail :")}</b>
            </Col>
            <Col xl="8" lg="8" md="8" sm="8" xs="8" className="handleBetween">
              <ContentEditable
                id="email"
                html={user.email || ''}
                disabled={!editing}
                onChange={props.handleChange} />
            </Col>
          </Row>
          <Row>
            <Col xl="4" g="4" md="4" sm="4" xs="4" className="handleBetween">
              <b>{t("UserProfile.A propos", "À propos :")}</b>
            </Col>
            <Col xl="8" lg="8" md="8" sm="8" xs="8" className="handleBetween">
              <ContentEditable
                id="description"
                html={user.description || ''}
                disabled={!editing}
                onChange={props.handleChange} />
            </Col>
          </Row>
          {editing && 
            <Row className="nb-car-row">
              <Col xl="4" g="4" md="4" sm="4" xs="4" className="handleBetween" />
              <Col xl="8" lg="8" md="8" sm="8" xs="8" className="handleBetween">
                <span className="texte-vert">{(user.description || '').length}</span> {t("UserProfile.nbCarMax", "sur 120 caractères")}
              </Col>
            </Row>}
        </CardBody>
        {editing ? 
          <CardFooter className="mt-10">
            <FButton type="light-action" onClick={props.toggleEditing} className="mr-10">
              {t("Annuler", "Annuler")}
            </FButton>
            <FButton type="validate" name="save-outline" onClick={props.validateProfile}>
              {t("Sauvegarder", "Sauvegarder")}
            </FButton>
          </CardFooter> :
          <CardFooter className="mt-10">
            <FButton type="dark" name="edit-outline" onClick={props.toggleEditing}>
              {t("Modifier mon profil", "Modifier mon profil")}
            </FButton>
          </CardFooter>}
      </div>
    </Card>
  )
}

export default withTranslation()(modifyProfile);