import * as React from "react";
import styled from "styled-components/native";
import { styles } from "../../../theme";
import { TextNormalBold } from "../../StyledText";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";

const ContentCardContainer = styled.View`
  background-color: ${styles.colors.white};
  padding: ${styles.margin * 3}px;
  margin-bottom: ${styles.margin * 3}px;
  border-radius: ${styles.radius * 2}px;
  ${styles.shadows.lg}
`;
const ContentCardTitle = styled.View<{ isRTL: boolean }>`
  flex-direction: ${({ isRTL }) => (isRTL ? "row-reverse" : "row")};
  align-items: center;
  margin-bottom: ${styles.margin * 3}px;
  max-width: 100%;
`;
const ContentCardTitleNumber = styled.View<{ isRTL: boolean }>`
  background-color: ${styles.colors.black};
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  margin-right: ${({ isRTL }) => (!isRTL ? styles.margin * 2 : 0)}px;
  margin-left: ${({ isRTL }) => (isRTL ? styles.margin * 2 : 0)}px;
`;
const ContentCardTitleNumberText = styled(TextNormalBold)`
  color: ${styles.colors.white};
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
        <TextNormalBold style={{ flex: 1, flexWrap: "wrap" }}>
          {props.title}
        </TextNormalBold>
      </ContentCardTitle>
      {props.children}
    </ContentCardContainer>
  );
};
