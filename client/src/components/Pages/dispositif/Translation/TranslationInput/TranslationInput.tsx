import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAsyncFn, useNumber, useToggle } from "react-use";
import get from "lodash/get";
import { Languages, SaveTranslationResponse } from "api-types";
import { useUser } from "hooks";
import API from "utils/API";
import Button from "components/UI/Button";
import styles from "./TranslationInput.module.scss";
import {
  ExpertTradStatus,
  getDisplay,
  getFooterStatus,
  getStatusStyle,
  getUserTradStatus,
  UserTradStatus,
} from "./functions";
import PageContext from "utils/pageContext";
import { Suggestion } from "components/Content/DispositifTranslate/functions";
import TranslationStatus from "./TranslationStatus";
import UserSuggest from "./UserSuggest";
import { cls } from "lib/classname";

export const getAllSuggestions = (mySuggestion: Suggestion, suggestions: Suggestion[]) => {
  return !!mySuggestion.text ? [mySuggestion, ...suggestions] : suggestions;
};

interface Props {
  section: string;
  initialText: string; // french text
  mySuggestion: Suggestion;
  suggestions: Suggestion[]; // all suggestions except mine
  locale: string;
  validate: (value: string, section: string, unfinished: boolean) => Promise<SaveTranslationResponse>;
}

const TranslationInput = ({ section, initialText, suggestions, mySuggestion, locale, validate }: Props) => {
  const { user } = useUser();
  const [googleTranslateValue, setGoogleTranslateValue] = useState("");
  const pageContext = useContext(PageContext);

  // Index pour parcourir les suggestions de traductions
  const max = useMemo(() => Math.max(suggestions.length, 0), [suggestions]); // suggestions + google translate
  const [index, { inc, dec, set }] = useNumber(-1, max, -1); // -1 : edit mode, n : suggestions, max : google translate
  const [validatedIndex, setValidatedIndex] = useState<number | null>(null);
  const [value, setValue] = useState<string>("");

  const [{ loading }, translate] = useAsyncFn(() =>
    API.get_translation({ q: initialText, language: locale as Languages }).then((data) => {
      const res = data.data.data;
      setGoogleTranslateValue(res);
      return res;
    }),
  );

  const openInput = useCallback(() => {
    pageContext.setActiveSection?.(section.replace("content.", ""));
  }, [section, pageContext]);

  const closeInput = useCallback(() => {
    pageContext.setActiveSection?.("");
  }, [pageContext]);

  const isOpen = useMemo(() => `content.${pageContext.activeSection}` === section, [pageContext, section]);

  // if index = last, get Google Translate value
  useEffect(() => {
    if (!googleTranslateValue && index === max && !loading) {
      translate();
    }
  }, [index, googleTranslateValue, loading, translate, max]);

  // Calcul de l'affichage du bouton
  const [display, setDisplay] = useState(
    getDisplay(mySuggestion, suggestions, user.user?.username || "", pageContext.showMissingSteps, user.expertTrad),
  );

  useEffect(() => {
    setDisplay(
      getDisplay(mySuggestion, suggestions, user.user?.username || "", pageContext.showMissingSteps, user.expertTrad),
    );
  }, [mySuggestion, suggestions, user, pageContext.showMissingSteps]);

  const editTranslation = (text: string) => {
    openInput();
    // if I'm expert and suggestions are available, show them
    if (user.expertTrad && !mySuggestion.text && suggestions.length > 0) {
      set(0);
    } else {
      // else, initialize and show edit form
      setValue(text);
      set(-1);
    }
  };
  const editTranslationAsExpert = (text: string) => {
    setValue(text);
    setValidatedIndex(null); // my own translation -> nothing validated
    set(-1);
  };

  // Si il n'y a pas de texte, on utilise la traduction
  // automatique pour en proposer une à l'utilisateur
  useEffect(() => {
    if (!display.text && !loading) {
      if (!googleTranslateValue) {
        translate().then((res) => setDisplay((d) => ({ ...d, text: res })));
      } else {
        setDisplay((d) => ({ ...d, text: googleTranslateValue }));
      }
    }
  }, [display, googleTranslateValue, loading, translate]);

  const next = () => inc();
  const prev = () => dec();

  const saveTrad = useCallback(
    (unfinished: boolean) => {
      validate(value, section, unfinished).then((res) => {
        closeInput();
      });
    },
    [validate, value, section, closeInput],
  );

  const validateTrad = (text: string) => {
    if (!user.expertTrad) return;
    setValue(text);
    setValidatedIndex(index);
  };

  const footerStatus = useMemo(
    () => getFooterStatus(index, mySuggestion, suggestions),
    [index, mySuggestion, suggestions],
  );

  return !isOpen ? (
    <div
      className={cls(styles.view, styles[getStatusStyle(display.status).type])}
      onClick={() => editTranslation(display.text)}
    >
      <div className={styles.status}>
        <UserSuggest username={display.username} picture={display.picture} />
        <TranslationStatus status={display.status} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: display.text }} />
    </div>
  ) : (
    <div className={styles.edit}>
      <div className={styles.input}>
        <div className={styles.text}>
          {index === -1 ? (
            <input disabled={loading} value={value} onChange={(e) => setValue(e.currentTarget.value)} autoFocus />
          ) : (
            <div onClick={user.expertTrad ? () => editTranslationAsExpert(suggestions[index]?.text) : undefined}>
              {index === max ? (
                <div dangerouslySetInnerHTML={{ __html: googleTranslateValue }} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: suggestions[index]?.text }} />
              )}
            </div>
          )}
        </div>

        <div className={cls(styles.footer, styles[footerStatus.status])}>
          <span className={styles.user}>
            {index === -1 ? (
              <UserSuggest username={user.user?.username || ""} picture="me" isBig />
            ) : index === max ? (
              <UserSuggest username="Google Translate" picture="google" isBig />
            ) : (
              <UserSuggest username={suggestions[index]?.username || ""} picture="user" isBig />
            )}
            <span className={styles.proposal}>{footerStatus.text}</span>
          </span>

          <div>
            {index >= 0 && (
              <Button
                className={cls(styles.nav, "me-4")}
                tertiary
                hasBorder={false}
                onClick={prev}
                icon="arrow-back-outline"
              ></Button>
            )}
            {suggestions.length > 0 && index < max - 1 && (
              <Button
                className={styles.nav}
                tertiary
                hasBorder={false}
                onClick={next}
                icon="arrow-forward-outline"
              ></Button>
            )}
            {index === max - 1 && (
              <Button
                className={styles.nav}
                tertiary
                hasBorder={false}
                onClick={() => inc()}
                icon="arrow-forward-outline"
                iconPlacement="end"
              >
                Voir Google Translate
              </Button>
            )}
            {user.expertTrad && suggestions.length > 0 && index < max && index >= 0 && (
              <Button
                secondary
                onClick={() => validateTrad(suggestions[index].text)}
                icon="checkmark-outline"
                className={cls(styles.validate, index === validatedIndex && styles.validated, "ms-2")}
              ></Button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        <Button secondary onClick={closeInput} icon="close-outline" iconPlacement="end">
          Annuler
        </Button>
        <div className="text-end">
          <Button
            disabled={!value}
            secondary
            onClick={() => saveTrad(true)}
            icon="clock-outline"
            iconPlacement="end"
            className="me-4"
          >
            Finir plus tard
          </Button>
          <Button disabled={!value} onClick={() => saveTrad(false)} icon="checkmark-circle-2" iconPlacement="end">
            Valider
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TranslationInput;
