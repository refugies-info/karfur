import React from "react";
import { LanguageChoiceModal } from "./Modals/LanguageChoiceModal";
import { HeaderWithLogo } from "../components/HeaderWithLogo";
import styled from "styled-components/native";

interface Props {
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
      <HeaderWithLogo onLongPressSwitchLanguage={toggleLanguageModal} />
      {props.children}

      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </StyledView>
  );
};
