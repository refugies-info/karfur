import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { Spacer } from "~/components";
import PageOnboarding from "~/components/layout/PageOnboarding";
import { EnableNotifications } from "~/components/Notifications/EnableNotifications";
import { NOTIFICATIONS_MODAL_SEEN_KEY } from "~/components/Notifications/NotificationsModal/useNotificationsModal";
import type { OnboardingParamList } from "~/types/navigation";

export const ActivateNotificationsScreen = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "ActivateNotificationsScreen">) => {
  const onEnd = React.useCallback(async () => {
    await AsyncStorage.setItem(NOTIFICATIONS_MODAL_SEEN_KEY, "true");
    navigation.navigate("FinishOnboarding");
  }, [navigation]);

  return (
    <PageOnboarding>
      <EnableNotifications onDismiss={onEnd} onDone={onEnd} />
      <Spacer height={50} />
    </PageOnboarding>
  );
};
