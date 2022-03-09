import React from "react";
import { Card } from "reactstrap";

interface Props {
  className: string
  children: any
  onClick?: any
}

const CustomCard = (props: Props) => {
  return (
    <Card
      className={"custom-card " + props.className}
      onClick={props.onClick}
    >
      {props.children}
    </Card>
  );
};

export default CustomCard;
