import React, { memo, useEffect, useState } from "react";
import { cls } from "lib/classname";
import { TypeOptions } from "data/searchFilters";
import { Results } from "pages/recherche";
import DemarcheCard from "../DemarcheCard";
import DispositifCard from "../DispositifCard";
import styles from "./SearchResults.module.scss";
import DemarcheCardTitle from "../DemarcheCardTitle";
import DispositifCardTitle from "../DispositifCardTitle";
import { Theme } from "types/interface";
import SeeMoreButton from "../SeeMoreButton";

interface Props {
  filteredResult: Results;
  selectedType: TypeOptions;
  themesSelected: Theme[];
}

const SearchResults = (props: Props) => {
  const [hideDemarches, setHideDemarches] = useState(false);

  useEffect(() => { // hide after loading for SEO purposes
    setHideDemarches(true)
  }, []);

  const demarches = hideDemarches ? props.filteredResult.demarches.slice(0, 14) : props.filteredResult.demarches;

  return (
    <>
      <div className="position-relative">
        <div className={cls(styles.results, styles.demarches, props.selectedType === "dispositif" && styles.hidden)}>
          <DemarcheCardTitle
            count={props.filteredResult.demarches.length}
            color={props.themesSelected.length === 1 ? props.themesSelected[0].colors.color100 : undefined}
          />
          {demarches.map((d) => (
            <DemarcheCard key={d._id.toString()} demarche={d} />
          ))}
        </div>
        <SeeMoreButton
          onClick={() => setHideDemarches(h => !h)}
          visible={!hideDemarches}
        />
      </div>
      <div className={cls(styles.results, styles.dispositifs, props.selectedType === "demarche" && styles.hidden)}>
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
