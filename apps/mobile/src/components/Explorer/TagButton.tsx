import type { Picture } from "@refugies-info/api-types";
import { LinearGradient, type LinearGradientPoint } from "expo-linear-gradient";
import isArray from "lodash/isArray";
import * as React from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import styled from "styled-components/native";
import { TagImage } from "~/components/Explorer/TagImage";
import type { SearchItem } from "~/components/Search/types";
import { firstLetterUpperCase } from "~/libs";
import { styles } from "~/theme";
import { RTLTouchableOpacity } from "../BasicComponents";
import { ReadableText } from "../ReadableText";
import Highlight from "../Search/Highlight";
import { TextDSFR_L_Bold } from "../StyledText";

interface Props {
  backgroundColor: string | [string, string];
  icon?: Picture;
  iconSize?: number;
  inline?: boolean;
  name?: string;
  onPress: () => void;
  searchItem?: SearchItem;
  searchLanguageMatch?: string;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}

const StyledContainer = styled(LinearGradient)<{ inline?: boolean }>`
  ${({ inline, theme }) => (!inline ? "flex: 1;" : `margin-right: ${theme.margin * 2}px;`)}
  padding-vertical: ${({ theme }) => theme.margin}px;
  padding-horizontal: ${({ theme }) => theme.margin * 2}px;
  margin-vertical: ${({ theme }) => theme.margin}px;
  border-radius: ${({ theme }) => theme.radius * 2}px;
  background-color: white;
  ${({ theme }) => theme.shadows.sm}
`;

const StyledText = styled(TextDSFR_L_Bold)<{ color?: string }>`
  color: ${({ color, theme }) => (color ? color : theme.colors.white)};
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? theme.margin : 0)}px;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? 0 : theme.margin)}px;
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
  iconSize = 32,
  inline,
  name,
  onPress = () => null,
  searchItem,
  searchLanguageMatch,
  style = {},
  textColor,
}: Props) => {
  const gradientBackgroundColor = React.useMemo<[string, string]>(
    () => (isArray(backgroundColor) ? backgroundColor : [backgroundColor, backgroundColor]),
    [backgroundColor],
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
              capitalize={true}
              color={isArray(backgroundColor) ? backgroundColor[0] : backgroundColor}
              colorNotHighlighted={styles.colors.white}
            />
          ) : (
            <ReadableText>{firstLetterUpperCase(name || "")}</ReadableText>
          )}
        </StyledText>
        {icon && (
          <View style={{ width: iconSize, height: iconSize, overflow: "hidden" }}>
            {/* view below manually centers the image to remove the empty space at the bottom */}
            <View style={{ height: iconSize * 1.4 }}>
              <TagImage appImage={icon} />
            </View>
          </View>
        )}
      </RTLButton>
    </StyledContainer>
  );
};

export const TagButton = React.memo(TagButtonComponent);
