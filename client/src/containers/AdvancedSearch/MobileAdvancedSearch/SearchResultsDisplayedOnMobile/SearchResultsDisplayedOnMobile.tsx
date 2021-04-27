import React from "react";
import { Tag } from "../../../../types/interface";
import styled from "styled-components";
import { DispositifsItem } from "./DispositifsItem/DispositifsItem";
import { colors } from "../../../../colors";
import Streamline from "assets/streamline";

interface Props {
  tagSelected: null | Tag;
  ageSelected: { name: string } | null;
  frenchSelected: { name: string } | null;
  ville: string;
  principalThemeList: string[];
  principalThemeListFullFrance: any;
  dispositifs: string[];
  dispositifsFullFrance: string[];
  secondaryThemeList: string[];
  secondaryThemeListFullFrance: string[];
  totalFicheCount: number;
  t: (a: string, b: string) => void;
  countTotalResult: number;
}
const TotalCountTitle = styled.p`
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  margin: 13px;
  color: ${colors.grisFonce};
`;

const APropostitle = styled.p`
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: ${colors.grisFonce};
  margin-top: 25px;
 display:flex;
 justify-content:center;

  text-align:center;:
`;

const Title = styled.div`
  margin-right: 10px;
`;

const TagSelected = styled.div`
  height: 50px;
  background-color: ${(props) => props.color};
  color: white;
  width: -webkit-fit-content;
  padding: 13.5px;
  border-radius: 12px;
  margin: 13px auto;
  display: flex;
  justify-content: space-around;
`;
const City = styled.div`
  color: ${colors.bleuCharte};
`;

export const SearchResultsDisplayedOnMobile = (props: Props) => {
  return (
    <div>
      <TotalCountTitle>
        {" "}
        {props.countTotalResult +
          "/" +
          props.totalFicheCount +
          " " +
          props.t("AdvancedSearch.résultats", "résultats")}
      </TotalCountTitle>
      {props.tagSelected && props.ville === "" ? (
        //Tag selected and no location
        <>
          {props.principalThemeList
            .concat(props.principalThemeListFullFrance)
            .map((item: any, index: number) => {
              //Display all dispositif about this tag as primary tag
              return (
                <DispositifsItem
                  key={index}
                  item={item}
                  tagSelected={props.tagSelected}
                  t={props.t}
                  type="primary"
                />
              );
            })}
          <APropostitle>
            {props.t(
              "AdvancedSearch.Fiches aussi à propos de",
              "Fiches aussi à propos de"
            )}
          </APropostitle>

          <TagSelected color={props.tagSelected?.darkColor}>
            {props.tagSelected && (
              <>
                <Title>
                  {props.t(
                    "Tags." + props.tagSelected.name,
                    props.tagSelected.name
                  )}
                </Title>
                {props.tagSelected.icon ? (
                  <Streamline
                    name={props.tagSelected.icon}
                    stroke={"white"}
                    width={22}
                    height={22}
                    marginLeft={10}
                  />
                ) : null}
              </>
            )}
          </TagSelected>
          {props.secondaryThemeList
            .concat(props.secondaryThemeListFullFrance)
            .map((item: any, index: number) => {
              //Display all dispositif about this tag as secondary tag
              return (
                <DispositifsItem
                  key={index}
                  item={item}
                  tagSelected={props.tagSelected}
                  t={props.t}
                  type="secondary"
                />
              );
            })}
        </>
      ) : props.tagSelected && props.ville !== "" ? (
        //Tag and location selected
        <>
          <APropostitle>
            {props.t("AdvancedSearch.Fiches pour", "Fiches pour")}
            <City>{" " + props.ville}</City>
          </APropostitle>
          <APropostitle>
            {props.t("AdvancedSearch.avec le thème", "avec le thème")}
          </APropostitle>

          <TagSelected color={props.tagSelected?.darkColor}>
            {props.tagSelected && (
              <>
                <Title>
                  {props.t(
                    "Tags." + props.tagSelected.name,
                    props.tagSelected.name
                  )}
                </Title>
                {props.tagSelected.icon ? (
                  <Streamline
                    name={props.tagSelected.icon}
                    stroke={"white"}
                    width={22}
                    height={22}
                    marginLeft={10}
                  />
                ) : null}
              </>
            )}
          </TagSelected>

          {props.principalThemeList
            .concat(props.secondaryThemeList)
            .map((item: any, index: number) => {
              return (
                //Display all dispositif about this tag as primary or secondary tag and this location
                <DispositifsItem
                  key={index}
                  item={item}
                  tagSelected={props.tagSelected}
                  t={props.t}
                  type="primary"
                />
              );
            })}
          <APropostitle>
            {props.t("AdvancedSearch.Fiches pour", "Fiches pour")}
            <City>{" toute la France"}</City>
          </APropostitle>
          <APropostitle>
            {props.t("AdvancedSearch.avec le thème", "avec le thème")}
          </APropostitle>

          <TagSelected color={props.tagSelected?.darkColor}>
            {props.tagSelected && (
              <>
                <Title>
                  {props.t(
                    "Tags." + props.tagSelected.name,
                    props.tagSelected.name
                  )}
                </Title>
                {props.tagSelected.icon ? (
                  <Streamline
                    name={props.tagSelected.icon}
                    stroke={"white"}
                    width={22}
                    height={22}
                    marginLeft={10}
                  />
                ) : null}
              </>
            )}
          </TagSelected>
          {props.principalThemeListFullFrance
            .concat(props.secondaryThemeListFullFrance)
            .map((item: any, index: number) => {
              return (
                //Display all dispositif about this tag as primary or secondary tag and all France as location
                <DispositifsItem
                  key={index}
                  item={item}
                  tagSelected={props.tagSelected}
                  t={props.t}
                  type="primary"
                />
              );
            })}
        </>
      ) : null}
    </div>
  );
};
