import OfficeFolder from "../theme/images/streamlineIcons/office-folder.svg";
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
  stroke?: string;
  strokeWidth?: number;
}
export const StreamlineIcon = ({
  name,
  stroke = "white",
  strokeWidth = 2,
  ...props
}: Props) => {
  switch (name) {
    case "house":
      return <House {...props} style={{ stroke, strokeWidth }} />;
    case "elearning":
      return <Elearning {...props} style={{ stroke, strokeWidth }} />;
    case "briefcase":
      return <Briefcase {...props} style={{ stroke, strokeWidth }} />;
    case "measure":
      return <Measure {...props} style={{ stroke, strokeWidth }} />;
    case "glasses":
      return <Glasses {...props} style={{ stroke, strokeWidth }} />;
    case "bus":
      return <Bus {...props} style={{ stroke, strokeWidth }} />;
    case "triumph":
      return <Triumph {...props} style={{ stroke, strokeWidth }} />;
    case "heartBeat":
      return <HeartBeat {...props} style={{ stroke, strokeWidth }} />;
    case "couple":
      return <Couple {...props} style={{ stroke, strokeWidth }} />;
    case "soccer":
      return <Soccer {...props} style={{ stroke, strokeWidth }} />;
    case "flag":
      return <Flag {...props} style={{ stroke, strokeWidth }} />;
    case "office":
      return <OfficeFolder {...props} style={{ stroke, strokeWidth }} />;

    default:
      return <OfficeFolder {...props} style={{ stroke, strokeWidth }} />;
  }
};
