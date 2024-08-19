import { Dispatch, SetStateAction, useRef } from "react";
import { formatDepartment } from "lib/departments";
import { useDepartmentAutocomplete } from "hooks";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Input from "components/Pages/dispositif/Input";
import { RemovableItem } from "../../components";
import styles from "./DepartmentInput.module.scss";

interface Props {
  selectedDepartments: string[] | null | undefined;
  setSelectedDepartments: Dispatch<SetStateAction<string[] | null | undefined>>;
}

const DepartmentInput = (props: Props) => {
  const { search, setSearch, hidePredictions, setHidePredictions, getPlaceSelected, predictions } =
    useDepartmentAutocomplete();
  const handleChange = (e: any) => setSearch(e.target.value);

  const onPlaceSelected = async (id: string) => {
    const place = await getPlaceSelected(id);
    if (!place) return;
    if (!props.selectedDepartments?.includes(place)) {
      const newDeps = [...(props.selectedDepartments || []), place];
      props.setSelectedDepartments(newDeps);
      setHidePredictions(true);
    }
  };

  return (
    <div>
      <div className="position-relative w-100">
        <Input
          id="search-department-input"
          placeholder="Exemple : “Paris” ou “75”"
          type="text"
          onChange={handleChange}
          reset={() => {
            setSearch("");
            setHidePredictions(true);
          }}
          value={search}
          icon="search-outline"
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
                className={styles.btn}
              >
                <EVAIcon name="pin-outline" fill="black" size={20} className="me-2" />
                {p.text}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.selected}>
        {(props.selectedDepartments || []).map((dep, i) => (
          <RemovableItem
            key={i}
            text={formatDepartment(dep)}
            onClick={() => props.setSelectedDepartments((departments) => departments?.filter((d) => d !== dep))}
          />
        ))}
      </div>
    </div>
  );
};

export default DepartmentInput;
