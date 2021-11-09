import * as React from "react";
import styled from "styled-components/native";
import { RTLTouchableOpacity } from "../BasicComponents";
import { StyledTextNormalBold } from "../StyledText";
import { theme } from "../../theme";
import { firstLetterUpperCase } from "../../libs";
import { StreamlineIcon } from "../StreamlineIcon";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import Highlight from "../Search/Highlight";

interface Props {
  tagName?: string;
  backgroundColor: string;
  iconName: string;
  onPress: () => void;
  inline?: boolean;
  searchItem?: any;
  searchLanguageMatch?: string;
}

const StyledContainer = styled(RTLTouchableOpacity)`
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor};
  ${(props: { inline: boolean }) => !props.inline ? `
  flex: 1;
  ` : `
  margin-right: ${theme.margin * 2}px;
  `}
  padding: ${theme.margin * 2}px;
  margin-vertical: ${theme.margin}px;
  border-radius: ${theme.radius * 2}px;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 2px rgba(33, 33, 33, 0.4);
  elevation: 1;
`;
const StyledText = styled(StyledTextNormalBold)`
  color: ${theme.colors.white};
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  flex-shrink: 1;
`;
export const TagButton = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();

  return (
    <StyledContainer
      backgroundColor={props.backgroundColor}
      inline={props.inline}
      onPress={props.onPress}
    >
      <StyledText isRTL={isRTL}>
        {props.searchItem ?
          <Highlight
            hit={props.searchItem}
            attribute={`name_${props.searchLanguageMatch || "fr"}`}
            //@ts-ignore
            capitalize={true}
            //@ts-ignore
            color={props.backgroundColor}
            //@ts-ignore
            colorNotHighlighted={theme.colors.white}
          /> :
          firstLetterUpperCase(t("Tags." + props.tagName, props.tagName))
        }
      </StyledText>
      <StreamlineIcon name={props.iconName} width={20} height={20} />
    </StyledContainer>
  );
};
