import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAsyncFn, useNumber } from "react-use";
import { useWatch } from "react-hook-form";
import { Languages } from "@refugies-info/api-types";
import { useEvent, useUser } from "hooks";
import { Suggestion } from "hooks/dispositif";
import { checkIsRTL } from "hooks/useRTL";
import { cls } from "lib/classname";
import API from "utils/API";
import PageContext from "utils/pageContext";
import TranslationStatus from "./TranslationStatus";
import UserSuggest from "./UserSuggest";
import BottomButtons from "./BottomButtons";
import TranslationEditField from "./TranslationEditField";
import SuggestionsNavButtons from "./SuggestionsNavButtons";
import TranslationEditAuthor from "./TranslationEditAuthor";
import { getDisplay, getFooterStatus, getStatusStyle } from "./functions";
import styles from "./TranslationInput.module.scss";

export const getAllSuggestions = (mySuggestion: Suggestion, suggestions: Suggestion[]) => {
  return !!mySuggestion.text ? [mySuggestion, ...suggestions] : suggestions;
};

interface Props {
  id?: string;
  section: string;
  initialText: string; // french text
  mySuggestion: Suggestion;
  suggestions: Suggestion[]; // all suggestions except mine
  locale: string;
  validate: (section: string, value: { text?: string; unfinished?: boolean }) => void;
  deleteTrad: (section: string) => void;
  size?: "xl" | "lg";
  isHTML: boolean;
  noAutoTrad: boolean;
  maxLength?: number;
}

