import * as React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { RTLView } from "../BasicComponents";
import { styles } from "../../theme";
import { StyledTextSmallBold } from "../StyledText";
import { firstLetterUpperCase } from "../../libs";
import { StreamlineIcon } from "../StreamlineIcon";
import { LinearGradient } from "expo-linear-gradient";
import { TagImage } from "./TagImage";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { ExpandedTag } from "../../types/interface";

interface Props {
  tag: ExpandedTag;
  navigation: any;
  cardWidth: number;
  cardHeight: number;
}

const ButtonContainer = styled.TouchableOpacity`
  padding-vertical: ${styles.margin}px;
`;
const StyledContainer = styled(RTLView)`
  margin-horizontal: ${styles.margin * 2}px;
  margin-bottom: ${styles.margin * 2}px;
  margin-top: ${styles.margin * 3}px;
  padding-vertical: ${styles.margin * 2}px;
  padding-horizontal: ${styles.margin}px;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  border-radius: ${styles.radius * 2}px;
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor};
  ${styles.shadows.lg}
`;
const StyledText = styled(StyledTextSmallBold)`
  color: ${styles.colors.white};
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin : 0}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : styles.margin}px;
  flex-shrink: 1;
  flex-grow: 0;
`;
const CardGradient = styled(LinearGradient)`
  justify-content: flex-end;
  align-items: center;
  width: ${(props: { width: number }) => props.width}px;
  height: ${(props: { height: number }) => props.height}px;
  borderRadius: ${styles.radius * 2}px;
`;

export const CarousselCard = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();

  const getIconHorizontalAlignment = (iconName: string) => {
    if (["measure"].includes(iconName)) return "flex-start";
    if (["glasses", "flag"].includes(iconName)) return "flex-end";
    return "center";
  };

  const getIconVerticalAlignment = (iconName: string) => {
    if (["house", "glasses"].includes(iconName)) return "space-between";
    return "flex-end";
  };

  return (
    <ButtonContainer
      accessibilityRole="button"
      accessibilityLabel={t("tags." + props.tag.name)}
      activeOpacity={0.7}
      onPress={() => {
        logEventInFirebase(FirebaseEvent.CLIC_THEME, {
          theme: props.tag.name,
          view: "carousel",
        });
        props.navigation.navigate("NeedsScreen", {
          colors: {
            tagName: props.tag.name,
            tagDarkColor: props.tag.darkColor,
            tagVeryLightColor: props.tag.color30,
            tagLightColor: props.tag.lightColor,
            iconName: props.tag.icon,
          }
        });
        return;
      }}
    >
      <CardGradient
        colors={[props.tag.mdLightColor, props.tag.lightColor]}
        style={{
          alignItems: getIconHorizontalAlignment(props.tag.icon),
          justifyContent: getIconVerticalAlignment(props.tag.icon)
        }}
        width={props.cardWidth}
        height={props.cardHeight}
      >
        <View style={{ flexShrink: 1 }}>
          <TagImage name={props.tag.icon} />
        </View>
        <StyledContainer backgroundColor={props.tag.darkColor}>
          <StyledText isRTL={isRTL}>
            {firstLetterUpperCase(t("tags." + props.tag.name, props.tag.name))}
          </StyledText>
          <StreamlineIcon name={props.tag.icon} width={20} height={20} />
        </StyledContainer>
      </CardGradient>
    </ButtonContainer>
  );
};
