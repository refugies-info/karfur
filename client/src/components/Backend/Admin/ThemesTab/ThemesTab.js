import React from 'react';
import {Col, Row} from 'reactstrap';

import CreationTForm from './CreationTForm/CreationTForm'
import ThemesList from './ThemesList/ThemesList'
import './ThemesTab.scss'

const themesTab = (props) => {
  return(
    <Row className="themes-tab">
      <Col xs="12" md="6">
        <CreationTForm {...props} />
      </Col>
      <Col xs="12" md="6">
        <ThemesList {...props} />
      </Col>
    </Row>
  )
}

export default themesTab;