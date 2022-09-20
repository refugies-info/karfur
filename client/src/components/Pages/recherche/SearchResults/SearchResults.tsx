import React, { memo } from "react";
import { cls } from "lib/classname";
import { TypeOptions } from "data/searchFilters";
import { Results } from "pages/recherche";
import DemarcheCard from "../DemarcheCard";
import DispositifCard from "../DispositifCard";
import styles from "./SearchResults.module.scss";
import DemarcheCardTitle from "../DemarcheCardTitle";
import DispositifCardTitle from "../DispositifCardTitle";
import { Theme } from "types/interface";

interface Props {
  filteredResult: Results;
  selectedType: TypeOptions;
  themesSelected: Theme[];
}

const SearchResults = (props: Props) => {
  return (
    <>
      <div className={cls("d-flex flex-wrap", props.selectedType === "dispositif" && styles.hidden)}>
        <DemarcheCardTitle
          count={props.filteredResult.demarches.length}
          color={props.themesSelected.length === 1 ? props.themesSelected[0].colors.color100 : undefined}
        />
        {props.filteredResult.demarches.map((d) => (
          <DemarcheCard key={d._id.toString()} demarche={d} />
        ))}
      </div>
      <div className={cls("d-flex flex-wrap", props.selectedType === "demarche" && styles.hidden)}>
        <DispositifCardTitle
          count={props.filteredResult.dispositifs.length}
          color={props.themesSelected.length === 1 ? props.themesSelected[0].colors.color100 : undefined}
        />
        {props.filteredResult.dispositifs.map((d) => (
          <DispositifCard key={d._id.toString()} dispositif={d} />
        ))}
      </div>
    </>
  );
};

export default memo(SearchResults);
