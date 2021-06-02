import React from "react";
import { LanguageChoiceModal } from "./Modals/LanguageChoiceModal";
import { Header } from "../components/Header";
import styled from "styled-components/native";

interface Props {
  currentLanguageI18nCode: string | null;
  selectedLanguageI18nCode: string | null;
  children: any;
}

const StyledView = styled.View`
  display: flex;
  flex: 1;
`;
export const WrapperWithHeaderAndLanguageModal = (props: Props) => {
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);

  return (
    <StyledView>
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
    </StyledView>
  );
};
