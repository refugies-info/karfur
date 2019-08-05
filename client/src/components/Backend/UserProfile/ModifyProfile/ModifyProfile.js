import React from 'react';
import { Col, Row, Card, CardBody, CardHeader, CardFooter, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ContentEditable from 'react-contenteditable';
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';
import FButton from '../../../FigmaUI/FButton/FButton';

const modifyProfile = (props) => {
  let { user, langues, editing } = props;
  return (
    <Card className="profile-modify">
      <div className={"shadow-wrapper" + (editing ? " active" : "")}>
        <CardBody>
          <Row>
            <Col xl="4" lg="4" md="4" sm="4" xs="4" className="handleBetween">
              Pseudonyme
            </Col>
            <Col lg="6" md="6" sm="6" xs="6">
              <ContentEditable
                id="username"
                html={user.username || ''}
                disabled={!editing}
                onChange={props.handleChange} />
            </Col>
          </Row>
          {/* <Row>
            <Col lg="4" md="4" sm="4" xs="4" className="handleBetween">
              Langue
            </Col>
            <Col lg="6" md="6" sm="6" xs="6">
              {(user.selectedLanguages || []).map((lang, key) => (
                <ButtonDropdown isOpen={editing && props.isDropdownOpen[key]} toggle={(e) => props.toggleDropdown(e, key)} className="langues-dropdown" key={key}>
                  <DropdownToggle caret={editing}>
                    <i className={'margin-right-8 flag-icon flag-icon-' + lang.langueCode} title={lang.langueCode} id={lang.langueCode}></i>
                    {lang.langueFr}
                    {editing && <div className="minus-icon" onClick={(e)=>props.removeLang(e,key)}>
                      <EVAIcon name="minus-circle-outline" fill="#0D1C2E" className="delete-icon"/>
                    </div>}
                  </DropdownToggle>
                  <DropdownMenu>
                    {langues.map((l, i) => {
                      return (
                        <DropdownItem key={i} id={i}>
                          <i className={'flag-icon flag-icon-' + l.langueCode} title={l.langueCode} id={l.langueCode}></i>
                          <span>{l.langueFr}</span>
                        </DropdownItem>
                      )
                    }
                    )}
                  </DropdownMenu>
                </ButtonDropdown>
              ))}
              {editing && <Button className="plus-langue" onClick={props.addLangue}>
                <EVAIcon name="plus-circle-outline" fill="#3D3D3D" />
              </Button>}
            </Col>
          </Row> */}
          <Row>
            <Col lg="4" md="4" sm="4" xs="4" className="handleBetween">
              Email
            </Col>
            <Col lg="6" md="6" sm="6" xs="6">
              <ContentEditable
                id="email"
                html={user.email || ''}
                disabled={!editing}
                onChange={props.handleChange} />
            </Col>
          </Row>
          <Row>
            <Col lg="4" md="4" sm="4" xs="4" className="handleBetween">
              A propos
            </Col>
            <Col lg="6" md="6" sm="6" xs="6">
              <ContentEditable
                id="description"
                html={user.description || ''}
                disabled={!editing}
                onChange={props.handleChange} />
            </Col>
          </Row>
        </CardBody>
        {!editing && <CardFooter>
          <FButton type="dark" name="edit-outline" onClick={props.toggleEditing}>
            Compléter
          </FButton>
        </CardFooter>}
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