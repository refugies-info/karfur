import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { saveSelectedLanguageActionCreator } from "../../services/redux/User/user.actions";
import { styles } from "../../theme";
import {
  StyledTextNormalBold,
  StyledTextSmallBold,
  StyledTextSmall,
} from "../../components/StyledText";
import { activatedLanguages } from "../../data/languagesData";
import { RowContainer, RTLView } from "../../components/BasicComponents";
import { Flag } from "../../components/Language/Flag";
import { selectedI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { CustomButton } from "../../components/CustomButton";
import { AvailableLanguageI18nCode } from "../../types/interface";
import { ChoiceButton } from "../../components/UI/ChoiceButton";
import { Icon } from "react-native-eva-icons";
import { useStopVoiceover } from "../../hooks/useStopVoiceover";

interface Props {
  isModalVisible: boolean;
  toggleModal: () => void;
  hideRadio?: boolean;
}

const StyledTextBold = styled(StyledTextSmallBold)`
  margin-left: ${(props: { isRTL: boolean }) =>
    !props.isRTL ? styles.margin * 2 : 0}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin * 2 : 0}px;
  color: ${styles.colors.black};
`;

const StyledText = styled(StyledTextSmall)`
  text-align: left;
  color: ${styles.colors.darkGrey};
`;

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

const FlagBackground = styled.View`
  margin: 4px;
  background-color: ${styles.colors.white};
  width: 22px;
  height: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  ${styles.shadows.sm}
`;
const Backdrop = styled.View`
  flex: 1;
  background-color: ${styles.colors.black};
`;

export const LanguageChoiceModal = (props: Props) => {
  const { t, i18n, isRTL } = useTranslationWithRTL();
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const changeLanguage = (ln: AvailableLanguageI18nCode) => {
    i18n.changeLanguage(ln);
    dispatch(
      saveSelectedLanguageActionCreator({
        langue: ln,
        shouldFetchContents: true,
      })
    );
    props.toggleModal();
  };

  const stopVoiceOver = useStopVoiceover();
  useEffect(() => {
    if (props.isModalVisible) {
      stopVoiceOver();
    }
  }, [props.isModalVisible]);

  return (
    <Modal
      isVisible={props.isModalVisible}
      style={{justifyContent: "flex-end", margin: 0}}
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
          <Icon
            name="globe-2-outline"
            width={24}
            height={24}
            fill={styles.colors.black}
            style={{
              marginLeft: isRTL ? styles.margin : 0,
              marginRight: !isRTL ? styles.margin : 0
            }}
          />
          <StyledTextNormalBold>{t("global.language", "Langue de l'application")}</StyledTextNormalBold>
        </TitleContainer>

        <LanguagesContainer>
          {activatedLanguages.map((language, index) => {
            const isSelected = selectedLanguageI18nCode === language.i18nCode;
            return (
              <View key={language.langueFr}>
                <ChoiceButton
                  onPress={() => changeLanguage(language.i18nCode)}
                  testID={"test-language-button-" + language.langueFr}
                  isSelected={isSelected}
                  accessibilityRole="button"
                  flatStyle={true}
                >
                  <RTLView>
                    <FlagBackground>
                      <Flag langueFr={language.langueFr} />
                    </FlagBackground>
                    <StyledTextBold isRTL={isRTL}>
                      {language.langueLoc}
                    </StyledTextBold>
                    {language.langueFr !== "Français" && (
                      <RowContainer>
                        <StyledText>
                          {!isRTL ? " - " + language.langueFr : language.langueFr + " - "}
                        </StyledText>
                      </RowContainer>
                    )}
                  </RTLView>
                </ChoiceButton>
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
