import React from "react";
import {
  StyledHeader,
  StyledTitle,
  Content,
  FigureContainer,
  StyledSort,
} from "../StyledAdminContenu";
import { Table } from "reactstrap";
import { table_contenu } from "../data";
import Skeleton from "react-loading-skeleton";
import EVAIcon from "../../../../components/UI/EVAIcon/EVAIcon";
// @ts-ignore
import variables from "scss/colors.scss";
import { FilterButton } from "./SubComponents";

export const LoadingAdminContenu = () => {
  const arrayLines = new Array(12).fill("a");
  const arrayContent = new Array(5).fill("a");
  return (
    <>
      <StyledHeader>
        <StyledTitle>Contenus</StyledTitle>
        <FigureContainer>{"..."}</FigureContainer>
        <StyledSort>
          <FilterButton
            onClick={() => {}}
            text="À valider (...)"
            isSelected={false}
          />
          <FilterButton
            onClick={() => {}}
            text="En attente (...)"
            isSelected={false}
          />
          <FilterButton
            onClick={() => {}}
            text="Brouillon (...)"
            isSelected={false}
          />
          <FilterButton
            onClick={() => {}}
            text="Sans structure (...)"
            isSelected={false}
          />
          <FilterButton
            onClick={() => {}}
            text="Publié (...)"
            isSelected={false}
          />
          <FilterButton
            onClick={() => {}}
            text="Rejeté (...)"
            isSelected={false}
          />
          <FilterButton
            onClick={() => {}}
            text="Supprimé (...)"
            isSelected={false}
          />
        </StyledSort>
      </StyledHeader>
      <Content>
        <Table responsive borderless>
          <thead>
            <tr>
              {table_contenu.headers.map((element, key) => (
                <th key={key}>
                  {element.name}
                  {element.order && (
                    <EVAIcon
                      // @ts-ignore
                      name={"chevron-" + (element.croissant ? "up" : "down")}
                      fill={variables.noir}
                      className="sort-btn"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {arrayLines.map((element, key) => {
              return (
                <tr key={key} className={"bg-blancSimple"}>
                  <td>
                    <Skeleton width={50} count={1} />
                  </td>
                  <td>
                    <Skeleton width={270} count={1} />
                  </td>
                  {arrayContent.map((element, key) => (
                    <td key={key}>
                      <Skeleton width={70} count={1} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Content>
    </>
  );
};
