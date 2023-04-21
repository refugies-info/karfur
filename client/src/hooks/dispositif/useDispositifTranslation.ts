import { useUser } from "hooks";
import cloneDeep from "lodash/cloneDeep";
import set from "lodash/set";
import { useCallback, useEffect, useMemo, useState } from "react";
import API from "utils/API";
import { GetTraductionsForReview, GetTraductionsForReviewResponse, Languages } from "api-types";
import { useRouter } from "next/router";

/**
 * Get all suggestions except mine
 */
const getInitialTranslations = (userId: string, traductions: GetTraductionsForReviewResponse) => {
  return traductions.filter(t => t.author !== userId.toString())
}

/**
 * Get only my suggestion
 */
const getInitialMyTranslation = (userId: string, username: string, traductions: GetTraductionsForReviewResponse) => {
  return traductions.find(t => t.author === userId) // user already has a translation
    || {
    translated: {},
    toFinish: [],
    author: userId,
    username: username
  }; // else, create a new empty one
}

const useDispositifTranslation = (traductions: GetTraductionsForReviewResponse) => {
  const { user } = useUser();
  const router = useRouter();

  const [translations, _setTranslations] = useState<GetTraductionsForReview[]>(
    getInitialTranslations(user.userId.toString(), traductions)
  );
  const [myTranslation, setMyTranslation] = useState<GetTraductionsForReview>(
    getInitialMyTranslation(user.userId.toString(), user.user?.username || "", traductions)
  );
  const dispositifId = useMemo(() => router.query.id as string, [router.query]);
  const language = useMemo(() => router.query.language as Languages, [router.query]);

  const [startDate, setStartDate] = useState<Date>(new Date());
  useEffect(() => {
    setStartDate(new Date());
  }, []);

  /**
   * Valide la traduction de la section en cours pour la traduction de l'utilisateur courant
   */
  const validate = useCallback(
    async (value: string, section: string, unfinished: boolean) => {
      const translated = cloneDeep(myTranslation.translated);
      set(translated, section, value);

      const toFinish = unfinished
        ? [...myTranslation.toFinish, section]
        : [...myTranslation.toFinish].filter(t => t !== section)

      return API.saveTraduction({
        dispositifId: dispositifId || "",
        timeSpent: new Date().getTime() - startDate.getTime(),
        translated,
        toFinish,
        language: language || "",
      }).then(data => {
        setMyTranslation({ ...myTranslation, translated, toFinish })
        return data.data.data
      });
    },

    [myTranslation, dispositifId, language, startDate],
  );

  return {
    locale: language,
    translations,
    myTranslation,
    validate,
  };
};

export default useDispositifTranslation;
