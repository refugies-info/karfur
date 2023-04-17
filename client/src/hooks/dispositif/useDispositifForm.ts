import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modals } from "utils/pageContext";
import { fetchAllStructuresActionsCreator } from "services/AllStructures/allStructures.actions";
import useLocale from "hooks/useLocale";
import useChangeLanguage from "hooks/useChangeLanguage";

/**
 * Initializes the dispositif forms, and return the form context methods
 */
const useDispositifForm = () => {
  const [activeSection, setActiveSection] = useState("");
  const [showMissingSteps, setShowMissingSteps] = useState(false);
  const [activeModal, setActiveModal] = useState<Modals | null>(null);

  // force french language for edition
  const locale = useLocale();
  const { changeLanguage } = useChangeLanguage();
  useEffect(() => {
    if (locale !== "fr") {
      changeLanguage("fr");
    }
  }, [locale, changeLanguage]);

  // load all structures
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllStructuresActionsCreator());
  }, [dispatch]);

  return {
    mode: "edit" as "edit" | "view" | "translate",
    activeSection,
    setActiveSection,
    showMissingSteps,
    setShowMissingSteps,
    activeModal,
    setActiveModal,
  };
}

export default useDispositifForm;
