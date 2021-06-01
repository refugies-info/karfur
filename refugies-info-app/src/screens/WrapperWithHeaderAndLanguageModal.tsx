import React from "react";
import { View } from "react-native";
import { LanguageChoiceModal } from "./Modals/LanguageChoiceModal";
import { Header } from "../components/Header";

interface Props {
  currentLanguageI18nCode: string | null;
  selectedLanguageI18nCode: string | null;
  children: any;
}
export const WrapperWithHeaderAndLanguageModal = (props: Props) => {
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);

  return (
    <View>
      <Header
        currentLanguageI18nCode={props.currentLanguageI18nCode}
        selectedLanguageI18nCode={props.selectedLanguageI18nCode}
        onLongPressSwitchLanguage={toggleLanguageModal}
      />
      {props.children}

      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
        selectedLanguageI18nCode={props.selectedLanguageI18nCode}
      />
    </View>
  );
};
