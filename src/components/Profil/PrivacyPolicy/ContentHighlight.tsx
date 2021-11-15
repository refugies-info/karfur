import * as React from "react";
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";
import { theme } from "../../../theme";
import { TextNormalBold } from "../../StyledText";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";

const ContentHighlightContainer = styled.View`
  background-color: ${theme.colors.lightRed};
  padding: ${theme.margin * 3}px;
  border-radius: ${theme.radius * 2}px;
`;
const ContentHighlightTitle = styled.View`
  flex-direction: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "row-reverse" : "row"};
  align-items: center;
  margin-bottom: ${theme.margin * 2}px;
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
          fill={theme.colors.black}
          style={{
            marginRight: !isRTL ? theme.margin : 0,
            marginLeft: isRTL ? theme.margin : 0
           }}
        />
        <TextNormalBold>Bon à savoir</TextNormalBold>
      </ContentHighlightTitle>
      {props.children}
    </ContentHighlightContainer>
  )
}
