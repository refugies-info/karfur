import React from "react";
import { Icon } from "react-native-eva-icons";
import styled, { useTheme } from "styled-components/native";
import { RTLTouchableOpacity } from "../../BasicComponents";
import { StyledTextSmallBold } from "../../StyledText";

const TagContainer = styled(RTLTouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.dsfr_action};
  padding-horizontal: ${({ theme }) => theme.margin * 2}px;
  padding-vertical: ${({ theme }) => theme.margin * 1.5}px;
  min-height: 56px;
  border-radius: ${({ theme }) => theme.radius * 10}px;
  align-items: center;
  align-self: flex-start;
  gap: ${({ theme }) => theme.margin}px;
`;

export interface TagProps {
  onRemove: () => void;
  accessibilityLabel?: string;
  children: string | React.ReactNode;
}

export const Tag = (props: TagProps) => {
  const theme = useTheme();
  return (
    <TagContainer
      onPress={props.onRemove}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={props.accessibilityLabel}
    >
      <StyledTextSmallBold style={{ color: "white" }}>
        {props.children}
      </StyledTextSmallBold>
      <Icon
        name="close-outline"
        fill={theme.colors.white}
        height={24}
        width={24}
      />
    </TagContainer>
  );
};

export default Tag;
