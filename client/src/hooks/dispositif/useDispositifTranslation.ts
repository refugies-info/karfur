import { useUser } from "hooks";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { useCallback, useMemo, useState } from "react";
import { useAsync } from "react-use";
import Swal from "sweetalert2";
import API from "utils/API";
import { GetTraductionsForReview, GetTraductionsForReviewResponse, TranslationContent } from "api-types";
import { useRouter } from "next/router";
import { logger } from "logger";

const useDispositifTranslation = () => {
  const { user } = useUser();
  const router = useRouter();

  const [myTranslation, setMyTranslation] = useState<GetTraductionsForReview & { avancement: number }>({
    translated: {},
    avancement: 0,
    author: "",
    username: ""
  });
  const dispositifId = useMemo(() => router.query.id as string, [router.query]);
  const language = useMemo(() => router.query.language as string, [router.query]);

  // const [startDate, setStartDate] = useState<Date>(new Date());
  // useEffect(() => {
  //   setStartDate(new Date());
  // }, [section]);

  /**
   * Valide la traduction de la section en cours pour la traduction de l'utilisateur courant
   */
  const validate = useCallback(
    async (value: string, section: string) => {
      const translated = cloneDeep(myTranslation.translated);
      set(translated, section, value);

      return API.saveTraduction({
        dispositifId: dispositifId || "",
        timeSpent: new Date().getTime() /* - startDate.getTime() */,
        translated,
        language: language || "",
      })
        .then(({ data }) => data.data.translation)
        .then((translation) => {
          if (translation.avancement >= 1) {
            Swal.fire({
              title: "Yay...",
              text: "La traduction a bien été enregistrée",
              icon: "success",
              timer: 1000,
            });
            router.push("/fr/backend/user-translation/" + language);
          }
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [myTranslation, dispositifId, language],
  );

  return {
    locale: language,
    myTranslation,
    validate,
  };
};

export default useDispositifTranslation;
