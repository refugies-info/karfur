import React from "react";
import styled from "styled-components/native";
import { TextDSFR_XS, TextDSFR_XS_Bold } from "../../components/StyledText";

interface TabBarLabelProps {
  focused: boolean;
  label: string;
}

const TabBarLabelText = styled(TextDSFR_XS)`
  color: ${({ theme }) => theme.colors.darkGrey};
`;

const TabBarLabelTextBold = styled(TextDSFR_XS_Bold)`
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
