import React, { memo, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { cls } from "lib/classname";
import useWindowSize from "hooks/useWindowSize";
import {
  searchQuerySelector,
  searchResultsSelector,
  themesDisplayedSelector
} from "services/SearchResults/searchResults.selector";
import { resetQueryActionCreator } from "services/SearchResults/searchResults.actions";
import FButton from "components/UI/FButton";
import DemarcheCard from "components/UI/DemarcheCard";
import DispositifCard from "components/UI/DispositifCard";
import DemarcheCardTitle from "../DemarcheCardTitle";
import DispositifCardTitle from "../DispositifCardTitle";
import NotDeployedBanner from "../NotDeployedBanner";
import SeeMoreButton from "../SeeMoreButton";
import noResultsImage from "assets/no_results_alt.svg";
import styles from "./SearchResults.module.scss";

export const MAX_SHOWN_DEMARCHES = 14;
export const MAX_SHOWN_DISPOSITIFS = 15;
const HIDDEN_DEPS_KEY = "hideBannerDepartments";

interface Props {
  departmentsNotDeployed: string[];
  targetBlank?: boolean;
}

const SearchResults = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const filteredResult = useSelector(searchResultsSelector);
  const themesSelected = useSelector(themesDisplayedSelector);

  const [hideDemarches, setHideDemarches] = useState(true);
  const [hideDispositifs, setHideDispositifs] = useState(true);
  const [hideSecondaryDispositifs, setHideSecondaryDispositifs] = useState(true);

  const [departmentsMessageHidden, setDepartmentsMessageHidden] = useState<string[]>([]);

  useEffect(() => {
    const savedDepartments = localStorage.getItem(HIDDEN_DEPS_KEY);
    if (savedDepartments) setDepartmentsMessageHidden(JSON.parse(savedDepartments));
  }, []);

  const { isMobile } = useWindowSize();

  const demarches =
    hideDemarches && !isMobile ? filteredResult.demarches.slice(0, MAX_SHOWN_DEMARCHES) : filteredResult.demarches;
  const dispositifs =
    hideDispositifs && !isMobile
      ? filteredResult.dispositifs.slice(0, MAX_SHOWN_DISPOSITIFS)
      : filteredResult.dispositifs;
  const secondaryDispositifs =
    hideSecondaryDispositifs && !isMobile
      ? filteredResult.dispositifsSecondaryTheme.slice(0, MAX_SHOWN_DISPOSITIFS)
      : filteredResult.dispositifsSecondaryTheme;

  const selectedDepartment = query.departments.length === 1 ? query.departments[0] : undefined;
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
        <h2>{t("Recherche.noResultTitle", "Oups, aucun résultat")}</h2>
        <p>{t("Recherche.noResultText", "Utilisez moins de filtres ou vérifiez l’orthographe du mot-clé.")}</p>

        <FButton type="login" name="refresh-outline" onClick={() => dispatch(resetQueryActionCreator())}>
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
          <div className={cls(styles.title, query.type === "dispositif" && styles.hidden)}>
            <h2>{t("Recherche.demarcheTitle", "Les fiches démarches")}</h2>
            <span>{filteredResult.demarches.length}</span>
          </div>
          <div
            className={cls(
              styles.results,
              styles.demarches,
              query.type !== "demarche" && styles.horizontal_scroll,
              query.type === "dispositif" && styles.hidden,
              !hideDemarches && styles.all_visible
            )}
          >
            <DemarcheCardTitle
              count={filteredResult.demarches.length}
              color={themesSelected.length === 1 ? themesSelected[0].colors.color100 : undefined}
            />
            {demarches.map((d) =>
              typeof d === "string" ? null : ( // d can be a string if it comes from generateLightResults
                <DemarcheCard key={d._id.toString()} demarche={d} targetBlank />
              )
            )}
          </div>
          {!isMobile && query.type !== "dispositif" && filteredResult.demarches.length >= MAX_SHOWN_DEMARCHES && (
            <SeeMoreButton onClick={() => setHideDemarches((h) => !h)} visible={!hideDemarches} />
          )}
        </div>
      )}

      {/* dispositifs */}
      {dispositifs.length > 0 && (
        <div className={styles.section}>
          <div className={cls(styles.title, query.type === "demarche" && styles.hidden)}>
            <h2>{t("Recherche.dispositifTitle", "Les fiches dispositifs")}</h2>
            <span>{filteredResult.dispositifs.length}</span>
          </div>
          <div
            className={cls(
              styles.results,
              styles.dispositifs,
              query.type === "demarche" && styles.hidden,
              !hideDispositifs && styles.all_visible
            )}
          >
            <DispositifCardTitle
              count={filteredResult.dispositifs.length}
              color={themesSelected.length === 1 ? themesSelected[0].colors.color100 : undefined}
            />
            {dispositifs.map((d) =>
              typeof d === "string" ? null : (
                <DispositifCard
                  key={d._id.toString()}
                  dispositif={d}
                  selectedDepartment={selectedDepartment}
                  targetBlank
                />
              )
            )}
          </div>
          {!isMobile && query.type !== "demarche" && filteredResult.dispositifs.length >= MAX_SHOWN_DISPOSITIFS && (
            <SeeMoreButton onClick={() => setHideDispositifs((h) => !h)} visible={!hideDispositifs} />
          )}
        </div>
      )}

      {/* other dispositifs */}
      {secondaryDispositifs.length > 0 && (
        <div className={styles.section}>
          <div className={cls(styles.title, query.type === "demarche" && styles.hidden)}>
            <h2>{t("Recherche.otherDispositifTitle", "Autres fiches avec ce thème")}</h2>
            <span>{filteredResult.dispositifsSecondaryTheme.length}</span>
          </div>
          <div
            className={cls(
              styles.results,
              styles.dispositifs,
              query.type === "demarche" && styles.hidden,
              !hideSecondaryDispositifs && styles.all_visible
            )}
          >
            <DispositifCardTitle
              count={filteredResult.dispositifsSecondaryTheme.length}
              color={themesSelected.length === 1 ? themesSelected[0].colors.color100 : undefined}
              themes={themesSelected}
            />
            {secondaryDispositifs.map((d) =>
              typeof d === "string" ? null : <DispositifCard key={d._id.toString()} dispositif={d} targetBlank />
            )}
          </div>
          {!isMobile &&
            query.type !== "demarche" &&
            filteredResult.dispositifsSecondaryTheme.length >= MAX_SHOWN_DISPOSITIFS && (
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
