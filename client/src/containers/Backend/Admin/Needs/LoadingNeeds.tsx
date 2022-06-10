import React from "react";
import {
  StyledHeader,
  StyledTitle,
  Content,
  FigureContainer,
} from "../sharedComponents/StyledAdmin";
import { Table } from "reactstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import EVAIcon from "../../../../components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import { needsHeaders } from "./Needs";

export const LoadingNeeds = () => {
  const arrayLines = new Array(12).fill("a");

  return (
    <>
      <StyledHeader>
        <StyledTitle>Besoins</StyledTitle>
        <FigureContainer>{"..."}</FigureContainer>
      </StyledHeader>
      <Content>
        <Table responsive borderless>
          <thead>
            <tr>
              {needsHeaders.map((element, key) => (
                <th key={key}>
                  {element.name}
                  {element.order && (
                    <EVAIcon
                      // @ts-ignore
                      name={"chevron-" + (element.croissant ? "up" : "down")}
                      fill={colors.gray90}
                      className="sort-btn"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {arrayLines.map((_, key) => {
              return (
                <tr key={key} className={"bg-white"}>
                  <td style={{ width: 300 }}>
                    <SkeletonTheme baseColor="#CDCDCD">
                      <Skeleton width={270} count={1} />
                    </SkeletonTheme>
                  </td>
                  <td key={key}>
                    <SkeletonTheme baseColor="#CDCDCD">
                      <Skeleton width={270} count={1} />
                    </SkeletonTheme>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Content>
    </>
  );
};
