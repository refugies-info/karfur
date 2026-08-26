import { Button } from "@codegouvfr/react-dsfr/Button";
import { logger } from "logger";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useAsyncFn } from "react-use";
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

  const isListboxOpen = !hidePredictions && predictions.length > 0;

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
    inputRef.current?.focus();
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
              value={search}
              onChange={handleChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setHidePredictions(true);
                }
              }}
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
              {predictions.map((p) => (
                // `role="option"` on a <button> is allowed by ARIA in HTML, and it
                // keeps the existing `.suggestions > button` styling untouched.
                <button
                  key={p.id}
                  type="button"
                  role="option"
                  id={getOptionId(p.id)}
                  aria-selected={false}
                  tabIndex={-1}
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
                  title="Retirer le département"
                  size="small"
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
