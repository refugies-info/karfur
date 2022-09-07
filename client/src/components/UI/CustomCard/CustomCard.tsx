import React from "react";
import { Card } from "reactstrap";

interface Props {
  className?: string
  children: any
  onClick?: any
  style?: any
}

const CustomCard = (props: Props) => {
  return (
    <Card
      className={"custom-card " + (props.className || "")}
      onClick={props.onClick}
      style={props.style}
    >
      {props.children}
    </Card>
  );
};

export default CustomCard;
