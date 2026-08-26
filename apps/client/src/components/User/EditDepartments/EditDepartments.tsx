import { Button } from "@codegouvfr/react-dsfr/Button";
import { logger } from "logger";
import type React from "react";
import { useEffect, useRef, useState } from "react";
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

interface Props {
  successCallback: () => void;
  setIsLoading?: (isLoading: boolean) => void;
  buttonFullWidth?: boolean;
}

const EditDepartments = (props: Props) => {
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

  // Any change to the suggestion set drops the visual focus.
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
      return;
    }
    const count = predictions.length;
    if (announcedCountRef.current === count) return;
    announcedCountRef.current = count;

    let message: string;
    if (count === 0) message = "Aucune suggestion trouvée, modifiez votre recherche";
    else if (count === 1)
      message = "1 suggestion trouvée, utilisez les flèches haut et bas pour la parcourir";
    else
      message = `${count} suggestions trouvées, utilisez les flèches haut et bas pour les parcourir`;

    announce(message, { delay: 1500 });
  }, [predictions, hidePredictions, search, announce]);

  const handleChange = (e: any) => setSearch(e.target.value);
  const onPlaceSelected = async (id: string) => {
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
    inputRef.current?.focus();
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
        // APG prescribes for an editable combobox.
        if (isListboxOpen) setHidePredictions(true);
        else setSearch("");
        return;

      case "Tab":
        // Accept the focused option, then let focus move on normally.
        if (activeOption) onPlaceSelected(activeOption.id);
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
      <label htmlFor="location" className="fr-label mb-2">
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
              Rechercher
            </label>
            <input
              ref={inputRef}
              className="fr-input"
              name="location"
              id={INPUT_ID}
              placeholder="Rechercher"
              type="search"
              // Browser autofill would cover the suggestion list, and a department
              // search maps to no HTML autofill token.
              autoComplete="off"
              role="combobox"
              aria-expanded={isListboxOpen}
              aria-controls={LISTBOX_ID}
              // "list" and not "both": the suggestion engine scores by inclusion and
              // Levenshtein distance, so the first suggestion often does not start
              // with what was typed. Inline completion would overwrite the input
              // with unrelated text. Documented gap to the APG example.
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
                className="fr-btn"
                title="Rechercher"
                style={{ position: "absolute", right: 0 }}
                onClick={() => inputRef.current?.focus()}
              >
                Rechercher
              </button>
            )}
          </div>
          {isListboxOpen && (
            <div
              className={styles.suggestions}
              id={LISTBOX_ID}
              role="listbox"
              aria-label="Suggestions de départements"
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
                  title={`Retirer le département ${formatDepartment(dep)}`}
                  size="small"
                  // Without this the DSFR button falls back to type="submit" and
                  // removing a chip saves the form.
                  nativeButtonProps={{ type: "button" }}
                  onClick={() => setSelectedDepartments((deps) => deps?.filter((d) => d !== dep))}
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
