import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";

import { useTranslation } from "react-i18next";

export const SearchScreen = () => {
  const { t } = useTranslation();

  return (
    <WrapperWithHeaderAndLanguageModal>
      <TextNormal>Search screen</TextNormal>

      <TextNormal>{t("lists", "options")}</TextNormal>
      <TextNormal>{t("homepage.test", "options")}</TextNormal>
    </WrapperWithHeaderAndLanguageModal>
  );
};
