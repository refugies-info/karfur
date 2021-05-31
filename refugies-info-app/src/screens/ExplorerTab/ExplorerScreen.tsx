import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { View } from "react-native";
import { t } from "../../services/i18n";
import { Header } from "../../components/Header";
import { useSelector } from "react-redux";
import {
  currentI18nCodeSelector,
  selectedI18nCodeSelector,
} from "../../services/redux/User/user.selectors";
import { LanguageChoiceModal } from "../Modals/LanguageChoiceModal";

export const ExplorerScreen = () => {
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);

  return (
    <View>
      <Header
        currentLanguageI18nCode={currentLanguageI18nCode}
        selectedLanguageI18nCode={selectedLanguageI18nCode}
        onLongPressSwitchLanguage={toggleLanguageModal}
      />
      <TextNormal>Explorer screen</TextNormal>

      <TextNormal>{t("lists", "options")}</TextNormal>
      <TextNormal>{t("homepage.test", "options")}</TextNormal>
      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
        selectedLanguageI18nCode={selectedLanguageI18nCode}
      />
    </View>
  );
};
