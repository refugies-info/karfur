import { HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { useLanguages } from "hooks";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { toggleLangueModalActionCreator } from "services/Langue/langue.actions";

const useLanguageItem = (): HeaderProps.QuickAccessItem => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentLocale } = useLanguages();
  const openLanguageModal = () => {
    dispatch(toggleLangueModalActionCreator());
  };

  return {
    iconId: "ri-translate",
    buttonProps: {
      onClick: openLanguageModal,
    },
    text: currentLocale?.langueLoc || currentLocale?.langueFr,
  };
};

export default useLanguageItem;
