import React from "react";
import styled from "styled-components";
import {
  StyledTextVerySmall,
  StyledTextVerySmallBold,
} from "../../components/StyledText";
import { styles } from "../../theme";

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
        <TabBarLabelTextBold color={styles.colors.darkBlue}>
          {props.label}
        </TabBarLabelTextBold>
      ) : (
        <TabBarLabelText color={styles.colors.darkGrey}>
          {props.label}
        </TabBarLabelText>
      )}
    </>
  );
};
