import * as React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { RTLTouchableOpacity } from "../BasicComponents";
import { StyledTextNormalBold } from "../StyledText";
import { styles } from "../../theme";
import { firstLetterUpperCase } from "../../libs";
import { StreamlineIcon } from "../StreamlineIcon";
import Highlight from "../Search/Highlight";
import { ReadableText } from "../ReadableText";
import { LinearGradient, LinearGradientPoint } from "expo-linear-gradient";
import isArray from "lodash/isArray";
import { Picture } from "@refugies-info/api-types";

interface Props {
  backgroundColor: string | Array<any>;
  icon?: Picture;
  iconSize?: number;
  inline?: boolean;
  name?: string;
  onPress: () => void;
  searchItem?: any;
  searchLanguageMatch?: string;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}

const StyledContainer = styled(LinearGradient)<{ inline?: boolean }>`
  ${({ inline, theme }) =>
    !inline ? "flex: 1;" : `margin-right: ${theme.margin * 2}px;`}
  padding-vertical: ${({ theme }) => theme.margin}px;
  padding-horizontal: ${({ theme }) => theme.margin * 2}px;
  margin-vertical: ${({ theme }) => theme.margin}px;
  border-radius: ${({ theme }) => theme.radius * 2}px;
  background-color: white;
  ${({ theme }) => theme.shadows.sm}
`;

const StyledText = styled(StyledTextNormalBold)<{ color?: string }>`
  color: ${({ color, theme }) => (color ? color : theme.colors.white)};
  margin-left: ${({ theme }) => (theme.isRTL ? theme.margin : 0)}px;
  margin-right: ${({ theme }) => (theme.isRTL ? 0 : theme.margin)}px;
  flex-shrink: 1;
`;

const RTLButton = styled(RTLTouchableOpacity)`
  justify-content: space-between;
  align-items: center;
`;

const GRADIENT_START: LinearGradientPoint = [0, 1];
const GRADIENT_END: LinearGradientPoint = [1, 0];

const TagButtonComponent = ({
  backgroundColor,
  icon,
  iconSize = 20,
  inline,
  name,
  onPress = () => null,
  searchItem,
  searchLanguageMatch,
  style = {},
  textColor,
}: Props) => {
  const gradientBackgroundColor = React.useMemo(
    () =>
      isArray(backgroundColor)
        ? backgroundColor
        : [backgroundColor, backgroundColor],
    [backgroundColor]
  );
  return (
    <StyledContainer
      start={GRADIENT_START}
      end={GRADIENT_END}
      colors={gradientBackgroundColor}
      style={style}
      inline={inline}
    >
      <RTLButton onPress={onPress} accessibilityRole="button">
        <StyledText color={textColor}>
          {searchItem ? (
            <Highlight
              hit={searchItem}
              attribute={`name_${searchLanguageMatch || "fr"}`}
              //@ts-ignore
              capitalize={true}
              //@ts-ignore
              color={backgroundColor}
              //@ts-ignore
              colorNotHighlighted={styles.colors.white}
            />
          ) : (
            <ReadableText>{firstLetterUpperCase(name || "")}</ReadableText>
          )}
        </StyledText>
        {icon && <StreamlineIcon icon={icon} size={iconSize} />}
      </RTLButton>
    </StyledContainer>
  );
};

export const TagButton = React.memo(TagButtonComponent);
