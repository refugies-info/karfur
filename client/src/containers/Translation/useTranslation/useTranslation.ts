import { useParamsFromHistory, useUser } from "hooks";
import cloneDeep from "lodash/cloneDeep";
import flattenDeep from "lodash/flattenDeep";
import get from "lodash/get";
import indexOf from "lodash/indexOf";
import isFunction from "lodash/isFunction";
import set from "lodash/set";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useAsync } from "react-use";
import { setSelectedDispositifActionCreator } from "services/SelectedDispositif/selectedDispositif.actions";
import Swal from "sweetalert2";
import API from "utils/API";
import { GetDispositifResponse } from "api-types";

const keysForSubSection = (prefix: string, translated: any) =>
  flattenDeep(
    Object.keys(get(translated, prefix, {})).map((key) => [`${prefix}.${key}.title`, `${prefix}.${key}.text`]),
  );

const keys = (translated: any) => {
  return [
    ...Object.keys(translated.content)
      .filter((key) => !["how", "why", "next"].includes(key))
      .map((key) => `content.${key}`),
    ...keysForSubSection("content.why", translated),
    ...keysForSubSection("content.how", translated),
    ...keysForSubSection("content.next", translated),
    ...Object.keys(translated.metadatas).map((key) => `metadatas.${key}`),
  ];
};

const useTranslation = () => {
  const { user } = useUser();
  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParamsFromHistory();
  const [section, _setSection] = useState<string>("content.titreInformatif");
  const setSection = useCallback(
    (_section: string) => {
      // Goto section scroll
      _setSection(_section);
    },
    [_setSection],
  );
  const [myTranslation, setMyTranslation] = useState({
    translated: {},
    avancement: 0,
  });

  const { loading, value, error } = useAsync(() =>
    Promise.all([
      API.getDispositif(params.get("dispositif") || "", "fr")
        .then(({ data }): GetDispositifResponse => data.data)
        .then((dispositif) => {
          dispatch(setSelectedDispositifActionCreator(dispositif));
          return dispositif;
        }),
      /**
       * Récupération des traductions existantes
       * - toutes si trad expert
       * - la mienne si trad
       */
      API.getTraductionsForReview({
        dispositif: params.get("dispositif") || "",
        language: params.get("language") || "",
      })
        .then(({ data }) => data.data)
        .then((translations) => {
          const my = translations.find((translation: any /*FIXME*/) => translation.author === user.userId);
          if (my) {
            setMyTranslation(my);
          }
          return translations;
        }),
      API.getDefaultTraductionForDispositif({ dispositif: params.get("dispositif") || "" }).then(
        ({ data }) => data.data.translation,
      ),
    ]).then(([dispositif, traductions, defaultTraduction]) => {
      const dispositifSections = keys(defaultTraduction);
      setSection(dispositifSections[0] || "");
      return { dispositif, dispositifSections, traductions, defaultTraduction };
    }),
  );

  const {
    defaultTraduction = {},
    dispositif = null,
    dispositifSections = [],
    traductions = [],
  } = value || { defaultTraduction: {}, dispositif: null, dispositifSections: [], traductions: [] };

  const index = indexOf(dispositifSections, section);
  const prevSection = index === 0 ? undefined : () => setSection(dispositifSections[index - 1]);
  const nextSection = useMemo(
    () => (index === dispositifSections.length - 1 ? undefined : () => setSection(dispositifSections[index + 1])),
    [dispositifSections, index, setSection],
  );

  const [startDate, setStartDate] = useState<Date>(new Date());
  useEffect(() => {
    setStartDate(new Date());
  }, [section]);

  /**
   * Valide la traduction de la section en cours pour la traduction de l'utilisateur courant
   */
  const validate = useCallback(
    async (value: string) => {
      const translated = cloneDeep(myTranslation.translated);
      set(translated, section, value);

      return API.saveTraduction({
        dispositifId: params.get("dispositif") || "",
        timeSpent: new Date().getTime() - startDate.getTime(),
        translated,
        language: params.get("language") || "",
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
            history.push("/fr/backend/user-translation/" + params.get("language"));
          } else {
            setMyTranslation(translation);
            isFunction(nextSection) && nextSection();
          }
        });
    },
    [history, myTranslation, nextSection, params, section, startDate],
  );

  return {
    defaultTraduction,
    dispositif,
    dispositifSections,
    error,
    loading,
    locale: params.get("language"),
    myTranslation,
    nextSection,
    prevSection,
    section,
    traductions,
    validate,
  };
};

export default useTranslation;
