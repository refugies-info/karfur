import OfficeFolder from "../theme/images/streamlineIcons/streamline-icon-office-folder@140x140.svg";
import Elearning from "../theme/images/streamlineIcons/e-learning-book-laptop.svg";
import House from "../theme/images/streamlineIcons/house-1.svg";
import Briefcase from "../theme/images/streamlineIcons/briefcase.svg";
import Measure from "../theme/images/streamlineIcons/task-finger-show.svg";
import Bus from "../theme/images/streamlineIcons/bus-2.svg";
import Glasses from "../theme/images/streamlineIcons/read-glasses-1.svg";
import HeartBeat from "../theme/images/streamlineIcons/soin.svg";
import Couple from "../theme/images/streamlineIcons/rencontre.svg";
import Flag from "../theme/images/streamlineIcons/benevolat.svg";
import Triumph from "../theme/images/streamlineIcons/landmark-triumph-gate.svg";
import Soccer from "../theme/images/streamlineIcons/tempsLibre.svg";

import React from "react";

interface Props {
  name: string;
  width: number;
  height: number;
}
export const StreamlineIcon = ({ name, ...props }: Props) => {
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
    case "heartBeat":
      return <HeartBeat {...props} />;
    case "couple":
      return <Couple {...props} />;
    case "soccer":
      return <Soccer {...props} />;
    case "flag":
      return <Flag {...props} />;
    case "office":
      return <OfficeFolder {...props} />;

    default:
      return <OfficeFolder {...props} />;
  }
};
