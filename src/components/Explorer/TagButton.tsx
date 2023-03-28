import * as React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { RTLTouchableOpacity } from "../BasicComponents";
import { StyledTextNormalBold } from "../StyledText";
import { styles } from "../../theme";
import { firstLetterUpperCase } from "../../libs";
import { StreamlineIcon } from "../StreamlineIcon";
import Highlight from "../Search/Highlight";
import { ReadableText } from "../ReadableText";
import { LinearGradient } from "expo-linear-gradient";
import { isArray } from "lodash";
import { Picture } from "@refugies-info/api-types";

interface Props {
  name?: string;
  backgroundColor: string | Array<any>;
  icon: Picture;
  iconSize?: number;
  onPress: () => void;
  inline?: boolean;
  searchItem?: any;
  searchLanguageMatch?: string;
  style?: StyleProp<ViewStyle>;
}

const StyledContainer = styled(LinearGradient)<{
  inline?: boolean;
}>`
  ${({ inline, theme }) =>
    !inline
      ? `
  flex: 1;
  `
      : `
  margin-right: ${theme.margin * 2}px;
  `}
  padding-vertical: ${({ theme }) => theme.margin}px;
  padding-horizontal: ${({ theme }) => theme.margin * 2}px;
  margin-vertical: ${({ theme }) => theme.margin}px;
  border-radius: ${({ theme }) => theme.radius * 2}px;
  ${({ theme }) => theme.shadows.lg}
`;

const StyledText = styled(StyledTextNormalBold)`
  color: ${({ theme }) => theme.colors.white};
  margin-left: ${({ theme }) => (theme.isRTL ? theme.margin : 0)}px;
  margin-right: ${({ theme }) => (theme.isRTL ? 0 : theme.margin)}px;
  flex-shrink: 1;
`;

export const TagButton = ({
  backgroundColor,
  icon,
  iconSize = 20,
  inline,
  name,
  onPress = () => null,
  searchItem,
  searchLanguageMatch,
  style = {},
}: Props) => {
  const theme = useTheme();
  return (
    <StyledContainer
      start={[0, 1]}
      end={[1, 0]}
      colors={
        isArray(backgroundColor)
          ? backgroundColor
          : [backgroundColor, backgroundColor]
      }
      style={style}
      inline={inline}
    >
      <RTLTouchableOpacity
        onPress={onPress}
        accessibilityRole="button"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <StyledText>
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
      </RTLTouchableOpacity>
    </StyledContainer>
  );
};
