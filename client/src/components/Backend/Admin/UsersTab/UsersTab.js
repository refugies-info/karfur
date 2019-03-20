import React from 'react';
import {Col, Row} from 'reactstrap';

import CreationUForm from './CreationUForm/CreationUForm'
import UsersList from './UsersList/UsersList'
import './UsersTab.scss'

const usersTab = (props) => {
  return(
    <Row className="langues-tab">
      <Col xs="12" md="6">
        <CreationUForm {...props} />
      </Col>
      <Col xs="12" md="6">
        <UsersList {...props} />
      </Col>
    </Row>
  )
}

export default usersTab;