import { useEffect, useState } from "react";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import FilterButton from "~/components/UI/FilterButton";
import { cls } from "~/lib/classname";
import parentStyles from "../Widgets.module.scss";

interface Props {
  selectedDepartment: string;
  setSelectedDepartment: (callback: any) => void;
}

interface Department {
  nom: string;
  code: string;
}

export const LocationInput = (props: Props) => {
  const [geoSearch, setGeoSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Department[]>([]);

  useEffect(() => {
    if (search.length > 2) {
      fetch(`https://geo.api.gouv.fr/departements?nom=${search}`)
        .then((response) => response.json())
        .then((data) => setSuggestions(data));
    } else {
      setSuggestions([]);
    }
  }, [search]);

  const onPlaceSelected = (depName: string) => {
    props.setSelectedDepartment(depName);
    setGeoSearch(false);
    setSearch("");
    setSuggestions([]);
  };

  const handleChange = (e: any) => setSearch(e.target.value);

  return (
    <div className={cls(parentStyles.form_block, "flex items-center")}>
      <label className={cls(parentStyles.label, "me-4")}>Département</label>

      {/* maps autocomplete field */}
      {geoSearch && (
        <div className="position-relative">
          <input
            type="text"
            value={search}
            onChange={handleChange}
            autoFocus
            className={parentStyles.fake_field}
          />
          {suggestions.length > 0 && (
            <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
              {suggestions.map((dep) => (
                <li
                  key={dep.code}
                  className="list-group-item list-group-item-action"
                  onClick={() => onPlaceSelected(dep.nom)}
                >
                  {dep.nom}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* dep selected */}
      {props.selectedDepartment && !geoSearch && (
        <FilterButton
          onClick={(e: any) => {
            e.preventDefault();
            props.setSelectedDepartment("");
          }}
          active={!!props.selectedDepartment}
          className="me-2"
        >
          {props.selectedDepartment}
        </FilterButton>
      )}

      {/* default state */}
      {!props.selectedDepartment && !geoSearch && (
        <button onClick={() => setGeoSearch(true)} className={parentStyles.fake_field}>
          Choisis un département
          <EVAIcon name="pin" fill="#212121" size="medium" className="ms-2" />
        </button>
      )}
    </div>
  );
};
