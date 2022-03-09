import React from "react";

import Elearning from "./Elearning";
import House from "./House";
import Briefcase from "./Briefcase";
import Measure from "./Measure";
import Glasses from "./Glasses";
import Bus from "./Bus";
import Triumph from "./Triumph";
import HeartBeat from "./HeartBeat";
import Couple from "./Couple";
import Soccer from "./Soccer";
import Flag from "./Flag";
import Office from "./Office";
import Search from "./Search";
import Message from "./Message";
import Menu from "./Menu";
import Tag from "./Tag";
import { iconName } from "types/interface";

interface Props {
  name?: iconName;
  stroke?: string;
  width?: number;
  height?: number;
}

const Streamline = (props: Props) => {
  switch (props.name) {
    case "house":
      return <House {...props} />;
    case "elearning":
      return <Elearning {...props} />;
    case "briefcase":
      return <Briefcase {...props} />;
    case "measure":
      return <Measure {...props} />;
    case "glasses":
      return <Glasses {...props} />;
    case "bus":
      return <Bus {...props} />;
    case "triumph":
      return <Triumph {...props} />;
    case "heartBeat":
      return <HeartBeat {...props} />;
    case "couple":
      return <Couple {...props} />;
    case "soccer":
      return <Soccer {...props} />;
    case "flag":
      return <Flag {...props} />;
    case "office":
      return <Office {...props} />;
    case "search":
      return <Search {...props} />;
    case "message":
      return <Message {...props} />;
    case "menu":
      return <Menu {...props} />;
    case "tag":
      return <Tag {...props} />;
    default:
      return <House {...props} />;
  }
};

export default Streamline;
