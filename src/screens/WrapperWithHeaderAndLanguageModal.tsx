import React from "react";
import { LanguageChoiceModal } from "./Modals/LanguageChoiceModal";
import {
  HeaderWithLogo,
  HeaderWithBackForWrapper,
} from "../components/HeaderWithLogo";
import styled from "styled-components/native";

interface Props {
  children: any;
  navigation?: any;
  showSwitch?: boolean;
  backScreen?: string;
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
      {props.showSwitch && props.navigation ? (
        <HeaderWithBackForWrapper
          onLongPressSwitchLanguage={toggleLanguageModal}
          navigation={props.navigation}
          backScreen={props.backScreen}
        />
      ) : (
        <HeaderWithLogo onLongPressSwitchLanguage={toggleLanguageModal} />
      )}
      {props.children}

      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </StyledView>
  );
};
