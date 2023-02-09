import { Button } from "@dataesr/react-dsfr";
import { useUser } from "hooks";
import { cloneDeep, flattenDeep, get, indexOf, isEmpty, isFunction, set } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory } from "react-router-dom";
import { useAsync, useAsyncFn, useNumber } from "react-use";
import { GetDispositifResponse } from "api-types";
import API from "utils/API";
import NewDispositif from "components/Frontend/Dispositif/NewDispositif";
import { setSelectedDispositifActionCreator } from "services/SelectedDispositif/selectedDispositif.actions";
import { useDispatch } from "react-redux";
import PageContext from "utils/pageContext";
import Swal from "sweetalert2";

const useParamsFromHistory = () => {
  const url = new URL("http://dummy/" + useHistory().location.pathname + useHistory().location.search);
  return url.searchParams;
};

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

interface TranslationTrucProp {
  initialText: string;
  suggestions: { text: string; username: string }[];
  section: string;
  prev: any;
  next: any;
  validate: (value: string) => void;
}

const TranslationTruc = ({ initialText, suggestions, section, prev, next, validate }: TranslationTrucProp) => {
  // Index pour parcourir les suggestions de traductions
  const [index, { inc, dec }] = useNumber(0, suggestions.length, 0);

  // on met la valeur de la traduction suggérée dans la valeur
  // si il n'y en a pas, on met une chaine vide
  const [value, setValue] = useState<string>(get(suggestions, "0.text", "") as string);

  const [{ loading }, translate] = useAsyncFn((initialText, language) =>
    API.get_translation({ q: initialText, language })
      .then((data) => data.data.data)
      .then((_) => {
        setValue(_);
        return _;
      }),
  );

  useEffect(() => {
    setValue(get(suggestions, "0.text", "") as string);
  }, [section, setValue, suggestions]);

  // Si il n'y a pas de valeur, on utilise la traduction
  // automatique pour en proposer une à l'utilisateur
  useEffect(() => {
    if (!value) translate(initialText, "en");
  }, [translate, initialText, value]);

  console.log("render", index, value, loading, section, initialText, suggestions);

  return (
    <div style={{ display: "grid" }}>
      <p>Section : {section}</p>
      <b>Texte initial</b>
      <p dangerouslySetInnerHTML={{ __html: initialText }}></p>
      <b>Translate part</b>
      <textarea
        style={{ margin: "1rem", border: "1px solid black" }}
        disabled={loading}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      ></textarea>

      <Button disabled={!prev} onClick={prev}>
        Prev
      </Button>
      <Button disabled={!next} onClick={next}>
        Next
      </Button>

      <Button
        disabled={loading && !value}
        onClick={() => {
          // console.log("Validate translation", section, value);
          validate(value);
        }}
      >
        Valider
      </Button>
    </div>
  );
};

const useTranslation = () => {
  const { user } = useUser();
  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParamsFromHistory();
  const [section, _setSection] = useState<string>("content.titreInformatif");
  const setSection = useCallback(
    (_section: string) => {
      console.log("Selected section", _section);
      // Goto section scroll
      _setSection(_section);
    },
    [_setSection],
  );
  const [myTranslation, setMyTranslation] = useState({
    translated: {},
  });

  const { loading, value, error } = useAsync(() =>
    Promise.all([
      API.getDispositif(params.get("dispositif") || "", params.get("language") || "")
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

      console.log("traductions", traductions);

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

  console.log("myTranslation", myTranslation);

  return {
    defaultTraduction,
    dispositif,
    dispositifSections,
    error,
    loading,
    myTranslation,
    nextSection,
    prevSection,
    section,
    traductions,
    validate,
  };
};

const NewTranslation = () => {
  const { user } = useUser();

  const { defaultTraduction, error, loading, nextSection, prevSection, section, traductions, validate } =
    useTranslation();

  if (error) {
    return (
      <div>
        <h1>Traduction</h1>
        <p>{error?.message}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <h1>Traduction</h1>
        <Skeleton />
      </div>
    );
  }

  /*
   * Calcul de l'affichage dans le textarea
   *
   * 2 profils utilisateurs :
   *  - traducteur
   *    - le traducteur "récupère" une ancienne traduction commencée
   *    - le traducteur fait une traduction depuis zéro
   *  - traducteur expert
   *    - le traducteur "récupère" une ancienne traduction commencée
   *    - le traduction fait une traduction depuis zéro
   *    - le traduction valide des traductions proposées par d'autres traducteurs
   *
   * Si aucune traduction n'est disponible, une traduction automatique est proposée.
   *
   * Un mix des cas est possible en cas de traduction(s) partielle(s)
   */

  /*
   * activeSection est seulement le dernier élément du chemin vers la section
   * TODO à challenger : peu apporter des conflits
   */
  return (
    <PageContext.Provider value={{ mode: "translate", activeSection: section.split(".").pop() }}>
      <div>
        <h1>Traduction</h1>
        {isEmpty(traductions) ? (
          <p>Aucune traduction disponible</p>
        ) : (
          <p>{traductions.length} traductions disponibles</p>
        )}
        {user.expertTrad ? <p>Vous êtes traducteur expert</p> : <p>Vous êtes traducteur</p>}
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1 }}>
            <TranslationTruc
              initialText={get(defaultTraduction, section)}
              suggestions={traductions.map((traduction: any) => ({
                username: traduction.username,
                text: get(traduction.translated, section),
              }))}
              section={section}
              prev={prevSection}
              next={nextSection}
              validate={validate}
            />
          </div>
          <div style={{ flex: 3 }}>
            <NewDispositif />
          </div>
        </div>
      </div>
    </PageContext.Provider>
  );
};

export default NewTranslation;
