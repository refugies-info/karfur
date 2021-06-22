import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";

import { useTranslation } from "react-i18next";
import { Button } from "react-native";
import { useDispatch } from "react-redux";
import { fetchContentsActionCreator } from "../../services/redux/Contents/contents.actions";

export const SearchScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <WrapperWithHeaderAndLanguageModal>
      <TextNormal>Search screen</TextNormal>

      <TextNormal>{t("lists", "options")}</TextNormal>
      <TextNormal>{t("homepage.test", "options")}</TextNormal>
      <Button
        title="fetch contents"
        onPress={() => {
          dispatch(fetchContentsActionCreator("fr"));
        }}
      />
    </WrapperWithHeaderAndLanguageModal>
  );
};
