import React from "react";
import { useTranslation } from "next-i18next";
import { Tag, IDispositif } from "types/interface";
import { FicheOnMobile } from "./FicheOnMobile/FicheOnMobile";
import { LoadingFicheOnMobile } from "./LoadingFicheOnMobile";
import NoResultPlaceholder from "components/Pages/advanced-search/NoResultPlaceholder";
import { useRouter } from "next/router";
import { getPath } from "routes";
import styles from "./SearchResultsDisplayedOnMobile.module.scss";

interface Props {
  tagSelected: null | Tag;
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
}


export const SearchResultsDisplayedOnMobile = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

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
        <NoResultPlaceholder restart={() => router.push(getPath("/recherche", router.locale))} />
      )}

      {props.tagSelected && props.ville === "" ? ( // 1. Tag selected and no location
        <>
          {props.principalThemeList.map((item: IDispositif, index: number) => {
            return ( // all dispositif about this tag as primary tag
              <FicheOnMobile
                key={index}
                dispositif={item}
              />
            );
          })}
          {props.secondaryThemeList
            .concat(props.secondaryThemeListFullFrance)
            .map((item: IDispositif, index: number) => {
              return ( // all dispositif about this tag as secondary tag
                <FicheOnMobile
                  key={index}
                  dispositif={item}
                />
              );
            })}
        </>
      ) : props.tagSelected && props.ville !== "" ? ( // 2. Tag and location selected
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
              return ( // all dispositif about this tag as primary or secondary tag and this location
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
              return ( // all dispositif about this tag as primary or secondary tag and all France as location
                <FicheOnMobile
                  dispositif={item}
                  key={index}
                />
              );
            })}
        </>
      ) : ( // 3. All others filters selected but not Tag
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
