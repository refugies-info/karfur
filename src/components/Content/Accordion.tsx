import * as React from "react";
import styled from "styled-components/native";
import { styles } from "../../theme";
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
  darkColor: string;
  lightColor: string;
  isContentTranslated: boolean;
}

const TitleContainer = styled(RTLTouchableOpacity)`
  background-color: ${(props: { isExpanded: boolean; lightColor: string }) =>
    props.isExpanded ? props.lightColor : styles.colors.white};
  padding:${styles.margin * 2}px;
  border-radius:${styles.radius * 2}px
  ${(props: { isExpanded: boolean }) =>
    !props.isExpanded ? styles.shadows.lg : ""};
  justify-content:space-between;
  border: ${(props: { isExpanded: boolean; darkColor: string }) =>
    props.isExpanded
      ? `2px solid ${props.darkColor}`
      : `2px solid ${styles.colors.white}`} ;
    align-items:center;
`;

const AccordionContainer = styled.View`
  margin-bottom: ${styles.margin}px;
  margin-top: ${styles.margin}px;
  margin-horizontal: ${styles.margin * 3}px;
`;

const StepContainer = styled.View`
  width: 32px;
  height: 32px;
  background-color: ${(props: { darkColor: string }) => props.darkColor};
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : styles.margin * 2}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin * 2 : 0}px;
`;

const StepText = styled(TextSmallBold)`
  color: ${styles.colors.white};
`;

const ExpandedContentContainer = styled.View`
  padding: ${styles.margin}px;
`;
const IconContainer = styled.View`
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin : 0}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin : 0}px;
`;

const TitleText = styled(TextSmallBold)`
  width: ${(props: { width: number }) => props.width}px;
  color: ${(props: { darkColor: string }) => props.darkColor};
`;

export const Accordion = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <AccordionContainer>
      <TitleContainer
        onPress={props.toggleAccordion}
        isExpanded={props.isExpanded}
        darkColor={props.darkColor}
        lightColor={props.lightColor}
        accessibilityRole="button"
        accessibilityLabel={props.title}
        accessibilityState={{expanded: props.isExpanded}}
      >
        <RTLView>
          {props.stepNumber && (
            <StepContainer isRTL={isRTL} darkColor={props.darkColor}>
              <StepText>{props.stepNumber}</StepText>
            </StepContainer>
          )}
          {!props.isContentTranslated ? (
            <TitleText width={props.width} darkColor={props.darkColor}>
              {props.title}
            </TitleText>
          ) : (
            <AccordionHeaderFromHtml
              htmlContent={props.title}
              width={props.width}
              windowWidth={props.windowWidth}
              darkColor={props.darkColor}
            />
          )}
        </RTLView>
        <IconContainer isRTL={isRTL}>
          <Icon
            name={props.isExpanded ? "chevron-up" : "chevron-down"}
            height={24}
            width={24}
            fill={props.darkColor}
          />
        </IconContainer>
      </TitleContainer>

      {props.isExpanded && (
        <ExpandedContentContainer>
          <ContentFromHtml
            htmlContent={props.content}
            windowWidth={props.windowWidth}
          />
        </ExpandedContentContainer>
      )}
    </AccordionContainer>
  );
};
