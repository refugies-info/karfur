import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAsyncFn, useNumber } from "react-use";
import { useWatch } from "react-hook-form";
import { Languages } from "api-types";
import { useUser } from "hooks";
import { cls } from "lib/classname";
import API from "utils/API";
import PageContext from "utils/pageContext";
import Button from "components/UI/Button";
import { Suggestion } from "components/Content/DispositifTranslate/functions";
import RichTextInput from "components/UI/RichTextInput";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import TranslationStatus from "./TranslationStatus";
import UserSuggest from "./UserSuggest";
import { getDisplay, getFooterStatus, getStatusStyle } from "./functions";
import styles from "./TranslationInput.module.scss";

export const getAllSuggestions = (mySuggestion: Suggestion, suggestions: Suggestion[]) => {
  return !!mySuggestion.text ? [mySuggestion, ...suggestions] : suggestions;
};

interface Props {
  section: string;
  initialText: string; // french text
  mySuggestion: Suggestion;
  suggestions: Suggestion[]; // all suggestions except mine
  locale: string;
  validate: (section: string, value: { text?: string; unfinished?: boolean }) => Promise<void>;
  size?: "xl" | "lg";
  isHTML: boolean;
  noAutoTrad: boolean;
  maxLength?: number;
}

const TranslationInput = ({
  section,
  initialText,
  suggestions,
  mySuggestion,
  locale,
  validate,
  size,
  isHTML,
  noAutoTrad,
  maxLength,
}: Props) => {
  const { user } = useUser();
  const pageContext = useContext(PageContext);

  // Index pour parcourir les suggestions de traductions
  const max = useMemo(() => Math.max(suggestions.length, 0), [suggestions]); // suggestions + google translate
  const [index, { inc, dec, set }] = useNumber(-1, max, -1); // -1 : edit mode, n : suggestions, max : google translate
  const [validatedIndex, setValidatedIndex] = useState<number | null>(null);

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
    API.get_translation({ q: initialText, language: locale as Languages }).then((data) => {
      const res = data.data.data;
      setGoogleTranslateValue(res);
      return res;
    }),
  );

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
  const next = () => inc();
  const prev = () => dec();

  const saveTrad = useCallback(
    (unfinished: boolean) => {
      setOldSuggestion({ ...mySuggestion, text: value, toFinish: unfinished });
      validate(section, { unfinished });
      closeInput();
    },
    [validate, section, closeInput, mySuggestion, value],
  );

  const validateSuggestion = (text: string) => {
    if (!user.expertTrad) return;
    validate(section, { text });
    setValidatedIndex(index);
  };

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
  };
  const cancel = () => {
    validate(section, { text: oldSuggestion.text, unfinished: oldSuggestion.toFinish });
    closeInput();
  };

  const footerStatus = useMemo(
    () => getFooterStatus(index, mySuggestion, suggestions),
    [index, mySuggestion, suggestions],
  );
  const remainingChars = useMemo(() => (!maxLength ? null : maxLength - (value || "").length), [value, maxLength]);

  return !isOpen ? (
    <div
      className={cls(styles.view, styles[getStatusStyle(display.status).type], size && styles[size])}
      onClick={() => clickTranslation(display.text)}
    >
      <div className={styles.status}>
        <UserSuggest username={display.username} picture={display.picture} />
        <TranslationStatus status={display.status} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: display.text }} />
    </div>
  ) : (
    <div className={cls(styles.edit, size && styles[size])}>
      <div className={styles.input}>
        <div>
          {index === -1 ? (
            !isHTML ? (
              <>
                <textarea
                  className={styles.text}
                  disabled={loading}
                  value={value}
                  onChange={(e) => validate(section, { text: e.target.value })}
                  autoFocus
                  maxLength={maxLength}
                />
                {maxLength && (
                  <p className={styles.error}>
                    <EVAIcon name="alert-triangle" size={16} fill={styles.lightTextDefaultError} className="me-2" />
                    {remainingChars} sur 110 caractères restants
                  </p>
                )}
              </>
            ) : (
              <RichTextInput
                value={value}
                onChange={(html) => validate(section, { text: html })}
                className={styles.richtext}
              />
            )
          ) : (
            <div
              className={styles.text}
              onClick={user.expertTrad ? () => clickSuggestionAsExpert(suggestions[index]?.text) : undefined}
            >
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
                onClick={() => validateSuggestion(suggestions[index].text)}
                icon="checkmark-outline"
                className={cls(styles.validate, index === validatedIndex && styles.validated, "ms-2")}
              ></Button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        <Button secondary onClick={cancel} icon="close-outline" iconPlacement="end">
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
