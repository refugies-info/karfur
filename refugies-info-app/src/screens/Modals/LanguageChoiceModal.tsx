import { StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import React from "react";
import styled from "styled-components/native";
import { useDispatch } from "react-redux";
import i18n, { t } from "../../services/i18n";
import { saveSelectedLanguageActionCreator } from "../../services/redux/User/user.actions";
import { theme } from "../../theme";
import {
  StyledTextNormal,
  StyledTextNormalBold,
} from "../../components/StyledText";
import { LanguageDetailsButton } from "../../components/Language/LanguageDetailsButton";
import { getSelectedLanguageFromI18nCode } from "../../libs/language";
import { activatedLanguages } from "../../data/languagesData";
import { RowContainer } from "../../components/BasicComponents";
import { Flag } from "../../components/Language/Flag";

interface Props {
  isModalVisible: boolean;
  toggleModal: () => void;
  selectedLanguageI18nCode: string | null;
}

const styles = StyleSheet.create({
  view: {
    justifyContent: "flex-end",
    margin: 0,
  },
});
const MainContainer = styled.TouchableOpacity`
  background: ${theme.colors.white};
  padding: ${theme.margin * 2}px;
  margin-vertical: ${theme.margin}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const StyledTextBold = styled(StyledTextNormalBold)`
  text-align: left;
  margin-left: ${theme.margin}px;
  color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.white : theme.colors.black};
`;

const StyledText = styled(StyledTextNormal)`
  text-align: left;
  color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.white : theme.colors.black};
`;

const ModalView = styled.View`
  background-color: ${theme.colors.lightGrey};
  display: flex;
  padding-top: ${theme.margin}px;
  padding-left: ${theme.margin * 3}px;
  padding-right: ${theme.margin * 3}px;
`;

const TitleContainer = styled(StyledTextNormal)`
  margin-bottom: ${theme.margin}px;
`;

const OtherLanguagesContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  margin-top: ${theme.margin * 3}px;
  margin-bottom: ${theme.margin * 3}px;
`;

const Separator = styled.View`
  height: 1px;
  background-color: ${theme.colors.grey};
  margin-left: ${theme.margin * 2}px;
  margin-right: ${theme.margin * 2}px;
`;
export const LanguageChoiceModal = (props: Props) => {
  const dispatch = useDispatch();

  const selectedLanguage = getSelectedLanguageFromI18nCode(
    props.selectedLanguageI18nCode
  );

  const otherLanguages = activatedLanguages.filter(
    (langue) => langue.i18nCode !== props.selectedLanguageI18nCode
  );

  const changeLanguage = (ln: string) => {
    i18n.changeLanguage(ln);
    dispatch(saveSelectedLanguageActionCreator(ln));
    props.toggleModal();
  };
  return (
    <Modal
      isVisible={props.isModalVisible}
      style={styles.view}
      onBackdropPress={props.toggleModal}
    >
      <ModalView>
        <TitleContainer>
          {t("Langue app", "Langue de l'application")}
        </TitleContainer>
        <LanguageDetailsButton
          langueFr={selectedLanguage.langueFr}
          langueLoc={selectedLanguage.langueLoc}
          onPress={() => {}}
          isSelected={true}
        />
        <OtherLanguagesContainer>
          {otherLanguages.map((language, index) => {
            return (
              <View key={index}>
                <MainContainer
                  onPress={() => changeLanguage(language.i18nCode)}
                  testID={"test-language-button-" + language.langueFr}
                  key={index}
                >
                  <RowContainer>
                    <Flag langueFr={language.langueFr} />
                    <StyledTextBold>{language.langueFr + " - "}</StyledTextBold>
                    <StyledText>{language.langueLoc}</StyledText>
                  </RowContainer>
                </MainContainer>
                {index !== otherLanguages.length - 1 && <Separator />}
              </View>
            );
          })}
        </OtherLanguagesContainer>
      </ModalView>
    </Modal>
  );
};
