import * as React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingParamList } from "../../../types";
import PageOnboarding from "../../components/layout/PageOnboarding";
import { EnableNotifications } from "../../components/Notifications/EnableNotifications";

export const ActivateNotificationsScreen = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "ActivateNotificationsScreen">) => {
  const onEnd = React.useCallback(
    () => navigation.navigate("FinishOnboarding"),
    [navigation]
  );
  return (
    <PageOnboarding>
      <EnableNotifications onDismiss={onEnd} onDone={onEnd} />
    </PageOnboarding>
  );
};
