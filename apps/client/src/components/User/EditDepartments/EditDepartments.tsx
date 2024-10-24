import { Button } from "@codegouvfr/react-dsfr/Button";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";
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

  const handleChange = (e: any) => setSearch(e.target.value);
  const onPlaceSelected = async (id: string) => {
    if (!isDirty) setIsDirty(true);
    const place = await getPlaceSelected(id);
    if (!place) return;
    if (!selectedDepartments.includes(place)) {
      const newDeps = [...(selectedDepartments || []), place];
      setSelectedDepartments(newDeps);
      setHidePredictions(true);
      setSearch("");
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
      <div className="position-relative">
        <div ref={suggestionsRef}>
          <SearchBar
            renderInput={({ className, id, placeholder, type }) => (
              <input
                className={className}
                name="location"
                id={id}
                placeholder={placeholder}
                type={type}
                value={search}
                onChange={handleChange}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setHidePredictions(true);
                  }
                }}
              />
            )}
          />
          {!!(!hidePredictions && predictions?.length) && (
            <div className={styles.suggestions}>
              {predictions.slice(0, 5).map((p, i) => (
                <button
                  key={i}
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
