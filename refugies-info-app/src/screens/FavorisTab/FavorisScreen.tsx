import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { t } from "../../services/i18n";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { useSelector } from "react-redux";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { contentsSelector } from "../../services/redux/Contents/contents.selectors";
import { ScrollView } from "react-native";

export const FavorisScreen = () => {
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);
  const contents = currentLanguageI18nCode
    ? useSelector(contentsSelector(currentLanguageI18nCode))
    : [];
  return (
    <WrapperWithHeaderAndLanguageModal>
      <TextNormal>Favoris screen</TextNormal>

      <ScrollView>
        {contents.map((content, index) => (
          <TextNormal key={index}>{content.titreInformatif}</TextNormal>
        ))}
      </ScrollView>
    </WrapperWithHeaderAndLanguageModal>
  );
};
