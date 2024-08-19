import React from "react";
import { ScrollView } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "styled-components/native";
import useNotificationsModal from "./useNotificationsModal";
import { EnableNotifications } from "../EnableNotifications";

interface Props {
  /**
   * delay in ms before showing the modal for the first time
   */
  delay?: number;
}

const NotificationsModal = (props: Props) => {
  const { visible, hide } = useNotificationsModal(props.delay || 0);
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <Modal isVisible={visible}>
      <ScrollView
        contentContainerStyle={{
          marginTop: insets.top + theme.margin * 2,
          borderRadius: theme.radius * 2,
          backgroundColor: "white",
          padding: theme.margin * 3,
        }}
      >
        <EnableNotifications onDismiss={hide} />
      </ScrollView>
    </Modal>
  );
};

export default NotificationsModal;
