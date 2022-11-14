import React from "react";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

import { styles } from "../../theme";

import { useNotificationsStatus } from "../../hooks/useNotificationsStatus";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

import {
  StyledTextBigBold,
  StyledTextNormal,
} from "../../components/StyledText";
import { CustomButton } from "../CustomButton";
import styled, { useTheme } from "styled-components/native";

const Container = styled.View`
  display: flex;
  margin-top: ${({ theme }) => theme.insets.top}px;
  border-radius: ${({ theme }) => theme.radius * 2}px;
  background-color: ${({ theme }) => theme.colors.white};
  align-items: ${({ theme }) => (theme.i18n.isRTL ? "flex-end" : "flex-start")};
  justify-content: space-between;
  padding: ${({ theme }) => theme.margin * 3}px;
`;

const stylesheet = StyleSheet.create({
  lottieContainer: {
    height: 160,
    width: 160,
  },
  titles: {
    alignSelf: "center",
    marginBottom: styles.margin * 2,
  },
  separator: {
    marginVertical: styles.margin * 2,
  },
});

interface Props {
  onDismiss?: () => void | undefined;
}

export const EnableNotifications = ({ onDismiss }: Props) => {
  const { t } = useTranslationWithRTL();
  const theme = useTheme();
  const [, registerForNotifications] = useNotificationsStatus();

  return (
    <Container>
      <LottieView
        colorFilters={[{ keypath: "bell icon", color: "#ffcd31" }]}
        style={stylesheet.lottieContainer}
        source={require("../../theme/lottie/notification-bell-animation.json")}
        autoPlay
        loop
        speed={1.2}
      />
      <View style={stylesheet.titles}>
        <StyledTextBigBold>
          {t("notifications.newInfoEveryWeek")}
        </StyledTextBigBold>
        <View style={stylesheet.separator} />
        <StyledTextNormal>{t("notifications.beInformed")}</StyledTextNormal>
      </View>
      <CustomButton
        i18nKey="notifications.enableNotifications"
        backgroundColor={theme.colors.darkBlue}
        iconName="checkmark-outline"
        defaultText="Activer les notifications"
        textColor={theme.colors.white}
        onPress={registerForNotifications}
        isTextNotBold={true}
      />
      {onDismiss && (
        <>
          <View
            style={{
              marginVertical: theme.margin,
            }}
          />
          <CustomButton
            i18nKey="notifications.notNow"
            backgroundColor={theme.colors.white}
            defaultText="Pas maintenant"
            textColor={theme.colors.black}
            onPress={onDismiss}
            isTextNotBold={true}
            withShadows={false}
          />
        </>
      )}
    </Container>
  );
};
