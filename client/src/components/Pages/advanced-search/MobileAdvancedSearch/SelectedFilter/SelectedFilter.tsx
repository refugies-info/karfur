import React from "react";
import styled from "styled-components";
import Streamline from "assets/streamline";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import { Tag } from "types/interface";
import { AvailableFilters } from "data/searchFilters";

interface SelectedFilterButtonProps {
  color: string
  textColor: string
  textAlign: string
}
const SelectedFilterButton = styled.div`
  align-items: center;
  padding: 16px;
  height: 53px;
  width: 100%;
  align-items: center;
  background-color: ${(props: SelectedFilterButtonProps) => props.color};
  color: ${(props: SelectedFilterButtonProps) => props.textColor};
  text-align: ${(props: SelectedFilterButtonProps) => props.textAlign};
  font-weight: bold;
  border-color: #212121;
  border-radius: 12px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.25);
`;
const FilterButton = styled.div`
  padding: 16px;
  height: 53px;
  width: 100%;
  background-color: ${colors.blancSimple};
  border: 1px solid;
  align-items: center;
  color: ${colors.noir};
  font-weight: bold;
  border-color: ${colors.noir};
  border-radius: 12px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.25);
`;

interface Props {
  tagSelected?: Tag | null;
  otherFilterSelected?: string | null;
  toggleShowModal: (a: AvailableFilters) => void;
  type: AvailableFilters;
  title: string;
  defaultTitle: string;
  setState?: any;
  removeFromQuery: () => void;
}

export const SelectedFilter = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      {props.type === "theme" ? (
        <>
          {props.tagSelected ? (
            <SelectedFilterButton
              color={props.tagSelected.darkColor}
              textColor="white"
              textAlign="left"
              onClick={() => props.toggleShowModal(props.type)}
            >
              {t(
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
            </SelectedFilterButton>
          ) : (
            <>
              <FilterButton onClick={() => props.toggleShowModal(props.type)}>
                {t(props.title, props.defaultTitle)}
                <EVAIcon name="chevron-down" fill="#212121" size="large" />
              </FilterButton>
            </>
          )}
        </>
      ) : (
        <>
          {props.otherFilterSelected ? (
            <SelectedFilterButton
              color={colors.noir}
              textColor="white"
              textAlign="left"
              onClick={() => props.toggleShowModal(props.type)}
            >
              {t(
                "Tags." + props.otherFilterSelected,
                props.otherFilterSelected
              )}
              <div
                onClick={(e: any) => {
                  e.stopPropagation();
                  props.setState(null);
                  props.removeFromQuery();
                }}
              >
                <EVAIcon name="close" fill={colors.blanc} size="large" />
              </div>
            </SelectedFilterButton>
          ) : (
            <>
              <FilterButton onClick={() => props.toggleShowModal(props.type)}>
                {t(props.title, props.defaultTitle)}
                <EVAIcon name="chevron-down" fill={colors.noir} size="large" />
              </FilterButton>
            </>
          )}
        </>
      )}
    </div>
  );
};
