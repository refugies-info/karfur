import React from "react";
import styled from "styled-components/native";
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

const NeedContainer = styled(RTLTouchableOpacity)`
  padding:${theme.margin * 2}px
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  box-shadow: 0px 8px 16px rgba(33, 33, 33, 0.24);
  justify-content:space-between;
  align-items :center;
  elevation:2;
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
  width: 64px;
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
  tagName: string;
  tagDarkColor: string;
  tagVeryLightColor: string;
  tagLightColor: string;
  iconName: string;
  searchItem?: any;
  style?: any;
  backScreen?: string;
  onPressCallback?: () => void;
}

export const NeedsSummary = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();

  const indicatorText = props.nbContents && props.nbContents < 2
    ? t("NeedsScreen.fiche", "fiche")
    : t("NeedsScreen.fiches", "fiches");

  return (
    <NeedContainer
      onPress={() => {
        logEventInFirebase(FirebaseEvent.CLIC_NEED, {
          need: props.needTextFr,
        });
        if (props.onPressCallback) props.onPressCallback()

        props.navigation.navigate("Explorer", {
          screen: "ContentsScreen",
          params: {
            tagName: props.tagName,
            tagDarkColor: props.tagDarkColor,
            tagVeryLightColor: props.tagVeryLightColor,
            tagLightColor: props.tagLightColor,
            needId: props.id,
            iconName: props.iconName,
            backScreen: props.backScreen
          }
        });
        return;
      }}
      style={props.style || {}}
    >
      <StyledText color={props.tagDarkColor}>
        {props.searchItem ?
          <Highlight
            hit={props.searchItem}
            attribute={`title_${props.searchLanguageMatch || "fr"}`}
          /> :
          props.needText
        }
      </StyledText>

      {props.nbContents &&
        <IndicatorContainer backgroundColor={props.tagDarkColor} isRTL={isRTL}>
          <IndicatorNumber isRTL={isRTL}>
            {props.nbContents}
          </IndicatorNumber>
          <IndicatorText>{indicatorText}</IndicatorText>
        </IndicatorContainer>
      }
    </NeedContainer>
  )
}
