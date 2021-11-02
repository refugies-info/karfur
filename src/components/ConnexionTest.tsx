import React from "react";
import NetInfo from "@react-native-community/netinfo";
import { View } from "react-native";
import { Toast } from "./Toast";

export const ConnexionTest = () => {
  const [noInternet, setNoInternet] = React.useState(false)
  React.useEffect(() => {
    return NetInfo.addEventListener(state => {
      if (!state.isConnected !== noInternet) {
        setNoInternet(!state.isConnected)
      }
    });
  }, []);

  const toast =
    <Toast
      icon="alert-triangle"
      onClose={() => { setNoInternet(false) }}
      i18nKey="Aucune connexion internet"
      defaultText="Aucune connexion internet !"
    />;

  return (
    <View>
      {noInternet && toast}
    </View>
  );
};
