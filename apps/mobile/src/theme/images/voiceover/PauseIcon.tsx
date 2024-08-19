import React from "react";
import { G, Path, Svg } from "react-native-svg";

interface Props {
  color: string;
  size: number;
}

const PauseIcon = ({ color, size }: Props) => (
  <Svg height={size} viewBox="0 0 20 20" width={size}>
    <G fill="none" fill-rule="evenodd" transform="translate(2 1)">
      <Path
        d="m4 0h-2c-1.10456727 0-2 .73262678-2 1.63636364v14.72727276c0 .9037487.89543273 1.6363636 2 1.6363636h2c1.10456727 0 2-.7326149 2-1.6363636v-14.72727276c0-.90373686-.89543273-1.63636364-2-1.63636364z"
        fill={color}
        fill-rule="nonzero"
      />
      <Path
        d="m14 0h-2c-1.1045818 0-2 .73262678-2 1.63636364v14.72727276c0 .9037487.8954182 1.6363636 2 1.6363636h2c1.1045818 0 2-.7326149 2-1.6363636v-14.72727276c0-.90373686-.8954182-1.63636364-2-1.63636364z"
        fill={color}
        fill-rule="nonzero"
      />
      <G stroke={color} stroke-linecap="round" stroke-linejoin="round">
        <Path d="m4 0h-2c-1.10456727 0-2 .73262678-2 1.63636364v14.72727276c0 .9037487.89543273 1.6363636 2 1.6363636h2c1.10456727 0 2-.7326149 2-1.6363636v-14.72727276c0-.90373686-.89543273-1.63636364-2-1.63636364z" />
        <Path d="m14 0h-2c-1.1045818 0-2 .73262678-2 1.63636364v14.72727276c0 .9037487.8954182 1.6363636 2 1.6363636h2c1.1045818 0 2-.7326149 2-1.6363636v-14.72727276c0-.90373686-.8954182-1.63636364-2-1.63636364z" />
      </G>
    </G>
  </Svg>
);

export default PauseIcon;
