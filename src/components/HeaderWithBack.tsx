import * as React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import useToggle from "react-use/lib/useToggle";
import { Icon } from "react-native-eva-icons";

import { SmallButton } from "./SmallButton";
import { RowContainer, RTLView } from "./BasicComponents";
import { styles } from "../theme";
import { StyledTextSmallBold } from "./StyledText";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { LanguageSwitch } from "./Language/LanguageSwitch";
import { logEventInFirebase } from "../utils/logEvent";
import { FirebaseEvent } from "../utils/eventsUsedInFirebase";
import { LanguageChoiceModal } from "../screens/Modals/LanguageChoiceModal";
import { useNavigation } from "@react-navigation/native";

const TopButtonsContainer = styled(RowContainer)`
  justify-content: flex-start;
  padding-horizontal: ${({ theme }) => theme.margin * 3}px;
  z-index: 2;
  padding-top: ${({ theme }) => theme.margin}px;
`;

const StyledText = styled(StyledTextSmallBold)`
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? 0 : theme.margin)}px;
  margin-right: ${({ theme }) => (theme.i18n.isRTL ? theme.margin : 0)}px;
`;

const ICON_SIZE = 24;

const LabelIconView = styled(RTLView)`
  flex: 1;
  margin-right: ${({ theme }) => (!theme.i18n.isRTL ? styles.margin * 7 : 0)}px;
  margin-left: ${({ theme }) => (theme.i18n.isRTL ? styles.margin * 7 : 0)}px;
  justify-content: center;
`;

interface Props {
  iconName?: string;
  text?: string;
  showLanguageSwitch?: boolean;
}

export const HeaderWithBack = ({
  iconName,
  text,
  showLanguageSwitch = false,
}: Props) => {
  const navigation = useNavigation();
  const { t } = useTranslationWithRTL();
  const [isLanguageModalVisible, toggleLanguageModal] = useToggle(false);

  return (
    <TopButtonsContainer>
      <SmallButton
        iconName="arrow-back-outline"
        onPress={navigation.goBack}
        label={t("global.back_button_accessibility")}
      />
      {iconName && text && (
        <LabelIconView>
          <Icon
            name={iconName}
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={styles.colors.black}
          />
          <StyledText>{text}</StyledText>
        </LabelIconView>
      )}
      {showLanguageSwitch && (
        <>
          <LanguageChoiceModal
            isModalVisible={isLanguageModalVisible}
            toggleModal={toggleLanguageModal}
          />
          <View style={{ marginLeft: "auto" }}>
            <LanguageSwitch
              onLongPressSwitchLanguage={() => {
                logEventInFirebase(
                  FirebaseEvent.LONG_PRESS_CHANGE_LANGUAGE,
                  {}
                );
                toggleLanguageModal();
              }}
            />
          </View>
        </>
      )}
    </TopButtonsContainer>
  );
};

HeaderWithBack.defaultProps = {
  showLanguageSwitch: false,
};
