import { ContentType, GetTraductionsForReview, Languages, TranslationContent } from "@refugies-info/api-types";
import { useContext } from "react";
import { Progress } from "~/hooks/dispositif";
import PageContext from "~/utils/pageContext";
import CustomNavbarEdit from "./CustomNavbarEdit";
import CustomNavbarTranslate from "./CustomNavbarTranslate";

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
