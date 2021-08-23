import React, { useState } from "react";
import {
  StyledHeader,
  StyledTitle,
  FigureContainer,
  Content,
} from "../sharedComponents/StyledAdmin";
import { Table } from "reactstrap";
import { TabHeader } from "../sharedComponents/SubComponents";

import { useSelector } from "react-redux";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
import { needsSelector } from "../../../../services/Needs/needs.selectors";
import { Need } from "../../../../types/interface";
import { filtres } from "../../../Dispositif/data";
import styled from "styled-components";
import { jsUcfirst } from "../../../../lib/index";
import { NeedDetailsModal } from "./NeedDetailsModal";

const needsHeaders = [
  { name: "Thème", order: "tagName" },
  { name: "Besoin", order: "besoin" },
  { name: "", order: "" },
];

const StyledTagName = styled.div`
  font-weight: bold;
  color: ${(props) => props.color};
`;
const sortNeeds = (
  needs: Need[],
  sortedHeader: { name: string; sens: string; orderColumn: string }
) => {
  return needs.sort((a: Need, b: Need) => {
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

const getTagColor = (tagName: string) => {
  const data = filtres.tags.filter((tag) => tag.name === tagName.toLowerCase());

  if (data && data.length > 0) {
    return data[0].darkColor;
  }
  return "#212121";
};

export const Needs = () => {
  const defaultSortedHeader = {
    name: "Thème",
    sens: "up",
    orderColumn: "tagName",
  };
  const [sortedHeader, setSortedHeader] = useState(defaultSortedHeader);
  const [selectedNeed, setSelectedNeed] = useState<null | Need>(null);
  const [showNeedDetailModal, setShowNeedDetailModal] = useState(false);

  const setSelectedNeedAndToggleModal = (need: Need) => {
    setSelectedNeed(need);
    setShowNeedDetailModal(true);
  };

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_NEEDS)
  );
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
    return <div>loading</div>;
  }

  return (
    <div>
      <StyledHeader>
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <StyledTitle>Besoins</StyledTitle>
          <FigureContainer>{needs.length}</FigureContainer>
        </div>
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
              const color = getTagColor(need.tagName);
              return (
                <tr
                  key={key}
                  onClick={() => setSelectedNeedAndToggleModal(need)}
                >
                  <td>
                    <StyledTagName color={color}>
                      {jsUcfirst(need.tagName)}
                    </StyledTagName>
                  </td>
                  <td>{need.fr.text}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Content>
      <NeedDetailsModal
        show={showNeedDetailModal}
        selectedNeed={selectedNeed}
        toggleModal={() => setShowNeedDetailModal(!showNeedDetailModal)}
      />
    </div>
  );
};
