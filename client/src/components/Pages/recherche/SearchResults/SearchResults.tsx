import React, {memo} from "react";
import { cls } from "lib/classname";
import { TypeOptions } from "data/searchFilters";
import { Results } from "pages/recherche";
import DemarcheCard from "../DemarcheCard";
import DispositifCard from "../DispositifCard";
import styles from "./SearchResults.module.scss";

interface Props {
  filteredResult: Results;
  selectedType: TypeOptions;
}

const SearchResults = (props: Props) => {
  return (
    <>
      <div className={cls("d-flex flex-wrap", props.selectedType === "dispositif" && styles.hidden)}>
        {props.filteredResult.demarches.map((d) => (
          <DemarcheCard key={d._id.toString()} demarche={d} />
        ))}
      </div>
      <div className={cls("d-flex flex-wrap", props.selectedType === "demarche" && styles.hidden)}>
        {props.filteredResult.dispositifs.map((d) => (
          <DispositifCard key={d._id.toString()} dispositif={d} />
        ))}
      </div>
    </>
  );
};

export default memo(SearchResults);
