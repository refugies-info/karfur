import { StyleProp, ViewStyle } from "react-native";
import { Icon as EvaIcon } from "react-native-eva-icons";
import styled from "styled-components/native";

// TODO: passer en svg
import IconLoader from "./IconLoader";

// icons components
import IconI from "./icons/IconI";
import IconSkeleton from "./icons/IconSkeleton";
import IconThumbDown from "./icons/IconThumbDown";
import IconThumbUp from "./icons/IconThumbUp";
import IconWarning from "./icons/IconWarning";

export const supportedIcons: Record<string, any> = {
  i: IconI,
  thumb_up: IconThumbUp,
  thumb_down: IconThumbDown,
  warning: IconWarning,
};

const WrapperView = styled.View<{ disabled: boolean }>`
  ${({ disabled, theme }) => disabled && `opacity: ${theme.opacity.disabled}`};
`;

export interface IconProps {
  color: string;
  disabled?: boolean;
  loading?: boolean;
  name: string;
  size: number;
  skeleton?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Icon = ({ name, color, size, skeleton = false, loading = false, disabled = false, style = {} }: IconProps) => {
  const IconComponent = supportedIcons[name];

  if (skeleton) return <IconSkeleton size={size} />;
  if (loading) return <IconLoader size={size} />;

  return (
    //@ts-ignore
    <WrapperView disabled={disabled} style={style}>
      {!IconComponent ? (
        <EvaIcon name={name} fill={color} height={size} width={size} />
      ) : (
        <IconComponent color={color} size={size} />
      )}
    </WrapperView>
  );
};

export default Icon;
