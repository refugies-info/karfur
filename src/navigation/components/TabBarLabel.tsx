import React from "react";
import styled from "styled-components";
import {
  StyledTextVerySmall,
  StyledTextVerySmallBold,
} from "../../components/StyledText";
import { theme } from "../../theme";

interface TabBarLabelProps {
  focused: boolean;
  label: string;
}

const TabBarLabelText = styled(StyledTextVerySmall)`
  color: ${(props: { color: string }) => props.color};
`;

const TabBarLabelTextBold = styled(StyledTextVerySmallBold)`
  color: ${(props: { color: string }) => props.color};
`;

export const TabBarLabel = (props: TabBarLabelProps) => {
  return (
    <>
      {props.focused ? (
        <TabBarLabelTextBold color={theme.colors.darkBlue}>
          {props.label}
        </TabBarLabelTextBold>
      ) : (
        <TabBarLabelText color={theme.colors.darkGrey}>
          {props.label}
        </TabBarLabelText>
      )}
    </>
  );
};
