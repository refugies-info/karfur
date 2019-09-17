import React, {Component} from 'react';
import { Col, Row, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import moment from 'moment/min/moment-with-locales';
import {NavLink as DefaultNavLink} from 'react-router-dom';

import FButton from '../../../FigmaUI/FButton/FButton';
import {diairMinInt} from '../../../../assets/figma/index'

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
    const {actions}= this.props;
    const actionTypes = [...new Set((actions || []).map(x => x.action))].map(a => ({type: a, actions: (actions || []).filter(y => y.action === a) || [] }))
    return(
      <div className="tableau-wrapper structure-card" id="structure">
        <Row>
          <Col>
            <h1>{this.props.title}</h1>
          </Col>
          {this.props.displayIndicators && 
            <Col className="d-flex tableau-header justify-content-end">
              {(((this.props.structure.membres || []).find(x => x.userId === this.props.user._id) || {}).roles || []).some(y => y==="administrateur" || y==="contributeur") && 
                <FButton type="dark" name="options-2-outline" className="mr-10" onClick={()=>this.props.toggleModal('addMember')}>
                  Ajouter un membre
                </FButton>}
              <FButton tag={DefaultNavLink} to="/backend/user-dash-structure" type="dark" name="settings-2-outline">
                Espace structure
              </FButton>
            </Col>}
        </Row>

        <Card className="main-card">
          <CardBody>
            <div className="left-side">
              <div className="logo-bloc">
                <div className="img-wrapper">
                  <img src={(this.props.structure.picture || {}).secure_url || diairMinInt} className="logo-img" alt="logo de la structure" />
                </div>
                <div className="logo-footer">
                  <b>{this.props.structure.nom}</b>
                </div>
              </div>
            </div>
            <div className="middle-side">
              <Nav tabs>
                {actionTypes.map((type, i) => (
                  <NavItem key={i}>
                    <NavLink
                      className={this.state.activeTab === i ? "active" : "" }
                      onClick={() => this.toggle(i)}
                    >
                      {jsUcfirst(type.type)}
                      <span className="float-right">{type.actions.length}</span>
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                {actionTypes.map((type, i) => (
                  <TabPane tabId={i} key={i}>
                    <ListGroup className="liste-actions">
                      {type.actions.map(act => {
                        const joursDepuis = (new Date().getTime() -  new Date(act.depuis).getTime()) / (1000 * 3600 * 24);
                        return (
                          <ListGroupItem key={act.suggestionId} className={"depuis " + (joursDepuis > 10 ? "alert" : (joursDepuis > 3 ? "warning" : "")) }>
                            {act.texte}
                            <span className="float-right">{moment(act.depuis).fromNow()}</span>
                          </ListGroupItem>
                        )}
                      )}
                    </ListGroup>
                  </TabPane>
                ))}
              </TabContent>
            </div>
            <div className="right-side">
              <Row>
                <Col lg="6">
                  <div className="indicateur">
                    <h2>234</h2>
                    <div>personnes informées</div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="indicateur">
                    <h2>234</h2>
                    <div>personnes informées</div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg="6">
                  <div className="indicateur">
                    <h2>234</h2>
                    <div>personnes informées</div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="indicateur">
                    <h2>234</h2>
                    <div>personnes informées</div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg="6">
                  <div className="indicateur">
                    <h2>234</h2>
                    <div>personnes informées</div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="indicateur">
                    <h2>234</h2>
                    <div>personnes informées</div>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default StructureCard;