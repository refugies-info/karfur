import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import React from "react";
import styled from "styled-components/native";
import { theme } from "../theme";
import { StyledTextNormal } from "./StyledText";
import { CustomButton } from "./CustomButton";

interface Props {
  isModalVisible: boolean;
  toggleModal: () => void;
  text: string;
  onValidate: () => void;
}

const styles = StyleSheet.create({
  view: {
    justifyContent: "flex-end",
    margin: 0,
  },
});

const ModalView = styled.View`
  background-color: ${theme.colors.lightGrey};
  display: flex;
  padding-top: ${theme.margin}px;
  padding-bottom: ${theme.margin * 5}px;

  padding-horizontal: ${theme.margin * 3}px;
  border-top-right-radius: ${theme.radius * 2}px;
  border-top-left-radius: ${theme.radius * 2}px;
`;

const TitleText = styled(StyledTextNormal)`
  margin-top: ${theme.margin * 4}px;
  margin-bottom: ${theme.margin * 3}px;
  align-self: center;
  text-align: center;
`;

const TopButtonContainer = styled.View`
  margin-bottom: ${theme.margin * 2}px;
`;

export const ConfirmationModal = (props: Props) => {
  const onValidate = () => {
    props.onValidate();
    props.toggleModal();
  };
  return (
    <Modal
      isVisible={props.isModalVisible}
      style={styles.view}
      onBackdropPress={props.toggleModal}
    >
      <ModalView>
        <TitleText>{props.text}</TitleText>
        <TopButtonContainer>
          <CustomButton
            i18nKey={"Valider"}
            defaultText="Valider"
            textColor={theme.colors.white}
            onPress={onValidate}
            backgroundColor={theme.colors.darkBlue}
            iconName="arrow-forward-outline"
          />
        </TopButtonContainer>

        <CustomButton
          i18nKey={"Annuler"}
          defaultText="Annuler"
          textColor={theme.colors.black}
          onPress={props.toggleModal}
          isTextNotBold={true}
        />
      </ModalView>
    </Modal>
  );
};
