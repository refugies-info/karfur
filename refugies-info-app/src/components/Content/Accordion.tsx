import * as React from "react";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { TextSmallBold } from "../StyledText";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import { ContentFromHtml } from "./ContentFromHtml";
import { Icon } from "react-native-eva-icons";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { AccordionHeaderFromHtml } from "./AccordionHeaderFromHtml";
import { AvailableLanguageI18nCode } from "../../types/interface";

interface Props {
  title: string;
  content: string;
  isExpanded: boolean;
  toggleAccordion: () => void;
  stepNumber: number | null;
  width: number;
  currentLanguage: AvailableLanguageI18nCode | null;
  windowWidth: number;
}

const TitleContainer = styled(RTLTouchableOpacity)`
  background-color: ${theme.colors.white};
  padding:${theme.margin * 2}px;
  border-radius:${theme.radius * 2}px
  box-shadow: ${(props: { isExpanded: boolean }) =>
    props.isExpanded
      ? `0px 0px 0px ${theme.colors.white}`
      : "0px 8px 16px rgba(33, 33, 33, 0.24)"};
  elevation: 1;
  justify-content:space-between;
  border: ${(props: { isExpanded: boolean }) =>
    props.isExpanded
      ? `2px solid ${theme.colors.black}`
      : `2px solid ${theme.colors.white}`} ;
    align-items:center;
`;

const AccordionContainer = styled.View`
  margin-bottom: ${theme.margin}px;
  margin-top: ${theme.margin}px;
`;

const StepContainer = styled.View`
  width: 32px;
  height: 32px;
  background-color: ${theme.colors.black};
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin * 2}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin * 2 : 0}px;
`;

const StepText = styled(TextSmallBold)`
  color: ${theme.colors.white};
`;

const IconContainer = styled.View`
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
`;

const TitleText = styled(TextSmallBold)`
  width: ${(props: { width: number }) => props.width}px;
`;

export const Accordion = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <AccordionContainer>
      <TitleContainer
        onPress={props.toggleAccordion}
        isExpanded={props.isExpanded}
      >
        <RTLView>
          {props.stepNumber && (
            <StepContainer isRTL={isRTL}>
              <StepText>{props.stepNumber}</StepText>
            </StepContainer>
          )}
          {props.currentLanguage === "fr" ? (
            <TitleText width={props.width}>{props.title}</TitleText>
          ) : (
            <AccordionHeaderFromHtml
              htmlContent={props.title}
              width={props.width}
              windowWidth={props.windowWidth}
            />
          )}
        </RTLView>
        <IconContainer isRTL={isRTL}>
          <Icon
            name={props.isExpanded ? "chevron-up" : "chevron-down"}
            height={24}
            width={24}
            fill={theme.colors.black}
          />
        </IconContainer>
      </TitleContainer>

      {props.isExpanded && (
        <ContentFromHtml
          htmlContent={props.content}
          windowWidth={props.windowWidth}
        />
      )}
    </AccordionContainer>
  );
};
