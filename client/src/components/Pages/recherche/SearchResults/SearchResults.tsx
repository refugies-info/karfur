import React, { memo, useEffect, useState } from "react";
import Image from "next/image";
import { Theme } from "types/interface";
import { cls } from "lib/classname";
import { TypeOptions } from "data/searchFilters";
import { Results } from "pages/recherche";
import FButton from "components/UI/FButton";
import DemarcheCard from "../DemarcheCard";
import DispositifCard from "../DispositifCard";
import DemarcheCardTitle from "../DemarcheCardTitle";
import DispositifCardTitle from "../DispositifCardTitle";
import NotDeployedBanner from "../NotDeployedBanner";
import SeeMoreButton from "../SeeMoreButton";
import noResultsImage from "assets/no_results_alt.svg";
import styles from "./SearchResults.module.scss";

const MAX_SHOWN_ITEMS = 14;
const HIDDEN_DEPS_KEY = "hideBannerDepartments";

interface Props {
  filteredResult: Results;
  selectedType: TypeOptions;
  themesSelected: Theme[];
  departmentsSelected: string[];
  departmentsNotDeployed: string[];
  resetFilters: () => void;
}

const SearchResults = (props: Props) => {
  const [hideDemarches, setHideDemarches] = useState(false);
  const [hideDispositifs, setHideDispositifs] = useState(false);

  const [departmentsMessageHidden, setDepartmentsMessageHidden] = useState<string[]>([]);

  useEffect(() => {
    // hide after loading for SEO purposes
    setHideDemarches(true);
    setHideDispositifs(true);

    const savedDepartments = localStorage.getItem(HIDDEN_DEPS_KEY);
    if (savedDepartments) setDepartmentsMessageHidden(JSON.parse(savedDepartments));
  }, []);

  const demarches = hideDemarches
    ? props.filteredResult.demarches.slice(0, MAX_SHOWN_ITEMS) /* TODO: show all in mobile */
    : props.filteredResult.demarches;
  const dispositifs = hideDispositifs
    ? props.filteredResult.dispositifs.slice(0, MAX_SHOWN_ITEMS) /* TODO: show all in mobile */
    : props.filteredResult.dispositifs;

  const selectedDepartment = props.departmentsSelected.length === 1 ? props.departmentsSelected[0] : undefined;
  const noResults =
    demarches.length === 0 &&
    dispositifs.length === 0 &&
    props.filteredResult.dispositifsSecondaryTheme.length === 0;

  // Banner
  const hideBanner = () => {
    localStorage.setItem(HIDDEN_DEPS_KEY, JSON.stringify(props.departmentsNotDeployed));
    setDepartmentsMessageHidden(props.departmentsNotDeployed);
  };
  const isBannerVisible =
    props.departmentsNotDeployed.length > 0 &&
    props.departmentsNotDeployed.find((dep) => !departmentsMessageHidden.includes(dep));

  if (noResults) {
    return (
      <div className={styles.no_results}>
        <h5>Oups, aucun résultat</h5>
        <p>Utilisez moins de filtres ou vérifiez l’orthographe du mot-clé.</p>

        <FButton type="login" name="refresh-outline" onClick={props.resetFilters}>Effacer tous les filtres</FButton>

        <div className={styles.image}>
          <Image src={noResultsImage} width={420} height={280} alt="No results" />
        </div>
      </div>
    );
  }
  return (
    <>
      {isBannerVisible && <NotDeployedBanner departments={props.departmentsNotDeployed} hideBanner={hideBanner} />}
      {demarches.length > 0 && (
        <div className="position-relative">
          <div className={cls(styles.results, styles.demarches, props.selectedType === "dispositif" && styles.hidden)}>
            {/* TODO: title for mobile */}
            <DemarcheCardTitle
              count={props.filteredResult.demarches.length}
              color={props.themesSelected.length === 1 ? props.themesSelected[0].colors.color100 : undefined}
            />
            {demarches.map((d) => (
              <DemarcheCard key={d._id.toString()} demarche={d} />
            ))}
          </div>
          {props.selectedType !== "dispositif" && props.filteredResult.demarches.length >= MAX_SHOWN_ITEMS && (
            <SeeMoreButton onClick={() => setHideDemarches((h) => !h)} visible={!hideDemarches} />
          )}
        </div>
      )}
      {dispositifs.length > 0 && (
        <div className="position-relative">
          <div className={cls(styles.results, styles.dispositifs, props.selectedType === "demarche" && styles.hidden)}>
            {/* TODO: title for mobile */}
            <DispositifCardTitle
              count={props.filteredResult.dispositifs.length}
              color={props.themesSelected.length === 1 ? props.themesSelected[0].colors.color100 : undefined}
            />
            {dispositifs.map((d) => (
              <DispositifCard key={d._id.toString()} dispositif={d} selectedDepartment={selectedDepartment} />
            ))}
          </div>
          {props.filteredResult.dispositifs.length >= MAX_SHOWN_ITEMS && (
            <SeeMoreButton onClick={() => setHideDispositifs((h) => !h)} visible={!hideDispositifs} />
          )}
        </div>
      )}

      {props.filteredResult.dispositifsSecondaryTheme.length > 0 && (
        <div className={cls(styles.results, styles.dispositifs, props.selectedType === "demarche" && styles.hidden)}>
          {/* TODO: title for mobile */}
          <DispositifCardTitle
            count={props.filteredResult.dispositifsSecondaryTheme.length}
            color={props.themesSelected.length === 1 ? props.themesSelected[0].colors.color100 : undefined}
            themes={props.themesSelected}
          />
          {props.filteredResult.dispositifsSecondaryTheme.map((d) => (
            <DispositifCard key={d._id.toString()} dispositif={d} />
          ))}
        </div>
      )}
    </>
  );
};

export default memo(SearchResults);
