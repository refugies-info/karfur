import React from "react";
import { ScrollView } from "react-native";
import Modal from "react-native-modal";

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
  return (
    <Modal isVisible={visible}>
      <ScrollView>
        <EnableNotifications onDismiss={hide} />
      </ScrollView>
    </Modal>
  );
};

export default NotificationsModal;
