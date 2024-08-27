import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useNotificationsStatus } from "~/hooks/useNotificationsStatus";

const useNotifcationsModal = (
  delay: number,
): {
  visible: boolean;
  hide: () => void;
} => {
  const [accessGranted] = useNotificationsStatus();
  const [notificationsModalVisible, setNotificationsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const showModal = async () => {
      const keyExists = await AsyncStorage.getItem("notificationsModal");
      if (!accessGranted) {
        if (!keyExists) {
          setTimeout(() => {
            AsyncStorage.setItem("notificationsModal", "true").then(() => {
              setNotificationsModalVisible(true);
            });
          }, delay);
        }
      } else if (accessGranted && notificationsModalVisible) {
        setNotificationsModalVisible(false);
      }
    };

    showModal();
  }, [accessGranted]);

  return {
    visible: notificationsModalVisible,
    hide: () => setNotificationsModalVisible(false),
  };
};

export default useNotifcationsModal;
