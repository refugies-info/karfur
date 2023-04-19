import { useEffect, useState } from "react";
import { useAsyncFn, useNumber, useToggle } from "react-use";
import get from "lodash/get";
import { Languages } from "api-types";
import { useUser } from "hooks";
import API from "utils/API";
import Button from "components/UI/Button";
import styles from "./TranslationInput.module.scss";

export interface TranslationInputProps {
  section: string;
  initialText: string;
  suggestions: { username: any; author: any; text: any }[];
  toReview: boolean;
  locale: string;
  validate: any;
}

const TranslationInput = ({ section, initialText, suggestions, toReview, locale, validate }: TranslationInputProps) => {
  const { user } = useUser();
  const [open, toggleOpen] = useToggle(false);
  const [googleTranslated, toggleGoogleTranslated] = useToggle(false);

  // Index pour parcourir les suggestions de traductions
  const max = Math.max(suggestions.length - 1, 0);
  const [index, { inc, dec, reset }] = useNumber(0, max, 0);

  // on met la valeur de la traduction suggérée dans la valeur
  // si il n'y en a pas, on met une chaine vide
  const [value, setValue] = useState<string>(get(suggestions, `${index}.text`, "") as string);

  const [{ loading }, translate] = useAsyncFn((initialText: string, language: Languages) =>
    API.get_translation({ q: initialText, language })
      .then((data) => data.data.data)
      .then((value) => {
        setValue(value);
        toggleGoogleTranslated(true);
      }),
  );

  useEffect(() => {
    setValue(get(suggestions, `${index}.text`, "") as string);
  }, [index, section, setValue, suggestions]);

  // Si il n'y a pas de valeur, on utilise la traduction
  // automatique pour en proposer une à l'utilisateur
  useEffect(() => {
    if (!value && !loading) translate(initialText, locale as Languages);
    reset();
  }, [value, translate, initialText, locale, loading, reset]);

  // console.log("render", index, value, loading, section, initialText, suggestions);

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
  return !open ? (
    <div className={styles.view} onClick={() => toggleOpen(true)}>
      {/* <p>Nombre de suggestions : {suggestions.length}</p>
      {toReview && <b>A REVOIR</b>} */}
      <span dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  ) : (
    <div className={styles.edit}>
      <div className={styles.input}>
        <input disabled={loading} value={value} onChange={(e) => setValue(e.currentTarget.value)} />

        {user.expertTrad && suggestions.length > 0 ? (
          <div className={styles.authors}>
            <div>{user.userId === suggestions[index]?.author ? user.user?.username : suggestions[index]?.username}</div>
            {suggestions.length > 1 ? (
              <div>
                <Button
                  tertiary
                  hasBorder={false}
                  disabled={index === 0}
                  onClick={() => dec()}
                  icon="arrow-back-outline"
                  className="me-4"
                ></Button>
                <Button
                  tertiary
                  hasBorder={false}
                  disabled={index === max}
                  onClick={() => inc()}
                  icon="arrow-forward-outline"
                ></Button>
              </div>
            ) : null}
          </div>
        ) : (
          <p>Pas expert trad</p>
        )}
      </div>

      <div className={styles.buttons}>
        <Button secondary onClick={() => toggleOpen(false)} icon="close-outline" iconPlacement="end">
          Annuler
        </Button>
        <div className="text-end">
          <Button secondary onClick={() => {}} icon="clock-outline" iconPlacement="end" className="me-4">
            Finir plus tard
          </Button>
          <Button
            disabled={loading && !value}
            onClick={() => validate(value, section)}
            icon="checkmark-circle-2"
            iconPlacement="end"
          >
            Valider
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TranslationInput;
