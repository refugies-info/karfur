import * as React from "react";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { TextSmallBold } from "../StyledText";
import { RTLTouchableOpacity } from "../BasicComponents";
import { ContentFromHtml } from "./ContentFromHtml";
import { Icon } from "react-native-eva-icons";

interface Props {
  title: string;
  content: string;
  isExpanded: boolean;
  toggleAccordion: () => void;
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
`;

const AccordionContainer = styled.View`
  margin-bottom: ${theme.margin}px;
  margin-top: ${theme.margin}px;
`;
export const Accordion = (props: Props) => {
  return (
    <AccordionContainer>
      <TitleContainer
        onPress={props.toggleAccordion}
        isExpanded={props.isExpanded}
      >
        <TextSmallBold>{props.title}</TextSmallBold>
        <Icon
          name={props.isExpanded ? "chevron-up" : "chevron-down"}
          height={24}
          width={24}
          fill={theme.colors.black}
        />
      </TitleContainer>
      {props.isExpanded && <ContentFromHtml htmlContent={props.content} />}
    </AccordionContainer>
  );
};
