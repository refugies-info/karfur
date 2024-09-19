import NetInfo from "@react-native-community/netinfo";
import React from "react";
import { View } from "react-native";
import { Toast } from "./Toast";

export const ConnexionTest = () => {
  const [noInternet, setNoInternet] = React.useState(false);
  React.useEffect(() => {
    return NetInfo.addEventListener((state) => {
      if (!state.isConnected !== noInternet) {
        setNoInternet(!state.isConnected);
      }
    });
  }, []);

  const toast = (
    <Toast
      icon="alert-triangle"
      onClose={() => {
        setNoInternet(false);
      }}
      i18nKey="global.no_connection"
      defaultText="Aucune connexion internet !"
    />
  );

  return <View>{noInternet && toast}</View>;
};
