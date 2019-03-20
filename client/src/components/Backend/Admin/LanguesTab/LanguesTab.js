import React from 'react';
import {Col, Row} from 'reactstrap';

import CreationLForm from './CreationLForm/CreationLForm'
import LanguesList from './LanguesList/LanguesList'
import './LanguesTab.scss'

const languesTab = (props) => {
  return(
    <Row className="langues-tab">
      <Col xs="12" md="6">
        <CreationLForm {...props} />
      </Col>
      <Col xs="12" md="6">
        <LanguesList {...props} />
      </Col>
    </Row>
  )
}

export default languesTab;