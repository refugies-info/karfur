import { Languages } from "@refugies-info/api-types";
import { useEffect, useMemo } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { RTLView } from "~/components/BasicComponents";
import { CustomButton } from "~/components/CustomButton";
import LanguageDetailsButton from "~/components/Language/LanguageDetailsButton";
import { TextDSFR_L_Bold } from "~/components/StyledText";
import { activatedLanguages } from "~/data/languagesData";
import { useStopVoiceover } from "~/hooks/useStopVoiceover";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { saveSelectedLanguageActionCreator } from "~/services/redux/User/user.actions";
import { selectedI18nCodeSelector } from "~/services/redux/User/user.selectors";
import { styles } from "~/theme";

interface Props {
  isModalVisible: boolean;
  toggleModal: () => void;
  hideRadio?: boolean;
  changeLanguageCallback?: () => void;
}

const ModalView = styled.View`
  background-color: ${styles.colors.lightGrey};
  display: flex;
  padding-vertical: ${styles.margin}px;
  padding-horizontal: ${styles.margin * 3}px;
  border-top-right-radius: ${styles.radius * 2}px;
  border-top-left-radius: ${styles.radius * 2}px;
`;

const TitleContainer = styled(RTLView)`
  justify-content: center;
  margin-top: ${styles.margin * 3}px;
`;

const LanguagesContainer = styled.ScrollView`
  margin-top: ${styles.margin * 2}px;
  margin-bottom: ${styles.margin}px;
`;

const Separator = styled.View`
  height: 1px;
  background-color: ${styles.colors.grey};
  margin-left: ${styles.margin * 2}px;
  margin-right: ${styles.margin * 2}px;
`;

const Backdrop = styled.View`
  flex: 1;
  background-color: ${styles.colors.black};
`;

const stylesheet = StyleSheet.create({
  modal: { justifyContent: "flex-end", margin: 0 },
});

export const LanguageChoiceModal = (props: Props) => {
  const { t, i18n, isRTL } = useTranslationWithRTL();
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const changeLanguage = (ln: Languages) => {
    props.changeLanguageCallback?.();
    i18n.changeLanguage(ln);
    dispatch(
      saveSelectedLanguageActionCreator({
        langue: ln,
        shouldFetchContents: true,
      }),
    );
    props.toggleModal();
  };

  const stopVoiceOver = useStopVoiceover();
  useEffect(() => {
    if (props.isModalVisible) {
      stopVoiceOver();
    }
  }, [props.isModalVisible]);

  const iconStyle = useMemo(
    () => ({
      marginLeft: isRTL ? styles.margin : 0,
      marginRight: !isRTL ? styles.margin : 0,
    }),
    [isRTL],
  );

  return (
    <Modal
      isVisible={props.isModalVisible}
      style={stylesheet.modal}
      onBackdropPress={props.toggleModal}
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
      <ModalView style={{ paddingBottom: insets.bottom }}>
        <TitleContainer>
          <Icon name="globe-2-outline" width={24} height={24} fill={styles.colors.black} style={iconStyle} />
          <TextDSFR_L_Bold>{t("global.language", "Langue de l'application")}</TextDSFR_L_Bold>
        </TitleContainer>

        <LanguagesContainer>
          {activatedLanguages.map((language, index) => {
            const isSelected = selectedLanguageI18nCode === language.i18nCode;
            return (
              <View key={language.langueFr}>
                <LanguageDetailsButton
                  flatStyle
                  isSelected={isSelected}
                  langueFr={language.langueFr}
                  langueLoc={language.langueLoc}
                  langueCode={language.i18nCode}
                  onPress={() => changeLanguage(language.i18nCode)}
                />
                {index !== activatedLanguages.length - 1 && <Separator />}
              </View>
            );
          })}
        </LanguagesContainer>
        <CustomButton
          i18nKey="global.close"
          defaultText="Fermer"
          iconName="close-outline"
          iconFirst={true}
          textColor={styles.colors.black}
          onPress={props.toggleModal}
          isTextNotBold={true}
        />
      </ModalView>
    </Modal>
  );
};
