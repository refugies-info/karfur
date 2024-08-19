import { useContext } from "react";
import { ContentType, GetTraductionsForReview, Languages, TranslationContent } from "@refugies-info/api-types";
import PageContext from "utils/pageContext";
import { Progress } from "hooks/dispositif";
import CustomNavbarTranslate from "./CustomNavbarTranslate";
import CustomNavbarEdit from "./CustomNavbarEdit";

interface Props {
  typeContenu: ContentType;

  // for translation only
  defaultTranslation?: TranslationContent;
  locale?: Languages;
  progress?: Progress;
  translators?: GetTraductionsForReview["author"][];
}

/**
 * Navbar of edition or translate mode, which shows progress and validate buttons.
 * Responsible for autosave
 */
const CustomNavbar = ({ typeContenu, defaultTranslation, locale, progress, translators }: Props) => {
  const { mode } = useContext(PageContext);
  return mode === "translate" ? (
    <CustomNavbarTranslate
      typeContenu={typeContenu}
      defaultTranslation={defaultTranslation}
      locale={locale}
      progress={progress}
      translators={translators}
    />
  ) : (
    <CustomNavbarEdit typeContenu={typeContenu} />
  );
};

export default CustomNavbar;
