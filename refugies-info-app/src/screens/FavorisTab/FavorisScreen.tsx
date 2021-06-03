import * as React from "react";
import { TextNormal } from "../../components/StyledText";
import { t } from "../../services/i18n";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";

export const FavorisScreen = () => {
  return (
    <WrapperWithHeaderAndLanguageModal>
      <TextNormal>Favoris screen</TextNormal>

      <TextNormal>{t("lists", "options")}</TextNormal>
      <TextNormal>{t("homepage.test", "options")}</TextNormal>
    </WrapperWithHeaderAndLanguageModal>
  );
};
