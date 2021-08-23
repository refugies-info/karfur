/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React from "react";
import {
  StyledHeader,
  StyledTitle,
  FigureContainer,
  Content,
} from "../sharedComponents/StyledAdmin";
import { Table } from "reactstrap";
import { headers } from "../AdminStructures/data";
import { TabHeader, StyledStatus } from "../sharedComponents/SubComponents";
import {
  RowContainer,
  StructureName,
  ResponsableComponent,
} from "../AdminStructures/components/AdminStructureComponents";
import moment from "moment";

const needsHeaders = [
  { name: "Thème", order: "" },
  { name: "Besoin", order: "" },
  { name: "", order: "" },
];
export const Needs = () => {
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
          <FigureContainer>{10}</FigureContainer>
        </div>
      </StyledHeader>
      <Content>
        <Table responsive borderless>
          <thead>
            <tr>
              {needsHeaders.map((element, key) => (
                <th
                  key={key}
                  //   onClick={() => {
                  //     reorder(element);
                  //   }}
                >
                  <TabHeader
                    name={element.name}
                    order={element.order}
                    // isSortedHeader={sortedHeader.name === element.name}
                    // sens={
                    //   sortedHeader.name === element.name
                    //     ? sortedHeader.sens
                    //     : "down"
                    // }
                    isSortedHeader={false}
                    sens={"down"}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* {structuresToDisplay.map((element, key) => (
              <tr key={key}>
                <td
                  className="align-middle"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
                  <RowContainer>
                    {element.picture && element.picture.secure_url && (
                      <img
                        className="sponsor-img mr-8"
                        src={(element.picture || {}).secure_url}
                      />
                    )}
                    <StructureName>{element.nom}</StructureName>
                  </RowContainer>
                </td>
                <td
                  className="align-middle"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
                  <StyledStatus
                    text={element.status}
                    textToDisplay={element.status}
                  />
                </td>
                <td
                  className="align-middle cursor-pointer"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
                  {element.nbMembres}
                </td>

                <td
                  className={"align-middle "}
                  onClick={() =>
                    setSelectedUserIdAndToggleModal(element.responsable)
                  }
                >
                  <ResponsableComponent
                    responsable={element.responsable}
                    canModifyRespo={false}
                    onClick={() => {}}
                  />
                </td>
                <td
                  className="align-middle"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
                  {element.nbFiches}
                </td>
                <td
                  className="align-middle"
                  onClick={() => setSelectedStructureIdAndToggleModal(element)}
                >
                  {element.created_at
                    ? moment(element.created_at).format("LLL")
                    : "Non connue"}
                </td>
              </tr>
            ))} */}
          </tbody>
        </Table>
      </Content>
    </div>
  );
};
