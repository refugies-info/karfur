import * as React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { RTLTouchableOpacity } from "../BasicComponents";
import { StyledTextNormalBold } from "../StyledText";
import { styles } from "../../theme";
import { firstLetterUpperCase } from "../../libs";
import { StreamlineIcon } from "../StreamlineIcon";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import Highlight from "../Search/Highlight";
import { ReadableText } from "../ReadableText";
import { Picture } from "../../types/interface";

interface Props {
  name?: string;
  backgroundColor: string;
  icon: Picture;
  onPress: () => void;
  inline?: boolean;
  searchItem?: any;
  searchLanguageMatch?: string;
  style?: StyleProp<ViewStyle>;
}

const StyledContainer = styled(RTLTouchableOpacity)`
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor};
  ${(props: { inline: boolean }) => !props.inline ? `
  flex: 1;
  ` : `
  margin-right: ${styles.margin * 2}px;
  `}
  padding: ${styles.margin * 2}px;
  margin-vertical: ${styles.margin}px;
  border-radius: ${styles.radius * 2}px;
  justify-content: space-between;
  align-items: center;
  ${styles.shadows.lg}
`;
const StyledText = styled(StyledTextNormalBold)`
  color: ${styles.colors.white};
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin : 0}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : styles.margin}px;
  flex-shrink: 1;
`;
export const TagButton = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();

  return (
    <StyledContainer
      backgroundColor={props.backgroundColor}
      inline={props.inline}
      onPress={props.onPress}
      accessibilityRole="button"
      style={props.style || {}}
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
            colorNotHighlighted={styles.colors.white}
          /> :
          <ReadableText>
            {firstLetterUpperCase(props.name || "")}
          </ReadableText>
        }
      </StyledText>
      {props.icon && <StreamlineIcon icon={props.icon} size={20} />}
    </StyledContainer>
  );
};
