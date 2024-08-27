import Svg, { Circle } from "react-native-svg";
import { useTheme } from "styled-components/native";
import IconProps from "./IconProps";

const IconSkeleton = ({ size }: Omit<IconProps, "color">) => {
  const theme = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 1000 1000">
      <Circle fill={theme.colors.skeleton} cx={500} cy={500} r={500} />
    </Svg>
  );
};

export default IconSkeleton;
