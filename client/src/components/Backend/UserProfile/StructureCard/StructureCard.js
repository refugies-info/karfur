import React, {Component} from 'react';
import { Col, Row, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import Icon from 'react-eva-icons';
import moment from 'moment/min/moment-with-locales';

import EVAIcon from '../../../UI/EVAIcon/EVAIcon';
import FButton from '../../../FigmaUI/FButton/FButton';
import {diairMinInt} from '../../../../assets/figma/index'

import './StructureCard.scss'
import variables from 'scss/colors.scss';

moment.locale('fr');

class StructureCard extends Component {
  state = {
    activeTab: '1'
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  render(){
    return(
      <div className="tableau-wrapper structure-card" id="mes-favoris">
        <Row>
          <Col>
            <h1>{this.props.title}</h1>
          </Col>
          {this.props.displayIndicators && 
            <Col className="d-flex tableau-header justify-content-end">
              {(((this.props.structure.membres || []).find(x => x.userId === this.props.user._id) || {}).roles || []).some(y => y==="administrateur" || y==="contributeur") && 
                <FButton type="dark" name="options-2-outline" className="mr-10">
                  Ajouter un membre
                </FButton>}
              <FButton tag={NavLink} href="/backend/user-dash-structure" type="dark" name="settings-2-outline">
                Espace structure
              </FButton>
            </Col>}
        </Row>

        <Card className="main-card">
          <CardBody>
            <div className="left-side">
              <div className="logo-bloc">
                <div className="img-wrapper">
                  <img src={(this.props.structure.picture || {}).secure_url || diairMinInt} className="logo-img" />
                </div>
                <div className="logo-footer">
                  <b>{this.props.structure.nom}</b>
                </div>
              </div>
            </div>
            <div className="middle-side">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={this.state.activeTab === '1' ? "active" : "" }
                    onClick={() => { this.toggle('1'); }}
                  >
                    Suggestions
                    <span className="float-right">6</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={this.state.activeTab === '2' ? "active" : "" }
                    onClick={() => { this.toggle('2'); }}
                  >
                    Commentaires
                    <span className="float-right">6</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <ListGroup className="liste-actions">
                    <ListGroupItem>
                      Suggestion de test
                      <span className="float-right">6</span>
                    </ListGroupItem>
                    <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
                    <ListGroupItem>Morbi leo risus</ListGroupItem>
                    <ListGroupItem>Porta ac consectetur ac</ListGroupItem>
                  </ListGroup>
                </TabPane>
                <TabPane tabId="2">
                  <ListGroup className="liste-actions">
                    <ListGroupItem>
                      Commentaire de test
                      <span className="float-right">6</span>
                    </ListGroupItem>
                    <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
                    <ListGroupItem>Morbi leo risus</ListGroupItem>
                    <ListGroupItem>Porta ac consectetur ac</ListGroupItem>
                  </ListGroup>
                </TabPane>
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