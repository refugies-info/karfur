import React from "react";
import Svg, { Path } from "react-native-svg";
import IconProps from "./IconProps";

const IconI = ({ color, size }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.75 0.25H1.25C0.697715 0.25 0.25 0.697715 0.25 1.25V8.75C0.25 9.30229 0.697715 9.75 1.25 9.75H8.75C9.30229 9.75 9.75 9.30229 9.75 8.75V1.25C9.75 0.697715 9.30229 0.25 8.75 0.25ZM5.5 2.5H4.5V3.5H5.5V2.5ZM5.5 4.5H4.5V7.5H5.5V4.5Z"
        fill={color}
      />
    </Svg>
  );
};

export default IconI;
