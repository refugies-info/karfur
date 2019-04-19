import React from 'react';
import { Card } from 'reactstrap';

import './CustomCard.scss';

const customCard = (props) => {
  return(
    <Card className={"custom-card" + (props.addcard ? ' add-card':'')} {...props}>
      {props.children}
    </Card>
  )
}

export default customCard;