import React from "react";
import styled from "styled-components";
import Streamline from "../../../../assets/streamline";
import Icon from "react-eva-icons";
import { colors } from "../../../../colors";
import { Tag } from "../../../../types/interface";

interface Props {
  tagSelected?: Tag | null;
  otherFilterSelected?: { name: string } | null;
  toggleShowModal: (a: string) => void;
  t: (a: string, b: string) => void;
  type: string;
  title: string;
  defaultTitle: string;
  setState?: any;
  desactiver: (index: number) => void;
  recherche: string[];
}

export const SelectedFilter = (props: Props) => {
  const SelectedFilter = styled.div`
    align-items: center;
    padding: 16px;
    height: 53px;
    width: 100%;
    background-color: ${(props) => props.color};
    color: ${(props) => props.textColor};
    text-align: ${(props) => props.textAlign};
    font-weight: 700;
    align-items: center;
    border-color: #212121;
    border-radius: 12px;
    padding-top: 12px;
    margin: 5px 0;
    display: flex;
    justify-content: space-between;
  `;
  const FilterButton = styled.div`
    padding: 16px;
    height: 53px;
    width: 100%;
    background-color: ${colors.blancSimple};
    border: 1px solid;
    color: ${colors.noir};
    font-weight: 700;
    border-color: ${colors.noir};
    border-radius: 12px;
    padding-top: 12px;
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
  `;

  const defineIndex = () => {
    let index = -1;
    let el;
    switch (props.type) {
      case "thème":
        el = props.recherche.filter(
          (item: any) => item.queryName === "tags.name"
        )[0];
        index = props.recherche.indexOf(el);
        break;
      case "age":
        el = props.recherche.filter(
          (item: any) => item.queryName === "audienceAge"
        )[0];
        index = props.recherche.indexOf(el);
        break;
      case "french":
        el = props.recherche.filter(
          (item: any) => item.queryName === "niveauFrancais"
        )[0];
        index = props.recherche.indexOf(el);
        break;
      default:
        break;
    }
    return index;
  };
  const index = defineIndex();

  return (
    <div>
      {props.type === "thème" ? (
        <>
          {props.tagSelected ? (
            <SelectedFilter
              color={props.tagSelected.darkColor}
              textColor="white"
              textAlign="left"
              onClick={() => props.toggleShowModal(props.type)}
            >
              {props.t(
                "Tags." + props.tagSelected.name,
                props.tagSelected.name
              )}
              {props.tagSelected.icon ? (
                <Streamline
                  name={props.tagSelected.icon}
                  stroke={"white"}
                  width={22}
                  height={22}
                />
              ) : null}
            </SelectedFilter>
          ) : (
            <>
              <FilterButton onClick={() => props.toggleShowModal(props.type)}>
                {props.t(props.title, props.defaultTitle)}
                <Icon name="chevron-down" fill="#212121" size="large" />
              </FilterButton>
            </>
          )}
        </>
      ) : (
        <>
          {props.otherFilterSelected ? (
            <SelectedFilter
              color={colors.noir}
              textColor="white"
              textAlign="left"
              onClick={() => props.toggleShowModal(props.type)}
            >
              {props.t(
                "Tags." + props.otherFilterSelected.name,
                props.otherFilterSelected.name
              )}
              <div
                onClick={(e: any) => {
                  e.stopPropagation();
                  props.setState(null);
                  props.desactiver(index);
                }}
              >
                <Icon name="close" fill={colors.blanc} size="large" />
              </div>
            </SelectedFilter>
          ) : (
            <>
              <FilterButton onClick={() => props.toggleShowModal(props.type)}>
                {props.t("SearchItem.choisir mon âge", "choisir mon âge")}
                <Icon name="chevron-down" fill={colors.noir} size="large" />
              </FilterButton>
            </>
          )}
        </>
      )}
    </div>
  );
};
