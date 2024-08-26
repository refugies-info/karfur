import { useLanguages } from "@/hooks";
import { toggleLangueModalActionCreator } from "@/services/Langue/langue.actions";
import { HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { useDispatch } from "react-redux";

const useLanguageItem = (): HeaderProps.QuickAccessItem => {
  const dispatch = useDispatch();
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
