import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { TouchableOpacity } from "react-native-gesture-handler";
import { logEventInFirebase } from "../../utils/logEvent";
import { getEnvironment } from "../../libs/getEnvironment";
// import * as Clipboard from "expo-clipboard";
import { Clipboard } from "react-native";

export const SearchScreen = () => {
  const { envName, debugModeFirebase } = getEnvironment();
  return (
    <WrapperWithHeaderAndLanguageModal>
      <TextNormal>Search screen</TextNormal>
      <TextNormal>{"env name : " + envName}</TextNormal>
      <TextNormal>{"debug mode : " + debugModeFirebase}</TextNormal>

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

      <TouchableOpacity
        style={{
          backgroundColor: "red",
          borderRadius: 8,
          padding: 8,
          margin: 16,
        }}
        onPress={async () => {
          await logEventInFirebase("ChooseLanguage", {
            langue: "fr",
          });
        }}
      >
        <TextNormal>Langue fr</TextNormal>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "red",
          borderRadius: 8,
          padding: 8,
          margin: 16,
        }}
        onPress={async () => {
          await logEventInFirebase("ChooseLanguage", {
            langue: "en",
          });
        }}
      >
        <TextNormal>Langue en</TextNormal>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "red",
          borderRadius: 8,
          padding: 8,
          margin: 16,
        }}
        onPress={() => {
          // @ts-ignore
          Clipboard.setString("hello");
        }}
      >
        <TextNormal>Test copy</TextNormal>
      </TouchableOpacity>

      <TextNormal>Test copy 2</TextNormal>
    </WrapperWithHeaderAndLanguageModal>
  );
};
