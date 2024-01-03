import { ScrollView, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import React from "react";
import styled from "styled-components/native";
import { styles } from "../theme";
import { StyledTextNormal } from "./StyledText";
import { CustomButton } from "./CustomButton";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";

interface Props {
  isModalVisible: boolean;
  toggleModal: () => void;
  text: string;
  onValidate: () => void;
  iconValidateButton?: string;
  i18nKeyValidateButton?: string;
  defaultTextValidateButton?: string;
}

const ModalView = styled.View`
  background-color: ${styles.colors.lightGrey};
  padding-top: ${styles.margin}px;

  border-top-right-radius: ${styles.radius * 2}px;
  border-top-left-radius: ${styles.radius * 2}px;
`;

const TitleText = styled(StyledTextNormal)`
  margin-top: ${styles.margin * 4}px;
  margin-bottom: ${styles.margin * 3}px;
  align-self: center;
  text-align: center;
`;

const TopButtonContainer = styled.View`
  margin-bottom: ${styles.margin * 2}px;
`;
const Backdrop = styled.View`
  flex: 1;
  background-color: ${styles.colors.black};
`;

export const ConfirmationModal = (props: Props) => {
  const { t } = useTranslationWithRTL();

  const onValidate = () => {
    props.onValidate();
    props.toggleModal();
  };
  return (
    <Modal
      isVisible={props.isModalVisible}
      style={{ justifyContent: "flex-end", margin: 0 }}
      customBackdrop={
        <TouchableWithoutFeedback
          onPress={props.toggleModal}
          accessibilityRole="button"
          accessibilityLabel={t("global.close_window_accessibility")}
        >
          <Backdrop />
        </TouchableWithoutFeedback>
      }
    >
      <ModalView>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: styles.margin * 5,
            paddingHorizontal: styles.margin * 3,
          }}
        >
          <TitleText>{props.text}</TitleText>
          <TopButtonContainer>
            <CustomButton
              i18nKey={props.i18nKeyValidateButton || "global.validate"}
              defaultText={props.defaultTextValidateButton || "Valider"}
              textColor={styles.colors.white}
              onPress={onValidate}
              backgroundColor={styles.colors.darkBlue}
              iconName={props.iconValidateButton || "arrow-forward-outline"}
            />
          </TopButtonContainer>

          <CustomButton
            i18nKey="global.cancel"
            defaultText="Annuler"
            textColor={styles.colors.black}
            onPress={props.toggleModal}
            isTextNotBold={true}
          />
        </ScrollView>
      </ModalView>
    </Modal>
  );
};
