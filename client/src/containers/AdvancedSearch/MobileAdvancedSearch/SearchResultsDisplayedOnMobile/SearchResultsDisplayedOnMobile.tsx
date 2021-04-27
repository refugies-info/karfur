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

export const SearchResultsDisplayedOnMobile = (props: Props) => {
  const totalCountResult: number =
    props.tagSelected && props.ville === ""
      ? props.principalThemeList.length + props.secondaryThemeList.length
      : props.tagSelected && props.ville !== ""
      ? props.principalThemeList.length +
        props.secondaryThemeList.length +
        props.principalThemeListFullFrance.length +
        props.secondaryThemeListFullFrance.length
      : 0;
  return (
    <div>
      <TotalCountTitle>
        {" "}
        {totalCountResult +
          "/" +
          props.totalFicheCount +
          " " +
          props.t("AdvancedSearch.résultats", "résultats")}
      </TotalCountTitle>
      {props.principalThemeList &&
        props.principalThemeList.map((item: any, index: number) => {
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
      {props.secondaryThemeList &&
        props.secondaryThemeList.map((item: any, index: number) => {
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
    </div>
  );
};
