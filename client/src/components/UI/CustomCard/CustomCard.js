import React from 'react';
import { Card } from 'reactstrap';

import './CustomCard.scss';

const customCard = (props) => {
  const {className, ...bprops} = props;
  return(
    <Card className={"custom-card" + (props.addcard ? ' add-card ':' ') + className} {...bprops}>
      {props.children}
    </Card>
  )
}

export default customCard;