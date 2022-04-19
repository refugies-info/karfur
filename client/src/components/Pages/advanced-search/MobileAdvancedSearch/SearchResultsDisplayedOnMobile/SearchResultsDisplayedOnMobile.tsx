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
const TotalCountTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  margin: 13px;
  color: ${colors.gray70};
`;

const AProposTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: ${colors.gray70};
  margin-top: 25px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  align-items: center;
  line-height: 35px;
`;

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
const City = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  color: ${colors.bleuCharte};
`;

export const SearchResultsDisplayedOnMobile = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  if (props.isLoading) {
    return (
      <div>
        <TotalCountTitle>
          {". sur . " + t("AdvancedSearch.résultats", "résultats")}
        </TotalCountTitle>
        <LoadingFicheOnMobile />
      </div>
    );
  }
  return (
    <div>
      <TotalCountTitle>
        {" "}
        {props.nbFilteredResults +
          " sur " +
          props.totalFicheCount +
          " " +
          t("AdvancedSearch.résultats", "résultats")}
      </TotalCountTitle>

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
          <AProposTitle>
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
          </AProposTitle>
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
          <AProposTitle>
            {props.nbFilteredResults > 0
              ? t("AdvancedSearch.Fiches pour", "Fiches pour")
              : t("AdvancedSearch.0 fiche pour", "0 fiche pour")}

            <City>{" " + props.ville}</City>
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
          </AProposTitle>

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
          <AProposTitle>
            {t("AdvancedSearch.Fiches valables", "Fiches valables")}
            <City>
              {t("AdvancedSearch.partout en France", "partout en France")}
            </City>
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
          </AProposTitle>
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
            <AProposTitle>
              {t("AdvancedSearch.Fiches pour", "Fiches pour")}
              <City>{" " + props.ville}</City>
            </AProposTitle>
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
            <AProposTitle>
              {t("AdvancedSearch.Fiches valables", "Fiches valables")}
              <City>
                {t(
                  "AdvancedSearch.partout en France",
                  "partout en France"
                )}
              </City>
            </AProposTitle>
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
