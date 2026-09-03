import { Button } from "@codegouvfr/react-dsfr/Button";
import { logger } from "logger";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useAsyncFn } from "react-use";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import ErrorMessage from "~/components/UI/ErrorMessage";
import { useDepartmentAutocomplete, useOutsideClick } from "~/hooks";
import { cls } from "~/lib/classname";
import { formatDepartment } from "~/lib/departments";
import { userDetailsSelector } from "~/services/User/user.selectors";
import API from "~/utils/API";
import styles from "./EditDepartments.module.scss";

/**
 * Fixed ids: this combobox is rendered at most once per page (registration step
 * or user profile modal), so fixed ids stay deterministic between server and client.
 */
const INPUT_ID = "departments-search";
const LISTBOX_ID = "departments-suggestions";
const getOptionId = (code: string) => `departments-option-${code}`;

// French fallbacks: the keys live in fr/common.json only until they reach the translation flow.
const SUGGESTIONS_FOUND_DEFAULTS = {
  defaultValue_zero: "Aucune suggestion trouvée, modifiez votre recherche",
  defaultValue_one:
    "{{count}} suggestion trouvée, utilisez les flèches haut et bas pour la parcourir",
  defaultValue_other:
    "{{count}} suggestions trouvées, utilisez les flèches haut et bas pour les parcourir",
};

interface Props {
  successCallback: () => void;
  setIsLoading?: (isLoading: boolean) => void;
  buttonFullWidth?: boolean;
}

