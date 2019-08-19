import React from 'react';
import {Col, Row} from 'reactstrap';

import CreationSForm from './CreationSForm/CreationSForm'
import StructuresList from './StructuresList/StructuresList'
import './StructuresTab.scss'

const structuresTab = (props) => {
  return(
    <Row className="structures-tab">
      <Col xs="12" md="6">
        <CreationSForm {...props} />
      </Col>
      <Col xs="12" md="6">
        <StructuresList {...props} />
      </Col>
    </Row>
  )
}

export default structuresTab;