import { useContext } from "react";
import { ContentType, Languages, TranslationContent } from "api-types";
import PageContext from "utils/pageContext";
import CustomNavbarTranslate from "./CustomNavbarTranslate";
import CustomNavbarEdit from "./CustomNavbarEdit";

interface Props {
  typeContenu: ContentType;

  // for translation only
  defaultTranslation?: TranslationContent;
  locale?: Languages;
}

/**
 * Navbar of edition or translate mode, which shows progress and validate buttons.
 * Responsible for autosave
 */
const CustomNavbar = ({ typeContenu, defaultTranslation, locale }: Props) => {
  const { mode } = useContext(PageContext);
  return mode === "translate" ? (
    <CustomNavbarTranslate typeContenu={typeContenu} defaultTranslation={defaultTranslation} locale={locale} />
  ) : (
    <CustomNavbarEdit typeContenu={typeContenu} />
  );
};

export default CustomNavbar;
