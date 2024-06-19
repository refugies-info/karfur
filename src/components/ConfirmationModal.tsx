import React from "react";
import { Image, ScrollView, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import styled, { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { TextDSFR_L } from "./StyledText";
import { Rows, Spacer } from "./layout";
import { ButtonDSFR } from "./buttons";
import IlluMascotte from "../theme/images/profile/illu-mascotte.png";

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
  background-color: ${({ theme }) => theme.colors.lightGrey};
  padding-top: ${({ theme }) => theme.margin * 3}px;
`;

const TitleText = styled(TextDSFR_L)`
  margin-top: ${({ theme }) => theme.margin * 3}px;
  margin-bottom: ${({ theme }) => theme.margin * 5}px;
  align-self: center;
  text-align: center;
`;

const Backdrop = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.black};
`;

export const ConfirmationModal = (props: Props) => {
  const { t } = useTranslationWithRTL();
  const theme = useTheme();

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
            paddingBottom: theme.margin * 3,
            paddingHorizontal: theme.margin * 3,
          }}
        >
          <Rows horizontalAlign="center">
            <Image style={{ height: 96, width: 77 }} source={IlluMascotte} />
          </Rows>
          <TitleText>{props.text}</TitleText>
          <ButtonDSFR
            accessibilityLabel={t(
              props.i18nKeyValidateButton || "global.validate"
            )}
            title={t(props.i18nKeyValidateButton || "global.validate")}
            onPress={onValidate}
            iconName={props.iconValidateButton || "arrow-forward-outline"}
            iconAfter
            priority="primary"
          />
          <Spacer height={theme.margin * 2} />

          <ButtonDSFR
            accessibilityLabel={t("global.cancel")}
            title={t("global.cancel")}
            onPress={props.toggleModal}
            priority="tertiary no outline"
          />
        </ScrollView>
      </ModalView>
    </Modal>
  );
};
