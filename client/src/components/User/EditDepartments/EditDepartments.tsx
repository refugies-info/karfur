import { useEffect, useState, useRef } from "react";
import { useAsyncFn } from "react-use";
import { useSelector } from "react-redux";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { useDepartmentAutocomplete, useOutsideClick } from "hooks";
import { logger } from "logger";
import { formatDepartment } from "lib/departments";
import { cls } from "lib/classname";
import API from "utils/API";
import { userDetailsSelector } from "services/User/user.selectors";
import ErrorMessage from "components/UI/ErrorMessage";
import styles from "./EditDepartments.module.scss";

interface Props {
  successCallback: () => void;
  buttonFullWidth?: boolean;
}

const EditDepartments = (props: Props) => {
  const [error, setError] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const userDetails = useSelector(userDetailsSelector);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      setError("");
      if (!userDetails || selectedDepartments.length === 0) return;
      try {
        await API.updateUser(userDetails._id.toString(), {
          user: { departments: selectedDepartments },
          action: "modify-my-details",
        });
        props.successCallback();
      } catch (e: any) {
        logger.error(e);
        setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
      }
    },
    [userDetails, selectedDepartments, props.successCallback],
  );

  useEffect(() => {
    if (userDetails?.departments) setSelectedDepartments(userDetails.departments);
  }, [userDetails]);

  const { search, setSearch, hidePredictions, setHidePredictions, getPlaceSelected, predictions } =
    useDepartmentAutocomplete();

  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(suggestionsRef, () => setHidePredictions(true));

  const handleChange = (e: any) => setSearch(e.target.value);
  const onPlaceSelected = async (id: string) => {
    const place = await getPlaceSelected(id);
    if (!place) return;
    if (!selectedDepartments.includes(place)) {
      const newDeps = [...(selectedDepartments || []), place];
      setSelectedDepartments(newDeps);
      setHidePredictions(true);
      setSearch("");
    }
  };
  if (!userDetails) return null;

  return (
    <form onSubmit={submit}>
      <label htmlFor="location" className="mb-2">
        Nom ou numéro du département
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
