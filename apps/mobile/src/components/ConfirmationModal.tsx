import { Image, Modal, ScrollView, TouchableWithoutFeedback } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import IlluMascotte from "~/theme/images/profile/illu-mascotte.png";
import { ButtonDSFR } from "./buttons";
import { Rows, Spacer } from "./layout";
import { TextDSFR_L } from "./StyledText";

interface Props {
  isModalVisible: boolean;
  toggleModal: () => void;
  text: string;
  onValidate: () => void;
  iconValidateButton?: string;
  i18nKeyValidateButton?: string;
  defaultTextValidateButton?: string;
}

const ModalContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const Backdrop = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.black};
  opacity: 0.5;
`;

const ModalView = styled.View`
  background-color: ${({ theme }) => theme.colors.lightGrey};
  padding-top: ${({ theme }) => theme.margin * 3}px;
  z-index: 1;
`;

const TitleText = styled(TextDSFR_L)`
  margin-top: ${({ theme }) => theme.margin * 3}px;
  margin-bottom: ${({ theme }) => theme.margin * 5}px;
  align-self: center;
  text-align: center;
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
      visible={props.isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={props.toggleModal}
    >
      <ModalContainer>
        <TouchableWithoutFeedback
          onPress={props.toggleModal}
          accessibilityRole="button"
          accessibilityLabel={t("global.close_window_accessibility")}
        >
          <Backdrop />
        </TouchableWithoutFeedback>
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
              accessibilityLabel={t(props.i18nKeyValidateButton || "global.validate")}
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
      </ModalContainer>
    </Modal>
  );
};
