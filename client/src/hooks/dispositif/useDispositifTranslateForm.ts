import { useEffect, useState } from "react";
import useLocale from "hooks/useLocale";
import useChangeLanguage from "hooks/useChangeLanguage";

/**
 * Initializes the dispositif forms, and return the form context methods
 */
const useDispositifTranslateForm = () => {
  const [activeSection, setActiveSection] = useState("");
  const [showMissingSteps, setShowMissingSteps] = useState(false);

  // force french language for edition
  const locale = useLocale();
  const { changeLanguage } = useChangeLanguage();
  useEffect(() => {
    if (locale !== "fr") {
      changeLanguage("fr");
    }
  }, [locale, changeLanguage]);

  return {
    mode: "translate" as "edit" | "view" | "translate",
    activeSection,
    setActiveSection,
    showMissingSteps,
    setShowMissingSteps,
  };
}

export default useDispositifTranslateForm;
