import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useNotificationsStatus } from "../../../hooks/useNotificationsStatus";

const useNotifcationsModal = (): {
  visible: boolean;
  hide: () => void;
} => {
  const [accessGranted] = useNotificationsStatus();
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const showModal = async () => {
      const keyExists = await AsyncStorage.getItem("notificationsModal");
      if (!accessGranted) {
        if (!keyExists) {
          await AsyncStorage.setItem("notificationsModal", "true");
          setNotificationsModalVisible(true);
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
