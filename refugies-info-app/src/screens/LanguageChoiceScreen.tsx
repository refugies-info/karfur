import { View, Button } from "react-native";
import * as React from "react";
import { Text } from "../components/Themed";
import { useDispatch, useSelector } from "react-redux";
import { saveSelectedLanguageActionCreator } from "../services/redux/User/user.actions";
import i18n from "../services/i18n";
import { fetchLanguagesActionCreator } from "../services/redux/Languages/languages.actions";
import { selectedI18nCodeSelector } from "../services/redux/User/user.selectors";

export const LanguageChoiceScreen = () => {
  const dispatch = useDispatch();

  const langue = useSelector(selectedI18nCodeSelector);

  React.useEffect(() => {
    dispatch(fetchLanguagesActionCreator());
  }, [langue]);

  const changeLanguage = (ln: string) => {
    i18n.changeLanguage(ln);
    dispatch(saveSelectedLanguageActionCreator(ln));
  };
  return (
    <View>
      <Text>Text</Text>
      <Button onPress={() => changeLanguage("ar")} title="button ar" />
      <Button onPress={() => changeLanguage("en")} title="button en" />
      <Button onPress={() => changeLanguage("fr")} title="button fr" />
    </View>
  );
};
