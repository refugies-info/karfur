import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { TouchableOpacity } from "react-native-gesture-handler";
import { logEvent } from "../../utils/logEvent";

export const SearchScreen = () => {
  return (
    <WrapperWithHeaderAndLanguageModal>
      <TextNormal>Search screen</TextNormal>
      <TouchableOpacity
        style={{
          backgroundColor: "red",
          borderRadius: 8,
          padding: 8,
          margin: 16,
        }}
        onPress={async () => {
          await logEvent("ButtonTaped", {
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