const EditDepartments = (props: Props) => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const userDetails = useSelector(userDetailsSelector);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      props.setIsLoading?.(true);
      setError("");
      if (!userDetails || selectedDepartments.length === 0) return;
      try {
        await API.updateUser(userDetails._id.toString(), {
          user: { departments: selectedDepartments },
          action: "modify-my-details",
        });
        props.successCallback();
      } catch (e: any) {
        props.setIsLoading?.(false);
        logger.error(e);
        setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
      }
    },
    [userDetails, selectedDepartments, props.successCallback],
  );

  useEffect(() => {
    if (userDetails?.departments && (userDetails?.departments?.length || 0) > 0) {
      setSelectedDepartments(userDetails.departments);
      setIsDirty(true);
    }
  }, [userDetails]);

  const { search, setSearch, hidePredictions, setHidePredictions, getPlaceSelected, predictions } =
    useDepartmentAutocomplete();

  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(suggestionsRef, () => setHidePredictions(true));

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  // Index of the option holding the visual focus. DOM focus never leaves the input,
  // the position is carried by aria-activedescendant.
  const [activeIndex, setActiveIndex] = useState(-1);

  const isListboxOpen = !hidePredictions && predictions.length > 0;
  const activeOption = isListboxOpen ? predictions[activeIndex] : undefined;

  useEffect(() => {
    setActiveIndex(-1);
  }, [predictions]);

  const announce = useAnnounce();
  const announcedCountRef = useRef<number | null>(null);

  // Reads out how many suggestions are available. Fires on a change of count, not
  // on every keystroke, so it does not talk over the listbox semantics.
  useEffect(() => {
    if (hidePredictions || search.length < 2) {
      announcedCountRef.current = null;
      return undefined;
    }
    const count = predictions.length;

    if (count === 0) {
      // ~1.5 s from the last keystroke clears the keyboard echo (measured 27/08); said only once.
      if (announcedCountRef.current === count) return undefined;
      const timer = setTimeout(() => {
        announcedCountRef.current = 0;
        announce(
          t("EditDepartments.suggestions_found", { count: 0, ...SUGGESTIONS_FOUND_DEFAULTS }),
        );
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (announcedCountRef.current === count) return undefined;
    announcedCountRef.current = count;

    announce(t("EditDepartments.suggestions_found", { count, ...SUGGESTIONS_FOUND_DEFAULTS }), {
      delay: 1500,
    });
    return undefined;
  }, [predictions, hidePredictions, search, announce, t]);

  const handleChange = (e: any) => setSearch(e.target.value);
  const onPlaceSelected = async (id: string, { restoreFocus = true } = {}) => {
    if (!isDirty) setIsDirty(true);
    const place = await getPlaceSelected(id);
    if (!place) return;
    if (!selectedDepartments.includes(place)) {
      setSelectedDepartments([...(selectedDepartments || []), place]);
    }
    // The combobox always closes and clears after a selection, and focus never
    // leaves the text field: this is what makes Enter usable on an option.
    setHidePredictions(true);
    setSearch("");
    setActiveIndex(-1);
    if (restoreFocus) inputRef.current?.focus();
  };

  const removeAnnounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // A removal announcement still pending when the component unmounts (modal
  // closed right after a removal) must not fire into a page that moved on.
  useEffect(
    () => () => {
      if (removeAnnounceTimerRef.current) clearTimeout(removeAnnounceTimerRef.current);
    },
    [],
  );

  const removeDepartment = (dep: string) => {
    const remaining = selectedDepartments.filter((d) => d !== dep);
    setSelectedDepartments(remaining);
    // The activated button unmounts along with its chip, and focus would fall on
    // <body>. Focus goes back to the search field because it is the only target
    // that always exists: when the last chip goes, the whole chip list unmounts.
    inputRef.current?.focus();
    const department = formatDepartment(dep);
    const message =
      remaining.length === 0
        ? t("EditDepartments.last_department_removed", {
            department,
            defaultValue:
              "Département {{department}} retiré. Vous devez sélectionner au moins un département.",
            interpolation: { escapeValue: false },
          })
        : t("EditDepartments.department_removed", {
            department,
            defaultValue: "Département {{department}} retiré.",
            interpolation: { escapeValue: false },
          });
    // ~300 ms clears the focus echo (measured 27/08); interrupt skips the queued counts.
    if (removeAnnounceTimerRef.current) clearTimeout(removeAnnounceTimerRef.current);
    removeAnnounceTimerRef.current = setTimeout(() => {
      removeAnnounceTimerRef.current = null;
      announce(message, { priority: "interrupt" });
    }, 300);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const count = predictions.length;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (count === 0) return;
        if (!isListboxOpen) {
          setHidePredictions(false);
          setActiveIndex(event.altKey ? -1 : 0);
          return;
        }
        if (event.altKey) return;
        setActiveIndex((index) => (index + 1 >= count ? 0 : index + 1));
        return;

      case "ArrowUp":
        event.preventDefault();
        if (count === 0) return;
        if (!isListboxOpen) {
          setHidePredictions(false);
          setActiveIndex(count - 1);
          return;
        }
        setActiveIndex((index) => (index <= 0 ? count - 1 : index - 1));
        return;

      case "Enter":
        // Closed listbox: implicit form submission is left untouched.
        if (!isListboxOpen) return;
        event.preventDefault();
        if (activeOption) onPlaceSelected(activeOption.id);
        else setHidePredictions(true);
        return;

      case "Escape":
        event.preventDefault();
        // Open: close and keep what was typed. Closed: clear the field, as the
        // ARIA Authoring Practices Guide (APG) prescribes for an editable combobox.
        if (isListboxOpen) setHidePredictions(true);
        else setSearch("");
        return;

      case "Tab":
        // Tab has already moved focus on; the selection must not pull it back.
        if (activeOption) onPlaceSelected(activeOption.id, { restoreFocus: false });
        setHidePredictions(true);
        return;

      default:
        return;
    }
  };

  useEffect(() => {
    if (selectedDepartments.length === 0 && isDirty) {
      setError("Vous devez sélectionner au moins un département");
    } else {
      setError("");
    }
  }, [selectedDepartments, isDirty]);

  if (!userDetails) return null;

  return (
    <form onSubmit={submit}>
      <label htmlFor={INPUT_ID} className="fr-label mb-2">
        Nom ou numéro du département
        <span className="fr-hint-text">Plusieurs choix possibles</span>
      </label>
      <div className="relative">
        <div ref={suggestionsRef}>
          {/*
            Hand-rolled equivalent of the DSFR `SearchBar`, kept class for class so
            the rendering does not move. `SearchBar` hard-codes `role="search"` on
            its wrapper, which RGAA 8.9 asks us to drop here, and it renders a
            submit-typed button inside our form.
          */}
          <div className="fr-search-bar">
            <label className="fr-label" htmlFor={INPUT_ID}>
              {t("Rechercher", "Rechercher")}
            </label>
            <input
              ref={inputRef}
              className="fr-input"
              name="location"
              id={INPUT_ID}
              placeholder={t("Rechercher", "Rechercher")}
              type="search"
              autoComplete="off"
              // The spell checker talks over the announcements in VoiceOver (measured 27/08).
              spellCheck={false}
              role="combobox"
              aria-expanded={isListboxOpen}
              aria-controls={isListboxOpen ? LISTBOX_ID : undefined}
              // "list", not "both": suggestions are scored by similarity, so inline completion would overwrite the input
              aria-autocomplete="list"
              aria-activedescendant={activeOption ? getOptionId(activeOption.id) : undefined}
              value={search}
              onChange={handleChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onKeyDown={handleKeyDown}
            />
            {!isInputFocused && search === "" && (
              <button
                type="button"
                className="fr-btn absolute end-0"
                title={t("Rechercher", "Rechercher")}
                onClick={() => inputRef.current?.focus()}
              >
                {t("Rechercher", "Rechercher")}
              </button>
            )}
          </div>
          {isListboxOpen && (
            <div
              className={styles.suggestions}
              id={LISTBOX_ID}
              role="listbox"
              aria-label={t("EditDepartments.suggestions_label", "Suggestions de départements")}
            >
              {predictions.map((p, index) => (
                // `role="option"` on a <button> is allowed by ARIA in HTML, and it
                // keeps the existing `.suggestions > button` styling untouched.
                <button
                  key={p.id}
                  type="button"
                  role="option"
                  id={getOptionId(p.id)}
                  aria-selected={index === activeIndex}
                  tabIndex={-1}
                  className={index === activeIndex ? styles.active : undefined}
                  onClick={(e: any) => {
                    e.preventDefault();
                    onPlaceSelected(p.id);
                  }}
                >
                  {p.text}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedDepartments.length > 0 && (
          <div className="mt-12">
            {selectedDepartments.map((dep, i) => (
              <div key={dep} className={styles.option}>
                {formatDepartment(dep)}
                <Button
                  iconId="fr-icon-close-line"
                  priority="tertiary no outline"
                  title={t("EditDepartments.remove_department", {
                    department: formatDepartment(dep),
                    defaultValue: "Retirer le département {{department}}",
                    interpolation: { escapeValue: false },
                  })}
                  size="small"
                  // Without this the DSFR button falls back to type="submit" and
                  // removing a chip saves the form.
                  nativeButtonProps={{ type: "button" }}
                  onClick={() => removeDepartment(dep)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <ErrorMessage error={error} />

      <div className="text-end">
        <Button
          iconId="fr-icon-check-line"
          iconPosition="right"
          className={cls(styles.button, props.buttonFullWidth && styles.full, "mt-12")}
          nativeButtonProps={{ type: "submit" }}
          disabled={loading || selectedDepartments.length === 0}
        >
          Valider
        </Button>
      </div>
    </form>
  );
};

export default EditDepartments;
