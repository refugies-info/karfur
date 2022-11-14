import React from "react";
import { ScrollView } from "react-native";
import Modal from "react-native-modal";

import useNotificationsModal from "./useNotificationsModal";
import { EnableNotifications } from "../EnableNotifications";

const NotificationsModal = () => {
  const { visible, hide } = useNotificationsModal();
  return (
    <Modal isVisible={visible}>
      <ScrollView>
        <EnableNotifications onDismiss={hide} />
      </ScrollView>
    </Modal>
  );
};

export default NotificationsModal;
