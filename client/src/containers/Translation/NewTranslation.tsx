import { useUser } from "hooks";
import { get, isEmpty, isUndefined, some } from "lodash";
import Skeleton from "react-loading-skeleton";
import PageContext from "utils/pageContext";
import Dispositif from "components/Content/Dispositif";
import useTranslation from "./useTranslation";
import TranslationInput from "./TranslationInput";
import { ProgressWithValue } from "containers/Backend/UserTranslation/components/SubComponents";

const filterAndTransformTranslations = (section: string, traductions: any[]) =>
  traductions
    // Filtre les suggestions non pertinentes pour cette section
    .filter((traduction: any) => !isUndefined(get(traduction.translated, section)))
    .map((traduction: any) => ({
      username: traduction.username,
      author: traduction.author,
      text: get(traduction.translated, section),
    }));

const NewTranslation = () => {
  const { user } = useUser();

  const {
    defaultTraduction,
    error,
    loading,
    locale,
    myTranslation,
    nextSection,
    prevSection,
    section,
    traductions,
    validate,
  } = useTranslation();

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
        <ProgressWithValue avancementTrad={myTranslation.avancement} isExpert={user.expertTrad} />
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1 }}>
            <TranslationInput
              initialText={get(defaultTraduction, section)}
              suggestions={filterAndTransformTranslations(section, traductions)}
              section={section}
              prev={prevSection}
              next={nextSection}
              validate={validate}
              toReview={some(traductions, (trad) => trad.toReview?.includes(section) || false)}
              locale={locale || ""}
            />
          </div>
          <div style={{ flex: 3 }}>
            <Dispositif />
          </div>
        </div>
      </div>
    </PageContext.Provider>
  );
};

export default NewTranslation;
