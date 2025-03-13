import { Modal, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "styled-components/native";
import { EnableNotifications } from "../EnableNotifications";
import useNotificationsModal from "./useNotificationsModal";

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
    <Modal visible={visible}>
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
