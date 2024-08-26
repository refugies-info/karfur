import useChangeLanguage from "@/hooks/useChangeLanguage";
import useLocale from "@/hooks/useLocale";
import useUser from "@/hooks/useUser";
import { fetchAllStructuresActionsCreator } from "@/services/AllStructures/allStructures.actions";
import { fetchUserStructureActionCreator } from "@/services/UserStructure/userStructure.actions";
import { userStructureSelector } from "@/services/UserStructure/userStructure.selectors";
import { Modals } from "@/utils/pageContext";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

  // load user structure
  const { user } = useUser();
  const userStructure = useSelector(userStructureSelector);
  useEffect(() => {
    if (user.user?.structures && user.user.structures.length > 0 && !userStructure) {
      dispatch(
        fetchUserStructureActionCreator({
          structureId: user.user.structures[0],
          shouldRedirect: false,
        }),
      );
    }
  }, [dispatch, user, userStructure]);

  const preventSubmissionOnEnter = useCallback((e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }, []);

  return {
    mode: "edit" as "edit" | "view" | "translate",
    activeSection,
    setActiveSection,
    showMissingSteps,
    setShowMissingSteps,
    activeModal,
    setActiveModal,
    preventSubmissionOnEnter,
  };
};

export default useDispositifForm;
