import { useState } from "react";
import { LocalisationFilter } from "components/Pages/advanced-search/MobileAdvancedSearch/LocalisationFilter/LocalisationFilter";
import { cls } from "lib/classname";
import parentStyles from "../Widgets.module.scss";

interface Props {
  selectedCity: string;
  setSelectedCity: (callback: any) => void;
  selectedDepartment: string;
  setSelectedDepartment: (callback: any) => void;
}

export const LocationInput = (props: Props) => {
  const [geoSearch, setGeoSearch] = useState(false);

  return (
    <div
      className={cls(
        parentStyles.form_block,
        "d-inline-flex align-items-center"
      )}
    >
      <label className={cls(parentStyles.label, "mr-4")}>Ville</label>
      <LocalisationFilter
        setVille={props.setSelectedCity}
        ville={props.selectedCity}
        geoSearch={geoSearch}
        setGeoSearch={setGeoSearch}
        addToQuery={(data) => {
          props.setSelectedCity(data?.loc?.city || "");
          props.setSelectedDepartment(data?.loc?.dep || "");
        }}
        removeFromQuery={() => {
          props.setSelectedCity("");
          props.setSelectedDepartment("");
        }}
        className="p-10"
      ></LocalisationFilter>
    </div>
  );
};
