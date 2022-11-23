import React from "react";
import styled, { useTheme } from "styled-components/native";
import { HeaderContentProps } from "./HeaderContentProps";
import { TextSmallNormal } from "../../StyledText";
import { RTLTouchableOpacity } from "../../BasicComponents";
import { Picture } from "../../../types/interface";
import { ReadableText } from "../../ReadableText";
import { StreamlineIcon } from "../../StreamlineIcon";
import { firstLetterUpperCase } from "../../../libs";
import HeaderTitle from "./HeaderTitle";

const TitleContainer = styled.View`
  justify-content: center;
  min-height: 48px;
  padding-bottom: 8px;
`;

const ThemeText = styled(TextSmallNormal)`
  color: ${({ theme }) => theme.colors.black};
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? 0 : theme.margin)}px;
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? theme.margin : 0)}px;
  text-decoration-line: underline;
`;

const ThemeContainer = styled(RTLTouchableOpacity)`
  align-items: center;
`;

const Breadcrumb = styled.View`
  height: 32px;
`;

export interface HeaderContentContentsScreenProps extends HeaderContentProps {
  themeName: string;
  icon: Picture;
  navigation: any;
  needName: string;
}

export const HeaderContentContentsScreen = ({
  themeName,
  navigation,
  icon,
  needName,
}: HeaderContentContentsScreenProps) => {
  const theme = useTheme();
  return (
    <TitleContainer>
      <Breadcrumb>
        <ThemeContainer onPress={navigation.goBack} accessibilityRole="button">
          <ThemeText>
            <ReadableText overridePosY={0}>
              {firstLetterUpperCase(themeName)}
            </ReadableText>
          </ThemeText>
          <StreamlineIcon stroke={theme.colors.black} icon={icon} size={16} />
        </ThemeContainer>
      </Breadcrumb>
      <HeaderTitle>
        <ReadableText overridePosY={10}>{needName}</ReadableText>
      </HeaderTitle>
    </TitleContainer>
  );
};

export default HeaderContentContentsScreen;
