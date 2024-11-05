import Svg, { Path } from "react-native-svg";

import IconProps from "./IconProps";

const IconWarning = ({ color, size }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 29a1 1 0 0 1-2 0v-4a1 1 0 0 1 2 0v4Zm-1 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm10.561-.697-7.672-12.719C22.29 18.592 21.21 18 20 18c-1.21 0-2.29.592-2.889 1.584L9.439 32.303a2.976 2.976 0 0 0-.045 3.033C9.973 36.363 11.098 37 12.328 37h15.344c1.23 0 2.355-.637 2.934-1.664.54-.956.523-2.09-.045-3.033Z"
      fill={color}
    />
  </Svg>
);
export default IconWarning;
