import { useUser } from "hooks";
import cloneDeep from "lodash/cloneDeep";
import set from "lodash/set";
import { useCallback, useEffect, useMemo, useState } from "react";
import API from "utils/API";
import { GetTraductionsForReview, GetTraductionsForReviewResponse, Languages, TranslationContent } from "api-types";
import { useRouter } from "next/router";
import { useFormContext, useWatch } from "react-hook-form";
import { TranslateForm } from "./useDispositifTranslateForm";

/**
 * Get all suggestions except mine
 */
const getInitialTranslations = (userId: string, traductions: GetTraductionsForReviewResponse) => {
  return traductions.filter(t => t.author.id !== userId.toString())
}

const useDispositifTranslation = (traductions: GetTraductionsForReviewResponse) => {
  const { user } = useUser();
  const router = useRouter();
  const { setValue } = useFormContext<TranslateForm>();
  const data = useWatch<TranslateForm>();

  const [translations, _setTranslations] = useState<GetTraductionsForReview[]>(
    getInitialTranslations(user.userId.toString(), traductions)
  );
  const language = useMemo(() => router.query.language as Languages, [router.query]);

  /**
   * Valide la traduction de la section en cours pour la traduction de l'utilisateur courant
   */
  const validate = useCallback(
    async (section: string, value: { text?: string, unfinished?: boolean }) => {
      // if section changed, remove from toReview
      if (data.toReview && data.toReview.includes(section)) {
        const toReview = [...data.toReview].filter(t => t !== section)
        setValue("toReview", toReview);
      }

      if (value.unfinished !== undefined) {
        const toFinish = value.unfinished
          ? [...(data.toFinish || []), section]
          : [...(data.toFinish || [])].filter(t => t !== section)
        setValue("toFinish", toFinish);
      }
      if (value.text !== undefined) {
        //@ts-ignore
        setValue(`translated.${section}`, value.text) // TODO: type section?
      }
    },
    [data, setValue],
  );

  const deleteTrad = useCallback(
    async (section: string) => {
      const toFinish = [...(data.toFinish || [])].filter(t => t !== section)
      setValue("toFinish", toFinish);
      //@ts-ignore
      setValue(`translated.${section}`, undefined) // TODO: type section?
    },
    [data, setValue],
  );

  return {
    locale: language,
    translations,
    validate,
    deleteTrad
  };
};

export default useDispositifTranslation;
