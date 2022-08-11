import React from "react";
import { useTranslation } from "next-i18next";
import { IDispositif, Theme } from "types/interface";
import { FicheOnMobile } from "./FicheOnMobile/FicheOnMobile";
import { LoadingFicheOnMobile } from "./LoadingFicheOnMobile";
import NoResultPlaceholder from "components/Pages/advanced-search/NoResultPlaceholder";
import styles from "./SearchResultsDisplayedOnMobile.module.scss";

interface Props {
  themeSelected: null | Theme;
  ville: string;
  principalThemeList: IDispositif[];
  principalThemeListFullFrance: IDispositif[];
  dispositifs: IDispositif[];
  dispositifsFullFrance: IDispositif[];
  secondaryThemeList: IDispositif[];
  secondaryThemeListFullFrance: IDispositif[];
  totalFicheCount: number;
  nbFilteredResults: number;
  isLoading: boolean;
  restart: () => void
}


export const SearchResultsDisplayedOnMobile = (props: Props) => {
  const { t } = useTranslation();

  if (props.isLoading) {
    return (
      <div>
        <p className={styles.count}>
          {". sur . " + t("AdvancedSearch.résultats", "résultats")}
        </p>
        <LoadingFicheOnMobile />
      </div>
    );
  }
  return (
    <div>
      <p className={styles.count}>
        {`${props.nbFilteredResults} sur ${props.totalFicheCount} ${t("AdvancedSearch.résultats", "résultats")}`}
      </p>

      {props.nbFilteredResults === 0 && props.ville === "" && (
        <NoResultPlaceholder restart={props.restart} />
      )}

      {props.themeSelected && props.ville === "" ? ( // 1. Theme selected and no location
        <>
          {props.principalThemeList.map((item: IDispositif, index: number) => {
            return ( // all dispositif about this theme as primary theme
              <FicheOnMobile
                key={index}
                dispositif={item}
              />
            );
          })}
          {props.secondaryThemeList
            .concat(props.secondaryThemeListFullFrance)
            .map((item: IDispositif, index: number) => {
              return ( // all dispositif about this theme as secondary theme
                <FicheOnMobile
                  key={index}
                  dispositif={item}
                />
              );
            })}
        </>
      ) : props.themeSelected && props.ville !== "" ? ( // 2. Theme and location selected
        <>
          <h5 className={styles.title}>
            {props.nbFilteredResults > 0
              ? t("AdvancedSearch.Fiches pour", "Fiches pour")
              : t("AdvancedSearch.0 fiche pour", "0 fiche pour")}
            <span className={styles.blue}>{" " + props.ville}</span>
          </h5>

          {props.principalThemeList
            .concat(props.secondaryThemeList)
            .map((item: IDispositif, index: number) => {
              return ( // all dispositif about this theme as primary or secondary theme and this location
                <FicheOnMobile
                  key={index}
                  dispositif={item}
                />
              );
            })}
          <h5 className={styles.title}>
            {t("AdvancedSearch.Fiches valables", "Fiches valables")}
            <span className={styles.blue}>
              {" " + t("AdvancedSearch.partout en France", "partout en France")}
            </span>
          </h5>
          {props.principalThemeListFullFrance
            .concat(props.secondaryThemeListFullFrance)
            .map((item: IDispositif, index: number) => {
              return ( // all dispositif about this theme as primary or secondary theme and all France as location
                <FicheOnMobile
                  dispositif={item}
                  key={index}
                />
              );
            })}
        </>
      ) : ( // 3. All others filters selected but not Theme
        <>
          {props.ville !== "" && (
            <h5 className={styles.title}>
              {t("AdvancedSearch.Fiches pour", "Fiches pour")}
              <span className={styles.blue}>{" " + props.ville}</span>
            </h5>
          )}

          {props.dispositifs.map((item: IDispositif, index: number) => {
            return ( // all dispositif about this location
              <FicheOnMobile
                key={index}
                dispositif={item}
              />
            );
          })}
          {props.ville !== "" && (
            <h5 className={styles.title}>
              {t("AdvancedSearch.Fiches valables", "Fiches valables")}
              <span className={styles.blue}>
                {" " + t(
                  "AdvancedSearch.partout en France",
                  "partout en France"
                )}
              </span>
            </h5>
          )}
          {props.dispositifsFullFrance.map(
            (item: IDispositif, index: number) => {
              return ( // all dispositif with all France as location
                <FicheOnMobile
                  key={index}
                  dispositif={item}
                />
              );
            }
          )}
        </>
      )}
    </div>
  );
};
