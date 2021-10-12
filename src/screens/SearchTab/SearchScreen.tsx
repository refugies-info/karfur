import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { TouchableOpacity } from "react-native-gesture-handler";
import { logEventInFirebase } from "../../utils/logEvent";

export const SearchScreen = () => {
  return (
    <WrapperWithHeaderAndLanguageModal>
      <TextNormal>Search screen</TextNormal>
      <TextNormal>{"env name : " + process.env.ENV_NAME}</TextNormal>
      <TextNormal>
        {"debug mode : " + process.env.DEBUG_MODE_FIREBASE}
      </TextNormal>

      <TouchableOpacity
        style={{
          backgroundColor: "red",
          borderRadius: 8,
          padding: 8,
          margin: 16,
        }}
        onPress={async () => {
          await logEventInFirebase("ButtonTaped", {
            name: "test",
            screen: "search",
          });
        }}
      >
        <TextNormal>Test</TextNormal>
      </TouchableOpacity>
    </WrapperWithHeaderAndLanguageModal>
  );
};
