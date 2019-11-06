import React, {Component} from 'react';
import { Col, Row, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import moment from 'moment/min/moment-with-locales';
import {NavLink as DefaultNavLink} from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import FButton from '../../../FigmaUI/FButton/FButton';
import {diairMinInt, countrySide} from '../../../../assets/figma/index';

import './StructureCard.scss';

moment.locale('fr');

const jsUcfirst = string => {return string && string.length > 1 && (string.charAt(0).toUpperCase() + string.slice(1, string.length - 1))}

class StructureCard extends Component {
  state = {
    activeTab: 0
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  render(){
    const {t, actions, title, structure, nbRead} = this.props;
    const actionTypes = [...new Set((actions || []).map(x => x.action))].map(a => ({type: a, actions: (actions || []).filter(y => y.action === a) || [] }))
    return(
      <div className="tableau-wrapper structure-card" id="structure">
        <Row>
          <Col>
            <h1>{t("Tables." + title, title)}</h1>
          </Col>
          {this.props.displayIndicators && 
            <Col className="d-flex tableau-header justify-content-end">
              {(((structure.membres || []).find(x => x.userId === this.props.user._id) || {}).roles || []).some(y => y==="administrateur" || y==="contributeur") && 
                <FButton type="dark" name="options-2-outline" className="mr-10" onClick={()=>this.props.toggleModal('addMember')}>
                  {t("Tables.Ajouter un membre", "Ajouter un membre")}
                </FButton>}
              <FButton tag={DefaultNavLink} to="/backend/user-dash-structure" type="dark" name="settings-2-outline">
                {t("Tables.Espace structure", "Espace structure")}
              </FButton>
            </Col>}
        </Row>

        <Card className="main-card">
          <CardBody>
            <DefaultNavLink to="/backend/user-dash-structure">
              <div className="left-side">
                <div className="logo-bloc">
                  <div className="img-wrapper">
                    <img src={(structure.picture || {}).secure_url || diairMinInt} className="logo-img" alt="logo de la structure" />
                  </div>
                  <div className="logo-footer">
                    <b>{structure.nom}</b>
                  </div>
                </div>
              </div>
            </DefaultNavLink>
            <div className={"middle-side" + (actions && actions.length > 0 ? "" : " no-results-wrapper")}>
              {actions && actions.length > 0 ?
                <><Nav tabs>
                  {actionTypes.map((type, i) => (
                    <NavItem key={i}>
                      <NavLink
                        className={this.state.activeTab === i ? "active" : "" }
                        onClick={() => this.toggle(i)}
                      >
                        {jsUcfirst( t("Tables." + type.type, type.type) )}
                        <span className="float-right">{type.actions.length}</span>
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                  {actionTypes.map((type, i) => (
                    <TabPane tabId={i} key={i}>
                      <ListGroup className="liste-actions">
                        {type.actions.map((act, key) => {
                          const joursDepuis = (new Date().getTime() -  new Date(act.depuis).getTime()) / (1000 * 3600 * 24);
                          return (
                            <ListGroupItem key={act.suggestionId || key} className={"depuis " + (joursDepuis > 10 ? "alert" : (joursDepuis > 3 ? "warning" : "")) }>
                              {act.texte}
                              <span className="float-right">{moment(act.depuis).fromNow()}</span>
                            </ListGroupItem>
                          )}
                        )}
                      </ListGroup>
                    </TabPane>
                  ))}
                </TabContent></> :
                <div className="no-results">
                  <img src={countrySide} alt="illustration protection" />
                  <h5 className="mt-12">{t("Tables.futures notifs", "Ici apparaîtront les notifications relatives à votre structure")}...</h5>
                </div>}
            </div>
            <div className="right-side">
              <Row>
              <Col lg="6">
                <div className="indicateur">
                  {/* <h2>{(structure.dispositifsAssocies || []).length}</h2> */}
                  <div>{t("Tables.contenu", "contenu{{s}}", {s: (structure.dispositifsAssocies || []).length > 1 ? "s" : ""})}</div>
                </div>
              </Col>
              <Col lg="6">
                <div className="indicateur">
                  {/* <h2>{nbTraducteurs}</h2> */}
                  {/* <div>traducteur{nbTraducteurs>1?"s":""} mobilisé{nbTraducteurs>1?"s":""}</div> */}
                </div>
              </Col>
              <Col lg="6">
                <div className="indicateur">
                  {/* <h2>{(structure.membres || []).length}</h2> */}
                  <div>membre{(structure.membres || []).length>1?"s":""}</div>
                </div>
              </Col>
              <Col lg="6">
                <div className="indicateur">
                  {/* <h2>{props.actions.length}</h2> */}
                  <div>notification{actions.length>1?"s":""}</div>
                </div>
              </Col>
              <Col lg="6">
                <div className="indicateur">
                  {/* <h2>{props.nbRead}</h2> */}
                  <div>personne{nbRead>1?"s":""} informée{nbRead>1?"s":""}</div>
                </div>
              </Col>
              {/* {moyenneDate &&
                <Col lg="6">
                  <div className="indicateur">
                    <h4>{moment(moyenneDate).fromNow()}</h4>
                    <div>moyenne des dernières intéractions</div>
                  </div>
                </Col>} */}
              </Row>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default withTranslation()(StructureCard);