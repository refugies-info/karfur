import React from "react";
import { Tag, IDispositif } from "../../../../types/interface";
import styled from "styled-components";
import { FicheOnMobile } from "./FicheOnMobile/FicheOnMobile";
import { colors } from "../../../../colors";
import Streamline from "assets/streamline";
import { NavLink } from "react-router-dom";

interface Props {
  tagSelected: null | Tag;
  ageSelected: { name: string } | null;
  frenchSelected: { name: string } | null;
  ville: string;
  principalThemeList: IDispositif[];
  principalThemeListFullFrance: IDispositif[];
  dispositifs: IDispositif[];
  dispositifsFullFrance: IDispositif[];
  secondaryThemeList: IDispositif[];
  secondaryThemeListFullFrance: IDispositif[];
  totalFicheCount: number;
  t: (a: string, b: string) => void;
  nbFilteredResults: number;
}
const TotalCountTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  margin: 13px;
  color: ${colors.grisFonce};
`;

const AProposTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: ${colors.grisFonce};
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

export const SearchResultsDisplayedOnMobile = (props: Props) => (
  <div>
    <TotalCountTitle>
      {" "}
      {props.nbFilteredResults +
        " sur " +
        props.totalFicheCount +
        " " +
        props.t("AdvancedSearch.résultats", "résultats")}
    </TotalCountTitle>
    {props.tagSelected && props.ville === "" ? (
      //Tag selected and no location
      <>
        {props.principalThemeList
          .concat(props.principalThemeListFullFrance)
          .map((item: IDispositif, index: number) => {
            //Display all dispositif about this tag as primary tag
            return (
              <NavLink key={index} to={"/" + item.typeContenu + "/" + item._id}>
                <FicheOnMobile item={item} t={props.t} />
              </NavLink>
            );
          })}
        <AProposTitle>
          {props.t(
            "AdvancedSearch.Fiches aussi à propos de",
            "Fiches aussi à propos de"
          )}
          <TagSelected color={props.tagSelected.darkColor}>
            {props.tagSelected && (
              <>
                <Title>
                  {props.t(
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
                    marginLeft={10}
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
              <NavLink key={index} to={"/" + item.typeContenu + "/" + item._id}>
                <FicheOnMobile item={item} t={props.t} />
              </NavLink>
            );
          })}
      </>
    ) : props.tagSelected && props.ville !== "" ? (
      //Tag and location selected
      <>
        <AProposTitle>
          {props.nbFilteredResults > 0
            ? props.t("AdvancedSearch.Fiches pour", "Fiches pour")
            : props.t("AdvancedSearch.0 fiches pour", "0 fiches pour")}
          <City>{" " + props.ville}</City>
          {props.t("AdvancedSearch.avec le thème", "avec le thème")}
          <TagSelected color={props.tagSelected.darkColor}>
            {props.tagSelected && (
              <>
                <Title>
                  {props.t(
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
                    marginLeft={10}
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
              <NavLink key={index} to={"/" + item.typeContenu + "/" + item._id}>
                <FicheOnMobile item={item} t={props.t} />
              </NavLink>
            );
          })}
        <AProposTitle>
          {props.t("AdvancedSearch.Fiches valables", "Fiches valables")}
          <City>
            {props.t("AdvancedSearch.partout en France", "partout en France")}
          </City>
          {props.t("AdvancedSearch.avec le thème", "avec le thème")}

          <TagSelected color={props.tagSelected.darkColor}>
            {props.tagSelected && (
              <>
                <Title>
                  {props.t(
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
                    marginLeft={10}
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
              <NavLink key={index} to={"/" + item.typeContenu + "/" + item._id}>
                <FicheOnMobile item={item} t={props.t} />
              </NavLink>
            );
          })}
      </>
    ) : (
      //All others filters selected but not Tag
      <>
        {props.ville !== "" && (
          <AProposTitle>
            {props.t("AdvancedSearch.Fiches pour", "Fiches pour")}
            <City>{" " + props.ville}</City>
          </AProposTitle>
        )}

        {props.dispositifs.map((item: IDispositif, index: number) => {
          return (
            //Display all dispositif about this location
            <NavLink key={index} to={"/" + item.typeContenu + "/" + item._id}>
              <FicheOnMobile item={item} t={props.t} />
            </NavLink>
          );
        })}
        {props.ville !== "" && (
          <AProposTitle>
            {props.t("AdvancedSearch.Fiches valables", "Fiches valables")}
            <City>
              {props.t("AdvancedSearch.partout en France", "partout en France")}
            </City>
          </AProposTitle>
        )}
        {props.dispositifsFullFrance.map((item: IDispositif, index: number) => {
          return (
            //Display all dispositif with all France as location
            <NavLink key={index} to={"/" + item.typeContenu + "/" + item._id}>
              <FicheOnMobile item={item} t={props.t} />
            </NavLink>
          );
        })}
      </>
    )}
  </div>
);
