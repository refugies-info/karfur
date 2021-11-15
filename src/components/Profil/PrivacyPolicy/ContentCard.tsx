import * as React from "react";
import styled from "styled-components/native";
import { theme } from "../../../theme";
import { TextNormalBold } from "../../StyledText";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";

const ContentCardContainer = styled.View`
  background-color: ${theme.colors.white};
  padding: ${theme.margin * 3}px;
  margin-bottom: ${theme.margin * 3}px;
  border-radius: ${theme.radius * 2}px;
  box-shadow: 1px 1px 8px rgba(33, 33, 33, 0.24);
  elevation: 4;
`;
const ContentCardTitle = styled.View`
  flex-direction: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "row-reverse" : "row"};
  align-items: center;
  margin-bottom: ${theme.margin * 3}px;
  max-width: 100%;
`;
const ContentCardTitleNumber = styled.View`
  background-color: ${theme.colors.black};
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  margin-right: ${(props: { isRTL: boolean }) =>
    !props.isRTL ? theme.margin * 2 : 0}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin * 2 : 0}px;
`;
const ContentCardTitleNumberText = styled(TextNormalBold)`
  color: ${theme.colors.white};
`;

interface Props {
  title: string;
  step: string;
  children: any;
}

export const ContentCard = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <ContentCardContainer>
      <ContentCardTitle isRTL={isRTL}>
        <ContentCardTitleNumber isRTL={isRTL}>
          <ContentCardTitleNumberText>{props.step}</ContentCardTitleNumberText>
        </ContentCardTitleNumber>
        <TextNormalBold style={{ flex: 1, flexWrap: "wrap" }}>{props.title}</TextNormalBold>
      </ContentCardTitle>
      {props.children}
    </ContentCardContainer>
  )
};
