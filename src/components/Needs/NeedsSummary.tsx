import React from "react";
import styled from "styled-components/native";
import { StyleProp, ViewStyle } from "react-native";
import { theme } from "../../theme";
import {
  TextVerySmallNormal,
  TextSmallBold
} from "../../components/StyledText";
import { RTLTouchableOpacity, RTLView } from "../../components/BasicComponents";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import Highlight from "../Search/Highlight";
import { ThemeTag } from "../../types/interface";

const NeedContainer = styled(RTLTouchableOpacity)`
  padding:${theme.margin * 2}px
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  ${theme.shadows.lg}
  justify-content:space-between;
  align-items :center;
`;

const IndicatorContainer = styled(RTLView)`
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor};
  align-self: center;
  border-radius: 8px;
  height: 32px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
  minWidth: 64px;
  paddingHorizontal: ${theme.margin}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IndicatorText = styled(TextVerySmallNormal)`
  color: ${theme.colors.white};
`;

const IndicatorNumber = styled(TextVerySmallNormal)`
  color: ${theme.colors.white};
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin / 2}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin / 2 : 0}px;
`;
const StyledText = styled(TextSmallBold)`
  color: ${(props: { color: string }) => props.color};
`;

interface Props {
  id: string
  needText?: string
  needTextFr: string
  nbContents?: number
  searchLanguageMatch?: string;
  navigation: any;
  themeTag: ThemeTag;
  searchItem?: any;
  style?: StyleProp<ViewStyle>;
  backScreen?: string;
}

export const NeedsSummary = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();

  const indicatorText = props.nbContents && props.nbContents < 2
    ? t("needs_screen.fiche", "fiche")
    : t("needs_screen.fiches", "fiches");

  return (
    <NeedContainer
      accessibilityRole="button"
      onPress={() => {
        logEventInFirebase(FirebaseEvent.CLIC_NEED, {
          need: props.needTextFr,
        });

        props.navigation.navigate("Explorer", {
          screen: "ContentsScreen",
          params: {
            colors: props.themeTag,
            needId: props.id,
            backScreen: props.backScreen
          }
        });
        return;
      }}
      style={props.style || {}}
    >
      <StyledText color={props.themeTag.tagDarkColor}>
        {props.searchItem ?
          <Highlight
            hit={props.searchItem}
            attribute={`title_${props.searchLanguageMatch || "fr"}`}
            //@ts-ignore
            color={props.tagDarkColor}
          /> :
          props.needText
        }
      </StyledText>

      {!!props.nbContents &&
        <IndicatorContainer backgroundColor={props.themeTag.tagDarkColor} isRTL={isRTL}>
          <IndicatorNumber isRTL={isRTL}>
            {props.nbContents}
          </IndicatorNumber>
          <IndicatorText>{indicatorText}</IndicatorText>
        </IndicatorContainer>
      }
    </NeedContainer>
  )
}
