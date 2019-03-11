import React, { Component } from 'react';
import track from 'react-tracking';
import { Col, Row, Button } from 'reactstrap';

import Widget from './Widget'
import marioProfile from '../../../assets/mario-profile.jpg'
import Avancement from '../../Translation/Avancement/Avancement'
import './UserDash.scss';

class Dashboard extends Component {
  render() {
    return (
      <div className="animated fadeIn user-dash">
        <Row>
          <Col>
            <Row>
              <div class="profile-header-container">   
                <div class="profile-header-img">
                  <img class="img-circle" src={marioProfile} />
                  <div class="rank-label-container">
                      <span class="label label-default rank-label">Mario</span>
                  </div>
                </div>
              </div> 
            </Row>
            <Row>
              <Col xs="12" sm="6" lg="3">
                <Widget color="success" variant="inverse" header="89.9%" />
              </Col>
              <Col xs="12" sm="6" lg="3">
                <Widget color="warning" variant="inverse" header="12.124" />
              </Col>
              <Col xs="12" sm="6" lg="3">
                <Widget color="danger" variant="inverse" header="$98.111,00" smallText="">
                  <small className="text-muted">Excepteur sint occaecat...</small>
                </Widget>
              </Col>
              <Col xs="12" sm="6" lg="3">
                <Widget color="info" variant="inverse" value="95" header="1.9 TB" mainText="Danger!"
                          smallText="This is your final warning..." />
              </Col>
            </Row>
            <Row></Row>
          </Col>
          <Col xs="1" className="etale-boutons">
            <Row className="align-items-center third-height">
                <Button block color="primary" className="btn-pill">Call to action</Button>
            </Row>
            <Row className="align-items-center third-height">
              <Button block color="success" className="btn-pill">Call to action</Button>
            </Row>
            <Row className="align-items-center third-height">
              <Button block color="warning" className="btn-pill">Call to action</Button>
            </Row>
          </Col>
        </Row>
        <Row>
          <Avancement />
        </Row>
      </div>
    );
  }
}

export default track({
  page: 'Dashboard',
})(Dashboard);
