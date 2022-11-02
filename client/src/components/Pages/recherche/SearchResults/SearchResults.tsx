import React, { memo, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
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
import useWindowSize from "hooks/useWindowSize";

const MAX_SHOWN_DEMARCHES = 14;
const MAX_SHOWN_DISPOSITIFS = 15;
const HIDDEN_DEPS_KEY = "hideBannerDepartments";

interface Props {
  filteredResult: Results;
  selectedType: TypeOptions;
  themesSelected: Theme[];
  departmentsSelected: string[];
  departmentsNotDeployed: string[];
  targetBlank?: boolean;
  resetFilters: () => void;
}

const SearchResults = (props: Props) => {
  const { t } = useTranslation();
  const [hideDemarches, setHideDemarches] = useState(true);
  const [hideDispositifs, setHideDispositifs] = useState(true);
  const [hideSecondaryDispositifs, setHideSecondaryDispositifs] = useState(true);

  const [departmentsMessageHidden, setDepartmentsMessageHidden] = useState<string[]>([]);

  useEffect(() => {
    // BAD PERFORMANCES
    // // hide after loading for SEO purposes
    // setHideDemarches(true);
    // setHideDispositifs(true);
    // setHideSecondaryDispositifs(true);

    const savedDepartments = localStorage.getItem(HIDDEN_DEPS_KEY);
    if (savedDepartments) setDepartmentsMessageHidden(JSON.parse(savedDepartments));
  }, []);

  const { isMobile } = useWindowSize();

  const demarches =
    hideDemarches && !isMobile
      ? props.filteredResult.demarches.slice(0, MAX_SHOWN_DEMARCHES)
      : props.filteredResult.demarches;
  const dispositifs =
    hideDispositifs && !isMobile
      ? props.filteredResult.dispositifs.slice(0, MAX_SHOWN_DISPOSITIFS)
      : props.filteredResult.dispositifs;
  const secondaryDispositifs =
    hideSecondaryDispositifs && !isMobile
      ? props.filteredResult.dispositifsSecondaryTheme.slice(0, MAX_SHOWN_DISPOSITIFS)
      : props.filteredResult.dispositifsSecondaryTheme;

  const selectedDepartment = props.departmentsSelected.length === 1 ? props.departmentsSelected[0] : undefined;
  const noResults = demarches.length === 0 && dispositifs.length === 0 && secondaryDispositifs.length === 0;

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
        <h5>
          {t("Recherche.noResultTitle", "Oups, aucun résultat")}
        </h5>
        <p>
          {t("Recherche.noResultText", "Utilisez moins de filtres ou vérifiez l’orthographe du mot-clé.")}
        </p>

        <FButton type="login" name="refresh-outline" onClick={props.resetFilters}>
          {t("Recherche.resetFilters", "Effacer tous les filtres")}
        </FButton>

        <div className={styles.image}>
          <Image src={noResultsImage} width={420} height={280} alt="No results" />
        </div>
      </div>
    );
  }

  return (
    <>
      {isBannerVisible && <NotDeployedBanner departments={props.departmentsNotDeployed} hideBanner={hideBanner} />}

      {/* demarches */}
      {demarches.length > 0 && (
        <div className={styles.section}>
          <div className={cls(styles.title, props.selectedType === "dispositif" && styles.hidden)}>
            <h2>{t("Recherche.demarcheTitle", "Les fiches démarches")}</h2>
            <span>{props.filteredResult.demarches.length}</span>
          </div>
          <div
            className={cls(
              styles.results,
              styles.demarches,
              props.selectedType !== "demarche" && styles.horizontal_scroll,
              props.selectedType === "dispositif" && styles.hidden,
              !hideDemarches && styles.all_visible
            )}
          >
            <DemarcheCardTitle
              count={props.filteredResult.demarches.length}
              color={props.themesSelected.length === 1 ? props.themesSelected[0].colors.color100 : undefined}
            />
            {demarches.map((d) => (
              <DemarcheCard key={d._id.toString()} demarche={d} targetBlank />
            ))}
          </div>
          {!isMobile &&
            props.selectedType !== "dispositif" &&
            props.filteredResult.demarches.length >= MAX_SHOWN_DEMARCHES && (
              <SeeMoreButton onClick={() => setHideDemarches((h) => !h)} visible={!hideDemarches} />
            )}
        </div>
      )}

      {/* dispositifs */}
      {dispositifs.length > 0 && (
        <div className={styles.section}>
          <div className={cls(styles.title, props.selectedType === "demarche" && styles.hidden)}>
            <h2>{t("Recherche.dispositifTitle", "Les fiches dispositifs")}</h2>
            <span>{props.filteredResult.dispositifs.length}</span>
          </div>
          <div className={cls(
            styles.results,
            styles.dispositifs,
            props.selectedType === "demarche" && styles.hidden,
            !hideDispositifs && styles.all_visible
          )}>
            <DispositifCardTitle
              count={props.filteredResult.dispositifs.length}
              color={props.themesSelected.length === 1 ? props.themesSelected[0].colors.color100 : undefined}
            />
            {dispositifs.map((d) => (
              <DispositifCard key={d._id.toString()} dispositif={d} selectedDepartment={selectedDepartment} targetBlank />
            ))}
          </div>
          {!isMobile &&
            props.selectedType !== "demarche" &&
            props.filteredResult.dispositifs.length >= MAX_SHOWN_DISPOSITIFS && (
              <SeeMoreButton onClick={() => setHideDispositifs((h) => !h)} visible={!hideDispositifs} />
            )}
        </div>
      )}

      {/* other dispositifs */}
      {secondaryDispositifs.length > 0 && (
        <div className={styles.section}>
          <div className={cls(styles.title, props.selectedType === "demarche" && styles.hidden)}>
            <h2>{t("Recherche.otherDispositifTitle", "Autres fiches avec ce thème")}</h2>
            <span>{props.filteredResult.dispositifsSecondaryTheme.length}</span>
          </div>
          <div className={cls(
            styles.results,
            styles.dispositifs,
            props.selectedType === "demarche" && styles.hidden,
            !hideSecondaryDispositifs && styles.all_visible
          )}>
            <DispositifCardTitle
              count={props.filteredResult.dispositifsSecondaryTheme.length}
              color={props.themesSelected.length === 1 ? props.themesSelected[0].colors.color100 : undefined}
              themes={props.themesSelected}
            />
            {secondaryDispositifs.map((d) => (
              <DispositifCard key={d._id.toString()} dispositif={d} targetBlank />
            ))}
          </div>
          {!isMobile &&
            props.selectedType !== "demarche" &&
            props.filteredResult.dispositifsSecondaryTheme.length >= MAX_SHOWN_DISPOSITIFS && (
              <SeeMoreButton
                onClick={() => setHideSecondaryDispositifs((h) => !h)}
                visible={!hideSecondaryDispositifs}
              />
            )}
        </div>
      )}
    </>
  );
};

export default memo(SearchResults);
