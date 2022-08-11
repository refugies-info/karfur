import React, { useState } from "react";
import {
  StyledTitle,
  FigureContainer,
  Content,
  StyledHeaderInner,
} from "../sharedComponents/StyledAdmin";
import { Table } from "reactstrap";
import { TabHeader } from "../sharedComponents/SubComponents";

import { useSelector } from "react-redux";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
import { needsSelector } from "../../../../services/Needs/needs.selectors";
import { Need } from "../../../../types/interface";
import styled from "styled-components";
import { jsUcfirst } from "../../../../lib/index";
import { NeedDetailsModal } from "./NeedDetailsModal";
import FButton from "../../../../components/UI/FButton/FButton";
import { AddNeedModal } from "./AddNeedModal";
import { LoadingNeeds } from "./LoadingNeeds";

export const needsHeaders = [
  { name: "Thème", order: "theme.name.fr" },
  { name: "Besoin", order: "besoin" },
  { name: "", order: "" },
];

const StyledTagName = styled.div`
  font-weight: bold;
  color: white;
`;

const StyledTagContainer = styled.div`
  background-color: ${(props) => props.color};
  padding: 12px;
  width: fit-content;
  border-radius: 12px;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 8px;
  margin-left: 24px;
  justify-content: space-between;
  margin-right: 24px;
`;

const sortNeeds = (
  needs: Need[],
  sortedHeader: { name: string; sens: string; orderColumn: string }
) => {
  return needs
    .sort((a: Need, b: Need) => {
      return a.updatedAt > b.updatedAt ? 1 : -1;
    })
    .sort((a: Need, b: Need) => {
      const valueA =
        sortedHeader.orderColumn === "besoin"
          ? a.fr.text
          : //@ts-ignore
            a[sortedHeader.orderColumn];

      const valueB =
        sortedHeader.orderColumn === "besoin"
          ? b.fr.text
          : //@ts-ignore
            b[sortedHeader.orderColumn];

      const lowerValueA = valueA ? valueA.toLowerCase() : "";
      const valueAWithoutAccent = lowerValueA
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const lowerValueB = valueB ? valueB.toLowerCase() : "";
      const valueBWithoutAccent = lowerValueB
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      if (valueAWithoutAccent > valueBWithoutAccent)
        return sortedHeader.sens === "up" ? 1 : -1;

      return sortedHeader.sens === "up" ? -1 : 1;
    });
};

export const Needs = () => {
  const defaultSortedHeader = {
    name: "Thème",
    sens: "up",
    orderColumn: "theme.name.fr",
  };
  const [sortedHeader, setSortedHeader] = useState(defaultSortedHeader);
  const [selectedNeed, setSelectedNeed] = useState<null | Need>(null);
  const [showNeedDetailModal, setShowNeedDetailModal] = useState(false);
  const [showAddNeedModal, setShowAddNeedModal] = useState(false);

  const setSelectedNeedAndToggleModal = (need: Need) => {
    setSelectedNeed(need);
    setShowNeedDetailModal(true);
  };

  const isLoadingFetch = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_NEEDS)
  );
  const isLoadingSave = useSelector(
    isLoadingSelector(LoadingStatusKey.SAVE_NEED)
  );

  const isLoading = isLoadingFetch || isLoadingSave;

  const needs = useSelector(needsSelector);

  const reorder = (element: { name: string; order: string }) => {
    if (sortedHeader.name === element.name) {
      const sens = sortedHeader.sens === "up" ? "down" : "up";
      setSortedHeader({ name: element.name, sens, orderColumn: element.order });
    } else {
      setSortedHeader({
        name: element.name,
        sens: "up",
        orderColumn: element.order,
      });
    }
  };

  const sortedNeeds = sortNeeds(needs, sortedHeader);
  if (isLoading) {
    return <LoadingNeeds />;
  }
  return (
    <div>
      <StyledHeader>
        <StyledHeaderInner>
          <StyledTitle>Besoins</StyledTitle>
          <FigureContainer>{needs.length}</FigureContainer>
        </StyledHeaderInner>
        <FButton type="dark" onClick={() => setShowAddNeedModal(true)}>
          Ajouter un besoin
        </FButton>
      </StyledHeader>
      <Content>
        <Table responsive borderless>
          <thead>
            <tr>
              {needsHeaders.map((element, key) => (
                <th
                  key={key}
                  onClick={() => {
                    reorder(element);
                  }}
                >
                  <TabHeader
                    name={element.name}
                    order={element.order}
                    isSortedHeader={sortedHeader.name === element.name}
                    sens={
                      sortedHeader.name === element.name
                        ? sortedHeader.sens
                        : "down"
                    }
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedNeeds.map((need, key) => {
              return (
                <tr
                  key={key}
                  onClick={() => setSelectedNeedAndToggleModal(need)}
                >
                  <td className="align-middle" style={{ width: 300 }}>
                    <StyledTagContainer color={need.theme.colors.color100}>
                      <StyledTagName>{jsUcfirst(need.theme.name.fr)}</StyledTagName>
                    </StyledTagContainer>
                  </td>
                  <td className="align-middle">{need.fr.text}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Content>
      <NeedDetailsModal
        show={showNeedDetailModal}
        selectedNeed={selectedNeed}
        toggleModal={() => {
          setSelectedNeed(null);
          setShowNeedDetailModal(!showNeedDetailModal);
        }}
      />

      {showAddNeedModal && (
        <AddNeedModal
          show={showAddNeedModal}
          toggleModal={() => {
            setShowAddNeedModal(!showAddNeedModal);
          }}
        />
      )}
    </div>
  );
};
