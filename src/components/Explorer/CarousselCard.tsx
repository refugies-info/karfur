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
import { Theme } from "../../types/interface";
import { useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";

interface Props {
  theme: Theme;
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
  const { isRTL } = useTranslationWithRTL();
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);

  return (
    <ButtonContainer
      accessibilityRole="button"
      accessibilityLabel={props.theme.name[currentLanguageI18nCode || "fr"]}
      activeOpacity={0.7}
      onPress={() => {
        logEventInFirebase(FirebaseEvent.CLIC_THEME, {
          theme: props.theme.name.fr,
          view: "carousel",
        });
        props.navigation.navigate("NeedsScreen", {
          theme: props.theme
        });
        return;
      }}
    >
      <CardGradient
        colors={[props.theme.colors.color60, props.theme.colors.color80]}
        width={props.cardWidth}
        height={props.cardHeight}
      >
        <View style={{ position: "absolute", top:0, left:0, right:0, bottom:0 }}>
          <TagImage theme={props.theme} />
        </View>
        <StyledContainer backgroundColor={props.theme.colors.color100}>
          <StyledText isRTL={isRTL}>
            {firstLetterUpperCase(props.theme.name[currentLanguageI18nCode || "fr"])}
          </StyledText>
          <StreamlineIcon icon={props.theme.icon} size={20} />
        </StyledContainer>
      </CardGradient>
    </ButtonContainer>
  );
};
