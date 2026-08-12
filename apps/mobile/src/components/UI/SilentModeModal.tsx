import { Image, Modal, ScrollView, TouchableWithoutFeedback } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import IlluMascotte from "~/theme/images/profile/illu-mascotte.png";
import { ButtonDSFR } from "../buttons";
import { Rows, Spacer } from "../layout";
import { TextDSFR_L, TextDSFR_XS } from "../StyledText";

interface Props {
  isModalVisible: boolean;
  onClose: () => void;
  onContinue: () => void;
  onNeverShowAgain: () => void;
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
  align-self: center;
  text-align: center;
`;

const DescriptionText = styled(TextDSFR_XS)`
  margin-top: ${({ theme }) => theme.margin}px;
  margin-bottom: ${({ theme }) => theme.margin * 4}px;
  align-self: center;
  text-align: center;
`;

export const SilentModeModal = (props: Props) => {
  const { t } = useTranslationWithRTL();
  const theme = useTheme();

  return (
    <Modal
      visible={props.isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={props.onClose}
    >
      <ModalContainer>
        <TouchableWithoutFeedback
          onPress={props.onClose}
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
              <Image style={{ height: 96, width: 77 }} source={IlluMascotte} accessible={false} />
            </Rows>
            <TitleText>{t("silent_mode.title", "Le son de ton téléphone est coupé")}</TitleText>
            <DescriptionText>
              {t(
                "silent_mode.text",
                "Tu ne vas rien entendre. Désactive le mode silencieux ou monte le volume, puis relance la lecture.",
              )}
            </DescriptionText>
            <ButtonDSFR
              accessibilityLabel={t("silent_mode.continue", "Lire quand même")}
              title={t("silent_mode.continue", "Lire quand même")}
              onPress={props.onContinue}
              iconName="volume-up-outline"
              iconAfter
              priority="primary"
            />
            <Spacer height={theme.margin * 2} />
            <ButtonDSFR
              accessibilityLabel={t("silent_mode.never_show", "Ne plus afficher ce message")}
              title={t("silent_mode.never_show", "Ne plus afficher ce message")}
              onPress={props.onNeverShowAgain}
              priority="tertiary no outline"
            />
          </ScrollView>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};
