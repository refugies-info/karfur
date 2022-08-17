import * as React from "react";
import { SmallButton } from "./SmallButton";
import { RowContainer, RTLView } from "./BasicComponents";
import styled from "styled-components/native";
import { styles } from "../theme";
import { StyledTextSmallBold } from "./StyledText";
import { Icon } from "react-native-eva-icons";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { LanguageSwitch } from "./Language/LanguageSwitch";
import { logEventInFirebase } from "../utils/logEvent";
import { FirebaseEvent } from "../utils/eventsUsedInFirebase";
import { View } from "react-native";

const TopButtonsContainer = styled(RowContainer)`
  justify-content: flex-start;
  padding-horizontal: ${styles.margin * 3}px;
  z-index: 2;
  padding-top: ${styles.margin}px;
`;

const StyledText = styled(StyledTextSmallBold)`
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : styles.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin : 0}px;
`;

const ICON_SIZE = 24;

interface Props {
  iconName?: string;
  text?: string;
  navigation: any;
  backHandler?: () => void;
  onLongPressSwitchLanguage?: () => void;
}

export const HeaderWithBack = (props: Props) => {
  const { t, isRTL } = useTranslationWithRTL();

  return (
    <TopButtonsContainer>
      <SmallButton
        iconName="arrow-back-outline"
        onPress={props.backHandler || props.navigation.goBack}
        label={t("global.back_button_accessibility")}
      />
      {props.iconName && props.text && (
        <RTLView style={{
          flex: 1,
          marginRight: !isRTL ? styles.margin * 7 : 0,
          marginLeft: isRTL ? styles.margin * 7 : 0,
          justifyContent: "center",
        }}>
          <Icon
            name={props.iconName}
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={styles.colors.black}
          />
          <StyledText isRTL={isRTL}>{props.text}</StyledText>
        </RTLView>
      )}
      {!!props.onLongPressSwitchLanguage && (
        <View style={{ marginLeft: "auto" }}>
          <LanguageSwitch
            onLongPressSwitchLanguage={() => {
              logEventInFirebase(FirebaseEvent.LONG_PRESS_CHANGE_LANGUAGE, {});
              if (props.onLongPressSwitchLanguage) {
                props.onLongPressSwitchLanguage();
              }
            }}
          />
        </View>
      )}
    </TopButtonsContainer>
  );
};
