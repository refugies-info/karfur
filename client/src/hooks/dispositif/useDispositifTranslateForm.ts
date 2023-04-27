import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GetTraductionsForReviewResponse, Id, SaveTranslationRequest } from "api-types";
import { useLocale, useChangeLanguage, useUser } from "hooks";

export type TranslateForm = Pick<SaveTranslationRequest, "translated" | "toFinish" | "toReview">;
const getDefaultFormValues = (userId: Id | null, traductions: GetTraductionsForReviewResponse): TranslateForm => {
  const userTrads = userId ? traductions.find(t => t.author.id === userId.toString()) : null;
  return {
    translated: userTrads?.translated || {},
    toFinish: userTrads?.toFinish || [],
    toReview: userTrads?.toReview || [],
  };
}

/**
 * Initializes the dispositif forms, and return the form context methods
 */
const useDispositifTranslateForm = (traductions: GetTraductionsForReviewResponse) => {
  const { user } = useUser();
  const methods = useForm<TranslateForm>({ defaultValues: getDefaultFormValues(user?.userId, traductions) });
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
    dispositifFormContext: {
      mode: "translate" as "edit" | "view" | "translate",
      activeSection,
      setActiveSection,
      showMissingSteps,
      setShowMissingSteps,
    },
    methods
  };
}

export default useDispositifTranslateForm;
