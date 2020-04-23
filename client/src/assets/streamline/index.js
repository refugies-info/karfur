import Elearning from "./Elearning.js";
import House from "./House.js";
import Briefcase from "./Briefcase.js";
import Measure from "./Measure.js";
import Glasses from "./Glasses.js";
import Bus from "./Bus.js";
import Triumph from './Triumph';
import HeartBeat from './HeartBeat';
import Couple from './Couple';
import Soccer from './Soccer';
import Flag from './Flag';
import Office from './Office';
import Search from './Search';

import { withTheme } from "styled-components";
import React from "react";

const Streamline = ({ name = "house", ...props }) => {
  switch (name) {
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
    case "heartbeat":
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
    default:
      return <House {...props} />;
  }
};

export default Streamline;
