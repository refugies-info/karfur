import React from "react";
import styled from "styled-components/native";
import { Icon as EvaIcon } from "react-native-eva-icons";

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
}

const Icon = ({
  name,
  color,
  size,
  skeleton = false,
  loading = false,
  disabled = false,
}: IconProps) => {
  const IconComponent = supportedIcons[name];

  if (skeleton) return <IconSkeleton size={size} />;
  if (loading) return <IconLoader size={size} />;

  return (
    <WrapperView disabled={disabled}>
      {!IconComponent ? (
        <EvaIcon name={name} fill={color} height={size} width={size} />
      ) : (
        <IconComponent color={color} size={size} />
      )}
    </WrapperView>
  );
};

export default Icon;
