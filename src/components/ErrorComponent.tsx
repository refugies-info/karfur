import * as React from "react";

import styled from "styled-components/native";
import { RTLView } from "./BasicComponents";
import { theme } from "../theme";
import { StyledTextVerySmall } from "./StyledText";
import { Icon } from "react-native-eva-icons";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";

const MainContainer = styled(RTLView)`
  background-color: ${theme.colors.white};
  margin-bottom: ${theme.margin * 3}px;
  border-radius: ${theme.radius * 2}px;
  align-items: center;
`;

const RedContainer = styled.View`
  width: 56px;
  background-color: ${theme.colors.red};
  padding: ${theme.margin * 2}px;
  border-top-left-radius: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.radius * 2}px;
  border-bottom-left-radius: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.radius * 2}px;
  border-top-right-radius: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.radius * 2 : 0}px;
  border-bottom-right-radius: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.radius * 2 : 0}px;
  height: 100%;
  display:flex;
  flex-direction:row
  align-items: center;
  justify-content: center;

`;

const TextContainer = styled.View`
  padding: ${theme.margin * 2}px;
  flex-shrink: 1;
`;

export const ErrorComponent = (props: { text: string }) => {
  const { isRTL } = useTranslationWithRTL();
  return (
    <MainContainer>
      <RedContainer isRTL={isRTL}>
        <Icon
          name="alert-triangle"
          height={24}
          width={24}
          fill={theme.colors.white}
        />
      </RedContainer>
      <TextContainer>
        <StyledTextVerySmall>{props.text}</StyledTextVerySmall>
      </TextContainer>
    </MainContainer>
  );
};
