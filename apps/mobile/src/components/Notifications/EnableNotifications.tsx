import LottieView from "lottie-react-native";
import React from "react";
import { View } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { TextDSFR_XL, TextDSFR_MD } from "../../components/StyledText";
import { useNotificationsStatus } from "../../hooks/useNotificationsStatus";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { ReadableText } from "../ReadableText";
import { ButtonDSFR } from "../buttons";
import { Spacer } from "../layout";

const Title = styled(TextDSFR_XL)`
  margin-top: ${({ theme }) => theme.margin * 8}px;
`;
const Subtitle = styled(TextDSFR_MD)`
  margin-top: ${({ theme }) => theme.margin * 2}px;
  text-align: center;
`;
const Container = styled.View`
  align-items: center;
  margin-vertical: 20%;
`;
const LottieContainer = styled.View`
  height: 120px;
  width: 120px;
`;

interface Props {
  onDismiss?: () => void | undefined;
  onDone?: () => void | undefined;
}

export const EnableNotifications = ({ onDismiss, onDone }: Props) => {
  const theme = useTheme();
  const { t } = useTranslationWithRTL();
  const [, registerForNotifications] = useNotificationsStatus();

  const register = async () => {
    await registerForNotifications();
    onDone?.();
  };

  return (
    <View>
      <Container>
        <LottieContainer>
          <LottieView
            colorFilters={[{ keypath: "bell icon", color: "#c8c8c8" }]}
            source={require("../../theme/lottie/bell-animation.json")}
            autoPlay
            loop
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </LottieContainer>
        <Title>
          <ReadableText>{t("notifications.enableNotifications")}</ReadableText>
        </Title>
        <Subtitle>
          <ReadableText>{t("notifications.beInformed")}</ReadableText>
        </Subtitle>
      </Container>

      <ButtonDSFR
        title={t("notifications.enableNotifications")}
        accessibilityLabel={t("notifications.enableNotifications")}
        priority="primary"
        iconName="checkmark-outline"
        iconAfter
        onPress={register}
        style={{ width: "100%", maxHeight: 100 }}
      />
      {onDismiss && (
        <>
          <Spacer height={theme.margin * 2} />
          <ButtonDSFR
            title={t("notifications.notNow")}
            accessibilityLabel={t("notifications.notNow")}
            onPress={onDismiss}
            priority="tertiary no outline"
            style={{ width: "100%", maxHeight: 100 }}
          />
        </>
      )}
    </View>
  );
};
