import React from "react";
import styled from "styled-components/native";
import { StyleProp, ViewStyle } from "react-native";
import { styles } from "../../theme";
import {
  TextVerySmallNormal,
  TextSmallBold
} from "../../components/StyledText";
import { RTLTouchableOpacity, RTLView } from "../../components/BasicComponents";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import Highlight from "../Search/Highlight";
import { Theme } from "../../types/interface";
import { ReadableText } from "../ReadableText";

const NeedContainer = styled(RTLTouchableOpacity)`
  padding:${styles.margin * 2}px
  background-color: ${styles.colors.white};
  border-radius: ${styles.radius * 2}px;
  ${styles.shadows.lg}
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
    props.isRTL ? 0 : styles.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin : 0}px;
  minWidth: 64px;
  paddingHorizontal: ${styles.margin}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IndicatorText = styled(TextVerySmallNormal)`
  color: ${styles.colors.white};
`;

const IndicatorNumber = styled(TextVerySmallNormal)`
  color: ${styles.colors.white};
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : styles.margin / 2}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin / 2 : 0}px;
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
  theme: Theme;
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
            theme: props.theme,
            needId: props.id,
            backScreen: props.backScreen
          }
        });
        return;
      }}
      style={props.style || {}}
    >
      <StyledText color={props.theme.colors.color100}>
        {props.searchItem ?
          <Highlight
            hit={props.searchItem}
            attribute={`title_${props.searchLanguageMatch || "fr"}`}
            //@ts-ignore
            color={props.theme.colors.color100}
          /> :
          <ReadableText>{props.needText || ""}</ReadableText>
        }
      </StyledText>

      {!!props.nbContents &&
        <IndicatorContainer backgroundColor={props.theme.colors.color100} isRTL={isRTL}>
          <IndicatorNumber isRTL={isRTL}>
            {props.nbContents}
          </IndicatorNumber>
          <IndicatorText>{indicatorText}</IndicatorText>
        </IndicatorContainer>
      }
    </NeedContainer>
  )
}
