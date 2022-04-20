import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { Tag, IDispositif } from "types/interface";
import { FicheOnMobile } from "./FicheOnMobile/FicheOnMobile";
import { colors } from "colors";
import Streamline from "assets/streamline";
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



const Title = styled.div`
  margin-right: 10px;
  font-size: 18px;
  font-weight: bold;
`;

const TagSelected = styled.div`
  height: 50px;
  background-color: ${(props) => props.color};
  color: white;
  width: -webkit-fit-content;
  padding: 13.5px;
  border-radius: 12px;
  margin: 13px 8px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

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

      {props.tagSelected && props.ville === "" ? (
        //Tag selected and no location
        <>
          {props.principalThemeList.map((item: IDispositif, index: number) => {
            //Display all dispositif about this tag as primary tag
            return (
              <FicheOnMobile
                key={index}
                dispositif={item}
              />
            );
          })}
          <h5 className={styles.title}>
            {t(
              "AdvancedSearch.Fiches aussi à propos de",
              "Fiches aussi à propos de"
            )}
            <TagSelected color={props.tagSelected.darkColor}>
              {props.tagSelected && (
                <>
                  <Title>
                    {t(
                      "Tags." + props.tagSelected.short,
                      props.tagSelected.name
                    )}
                  </Title>
                  {props.tagSelected.icon ? (
                    <Streamline
                      name={props.tagSelected.icon}
                      stroke={"white"}
                      width={22}
                      height={22}
                    />
                  ) : null}
                </>
              )}
            </TagSelected>
          </h5>
          {props.secondaryThemeList
            .concat(props.secondaryThemeListFullFrance)
            .map((item: IDispositif, index: number) => {
              //Display all dispositif about this tag as secondary tag
              return (
                <FicheOnMobile
                  key={index}
                  dispositif={item}
                />
              );
            })}
        </>
      ) : props.tagSelected && props.ville !== "" ? (
        //Tag and location selected
        <>
          <h5 className={styles.title}>
            {props.nbFilteredResults > 0
              ? t("AdvancedSearch.Fiches pour", "Fiches pour")
              : t("AdvancedSearch.0 fiche pour", "0 fiche pour")}

            <span className={styles.blue}>{" " + props.ville}</span>
            {t("AdvancedSearch.avec le thème", "avec le thème")}
            <TagSelected color={props.tagSelected.darkColor}>
              {props.tagSelected && (
                <>
                  <Title>
                    {t(
                      "Tags." + props.tagSelected.short,
                      props.tagSelected.name
                    )}
                  </Title>
                  {props.tagSelected.icon ? (
                    <Streamline
                      name={props.tagSelected.icon}
                      stroke={"white"}
                      width={22}
                      height={22}
                    />
                  ) : null}
                </>
              )}
            </TagSelected>
          </h5>

          {props.principalThemeList
            .concat(props.secondaryThemeList)
            .map((item: IDispositif, index: number) => {
              return (
                //Display all dispositif about this tag as primary or secondary tag and this location

                <FicheOnMobile
                  key={index}
                  dispositif={item}
                />
              );
            })}
          <h5 className={styles.title}>
            {t("AdvancedSearch.Fiches valables", "Fiches valables")}
            <span className={styles.blue}>
              {t("AdvancedSearch.partout en France", "partout en France")}
            </span>
            {t("AdvancedSearch.avec le thème", "avec le thème")}

            <TagSelected color={props.tagSelected.darkColor}>
              {props.tagSelected && (
                <>
                  <Title>
                    {t(
                      "Tags." + props.tagSelected.short,
                      props.tagSelected.name
                    )}
                  </Title>
                  {props.tagSelected.icon ? (
                    <Streamline
                      name={props.tagSelected.icon}
                      stroke={"white"}
                      width={22}
                      height={22}
                    />
                  ) : null}
                </>
              )}
            </TagSelected>
          </h5>
          {props.principalThemeListFullFrance
            .concat(props.secondaryThemeListFullFrance)
            .map((item: IDispositif, index: number) => {
              return (
                //Display all dispositif about this tag as primary or secondary tag and all France as location

                <FicheOnMobile
                  dispositif={item}
                  key={index}
                />
              );
            })}
        </>
      ) : (
        //All others filters selected but not Tag
        <>
          {props.ville !== "" && (
            <h5 className={styles.title}>
              {t("AdvancedSearch.Fiches pour", "Fiches pour")}
              <span className={styles.blue}>{" " + props.ville}</span>
            </h5>
          )}

          {props.dispositifs.map((item: IDispositif, index: number) => {
            return (
              //Display all dispositif about this location
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
                {t(
                  "AdvancedSearch.partout en France",
                  "partout en France"
                )}
              </span>
            </h5>
          )}
          {props.dispositifsFullFrance.map(
            (item: IDispositif, index: number) => {
              return (
                //Display all dispositif with all France as location

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
