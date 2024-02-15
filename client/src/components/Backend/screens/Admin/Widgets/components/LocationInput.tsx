import { useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FilterButton from "components/UI/FilterButton";
import parentStyles from "../Widgets.module.scss";

interface Props {
  selectedDepartment: string;
  setSelectedDepartment: (callback: any) => void;
}

export const LocationInput = (props: Props) => {
  const [geoSearch, setGeoSearch] = useState(false);
  const [search, setSearch] = useState("");

  const onPlaceSelected = (place: any) => {
    let depName = place.address_components[0]?.short_name;
    if (depName) {
      if (depName === "Département de Paris") depName = "Paris";
      props.setSelectedDepartment(depName);
      setGeoSearch(false);
    }
  };

  const handleChange = (e: any) => setSearch(e.target.value);

  return (
    <div className={cls(parentStyles.form_block, "d-flex align-items-center")}>
      <label className={cls(parentStyles.label, "me-4")}>Département</label>

      {/* maps autocomplete field */}
      {geoSearch && (
        <div>
          <Autocomplete
            apiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY || ""}
            value={search}
            onChange={handleChange}
            onPlaceSelected={onPlaceSelected}
            options={{
              componentRestrictions: { country: "fr" },
              types: ["administrative_area_level_2"]
            }}
            autoFocus
            className={parentStyles.fake_field}
          />
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
