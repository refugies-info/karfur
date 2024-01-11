import * as React from "react";
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";
import { styles } from "../../../theme";
import { TextNormalBold } from "../../StyledText";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";

const ContentHighlightContainer = styled.View`
  background-color: ${styles.colors.lightRed};
  padding: ${styles.margin * 3}px;
  border-radius: ${styles.radius * 2}px;
`;
const ContentHighlightTitle = styled.View<{ isRTL: boolean }>`
  flex-direction: ${({ isRTL }) => (isRTL ? "row-reverse" : "row")};
  align-items: center;
  margin-bottom: ${styles.margin * 2}px;
`;

interface Props {
  children: any;
}

export const ContentHighlight = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <ContentHighlightContainer>
      <ContentHighlightTitle isRTL={isRTL}>
        <Icon
          name="info-outline"
          height={24}
          width={24}
          fill={styles.colors.black}
          style={{
            marginRight: !isRTL ? styles.margin : 0,
            marginLeft: isRTL ? styles.margin : 0,
          }}
        />
        <TextNormalBold>Bon à savoir</TextNormalBold>
      </ContentHighlightTitle>
      {props.children}
    </ContentHighlightContainer>
  );
};
