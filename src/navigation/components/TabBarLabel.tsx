import React from "react";
import styled from "styled-components/native";
import {
  StyledTextVerySmall,
  StyledTextVerySmallBold,
} from "../../components/StyledText";

interface TabBarLabelProps {
  focused: boolean;
  label: string;
}

const TabBarLabelText = styled(StyledTextVerySmall)`
  color: ${({ theme }) => theme.colors.darkGrey};
`;

const TabBarLabelTextBold = styled(StyledTextVerySmallBold)`
  color: ${({ theme }) => theme.colors.darkBlue};
`;

export const TabBarLabel = (props: TabBarLabelProps) => {
  return (
    <>
      {props.focused ? (
        <TabBarLabelTextBold>{props.label}</TabBarLabelTextBold>
      ) : (
        <TabBarLabelText>{props.label}</TabBarLabelText>
      )}
    </>
  );
};