const TranslationInput = (props: Props) => {
  const {
    id,
    section,
    initialText,
    suggestions,
    mySuggestion,
    locale,
    validate,
    deleteTrad,
    size,
    isHTML,
    noAutoTrad,
    maxLength,
  } = props;
  const { user } = useUser();
  const { Event } = useEvent();
  const pageContext = useContext(PageContext);
  const isRTL = useMemo(() => checkIsRTL(locale), [locale]);

  // Index pour parcourir les suggestions de traductions
  const max = useMemo(() => Math.max(suggestions.length, 0), [suggestions]);
  const [index, { inc, dec, set }] = useNumber(-1, max, -1); // -1 : edit mode, n : suggestions, max : google translate
  const [validatedIndex, setValidatedIndex] = useState<number | null>(null); // index of translation validated by the expert

  // Input value
  const value: string = useWatch({ name: `translated.${section}` });
  const [oldSuggestion, setOldSuggestion] = useState<Suggestion>(mySuggestion);

  // Calcul de l'affichage du bouton
  const [display, setDisplay] = useState(
    getDisplay(mySuggestion, suggestions, user.user?.username || "", pageContext.showMissingSteps, user.expertTrad),
  );

  useEffect(() => {
    setDisplay(
      getDisplay(mySuggestion, suggestions, user.user?.username || "", pageContext.showMissingSteps, user.expertTrad),
    );
  }, [mySuggestion, suggestions, user, pageContext.showMissingSteps]);

  // Google translate
  const [googleTranslateValue, setGoogleTranslateValue] = useState("");
  const [{ loading }, translate] = useAsyncFn(() =>
    API.get_translation({ q: initialText, language: locale as Languages }).then((res) => {
      setGoogleTranslateValue(res);
      return res;
    }),
  );

  // if index = last, get Google Translate value as suggestion
  useEffect(() => {
    if (!googleTranslateValue && index === max && !loading && !noAutoTrad) {
      translate();
    }
  }, [index, googleTranslateValue, loading, translate, max, noAutoTrad]);

  // Si il n'y a pas de texte, on utilise la traduction
  // automatique pour en proposer une à l'utilisateur
  useEffect(() => {
    if (!display.text && !loading) {
      if (noAutoTrad) {
        setDisplay((d) => ({ ...d, text: initialText }));
      } else {
        if (!googleTranslateValue) {
          translate().then((res) => setDisplay((d) => ({ ...d, text: res })));
        } else {
          setDisplay((d) => ({ ...d, text: googleTranslateValue }));
        }
      }
    }
  }, [display, googleTranslateValue, loading, translate, noAutoTrad, initialText]);

  // Open state
  const openInput = useCallback(() => {
    pageContext.setActiveSection?.(section.replace("content.", ""));
  }, [section, pageContext]);

  const closeInput = useCallback(() => {
    pageContext.setActiveSection?.("");
  }, [pageContext]);

  const isOpen = useMemo(() => `content.${pageContext.activeSection}` === section, [pageContext, section]);

  // quand la sections se ferme, si elle était validée mais que le contenu a changé
  // on la passe en toFinish
  useEffect(() => {
    if (!isOpen && !!value && oldSuggestion.text !== value && !oldSuggestion.toFinish) {
      validate(section, { unfinished: true });
      setOldSuggestion({ ...mySuggestion, text: value, toFinish: true });
    }
  }, [isOpen, oldSuggestion, section, validate, value, mySuggestion]);

  // Buttons
  const clickTranslation = (text: string) => {
    setOldSuggestion(mySuggestion);
    openInput();
    // if I'm expert and suggestions are available, show them
    if (user.expertTrad && !mySuggestion.text && suggestions.length > 0) {
      set(0);
    } else {
      // else, initialize and show edit form
      const initialToFinish = !mySuggestion.text || mySuggestion.toFinish;
      validate(section, { text, unfinished: initialToFinish });
      set(-1);
    }
  };
  const clickSuggestionAsExpert = (text: string) => {
    validate(section, { text, unfinished: true });
    setValidatedIndex(null); // my own translation -> nothing validated
    set(-1);
    Event("DISPO_TRAD", "edit suggestion as expert", "Translation Input");
  };
  const saveTrad = useCallback(
    (unfinished: boolean) => {
      setOldSuggestion({ ...mySuggestion, text: value, toFinish: unfinished });
      validate(section, { unfinished });
      closeInput();
    },
    [validate, section, closeInput, mySuggestion, value],
  );
  const validateSuggestion = useCallback(() => {
    if (!user.expertTrad) return;
    const text = suggestions[index].text;
    validate(section, { text });
    setValidatedIndex(index);
  }, [user, section, index, suggestions, validate]);
  const cancel = useCallback(() => {
    validate(section, { text: oldSuggestion.text, unfinished: oldSuggestion.toFinish });
    closeInput();
    Event("DISPO_TRAD", "cancel", "Translation Input");
  }, [section, oldSuggestion, validate, closeInput, Event]);
  const deleteTranslation = useCallback(() => {
    deleteTrad(section);
    closeInput();
  }, [section, closeInput, deleteTrad]);

  const footerStatus = useMemo(
    () => getFooterStatus(index, mySuggestion, suggestions),
    [index, mySuggestion, suggestions],
  );

  return (
    <div id={id} className={cls(size && styles[size])}>
      {!isOpen ? (
        // preview
        <div
          className={cls(styles.view, styles[getStatusStyle(display.status).type])}
          onClick={() => clickTranslation(display.text)}
        >
          <div className={styles.status}>
            <UserSuggest username={display.username} picture={display.picture} />
            <TranslationStatus status={display.status} />
          </div>
          <div
            className={styles.value}
            dangerouslySetInnerHTML={{ __html: display.text }}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
      ) : (
        <div className={cls(styles.edit)}>
          <div className={styles.input}>
            <div>
              {index === -1 ? (
                // edit suggestion
                <TranslationEditField
                  isHTML={isHTML}
                  section={section}
                  validate={validate}
                  isRTL={isRTL}
                  loading={loading}
                  maxLength={maxLength}
                  className={cls(styles.text, styles.value)}
                />
              ) : (
                // view suggestion
                <div
                  className={cls(styles.text, styles.value)}
                  onClick={user.expertTrad ? () => clickSuggestionAsExpert(suggestions[index]?.text) : undefined}
                >
                  {index === max ? (
                    <div dangerouslySetInnerHTML={{ __html: googleTranslateValue }} dir={isRTL ? "rtl" : "ltr"} />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: suggestions[index]?.text }} dir={isRTL ? "rtl" : "ltr"} />
                  )}
                </div>
              )}
            </div>

            <div className={cls(styles.footer, styles[footerStatus.status])}>
              <TranslationEditAuthor
                index={index}
                max={max}
                footerStatus={footerStatus}
                suggestions={suggestions}
                deleteTranslation={deleteTranslation}
              />

              <SuggestionsNavButtons
                index={index}
                max={max}
                validatedIndex={validatedIndex}
                suggestionsCount={suggestions.length}
                isExpert={user.expertTrad}
                prev={() => dec()}
                next={() => inc()}
                validateSuggestion={validateSuggestion}
              />
            </div>
          </div>

          <BottomButtons cancel={cancel} saveTrad={saveTrad} disabled={!value} />
        </div>
      )}
    </div>
  );
};

export default TranslationInput;
