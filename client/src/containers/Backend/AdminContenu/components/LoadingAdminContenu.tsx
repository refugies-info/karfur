import React from "react";
import { StyledHeader, StyledTitle } from "../StyledAdminContenu";
import { Table } from "reactstrap";
import { table_contenu } from "../data";
import Skeleton from "react-loading-skeleton";

export const LoadingAdminContenu = () => {
  const arrayLines = new Array(12).fill("a");
  const arrayContent = new Array(7).fill("a");
  return (
    <>
      <StyledHeader>
        <StyledTitle>Contenus</StyledTitle>
      </StyledHeader>
      <Table responsive>
        <thead>
          <tr>
            {table_contenu.headers.map((element, key) => (
              <th key={key}>{element.name}</th>
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
                  <Skeleton width={350} count={1} />
                </td>
                {arrayContent.map((element, key) => (
                  <td key={key}>
                    <Skeleton width={50} count={1} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
