import styled from "styled-components";
import React from "react";
import { RowContainer } from "../../AdminStructures/components/AdminStructureComponents";
import { Picture } from "../../../../../types/interface";

interface RoleProps {
  role: string;
}

const RoleContainer = styled.div`
  background: #cdcdcd;
  border-radius: 6px;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  padding: 8px;
  width: fit-content;
  margin-right: 4px;
  margin-bottom: 4px;
`;
export const Role = (props: RoleProps) => (
  <RoleContainer>{props.role}</RoleContainer>
);

interface LangueProps {
  langue: string;
}

const LangueContainer = styled.div`
  padding: 8px;
  background: #cdcdcd;
  width: fit-content;
  height: fit-content;
  border-radius: 8px;
  margin-right: 4px;
  margin-bottom: 4px;
`;
export const LangueFlag = (props: LangueProps) => (
  <LangueContainer>
    <i
      className={"flag-icon flag-icon-" + props.langue}
      title={props.langue}
      id={props.langue}
      key={props.langue}
    />
  </LangueContainer>
);

const StructureName = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-right: 8px;
  overflow: hidden;
  word-wrap: break-word;
`;

const RoleDetail = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 8px;
`;
interface StructureProps {
  nom: string;
  picture: Picture | null;
  role: string;
}
export const Structure = (props: StructureProps) => (
  <div style={{ marginTop: "4px", marginBottom: "4px" }}>
    <RowContainer>
      {props.picture && props.picture.secure_url && (
        <img className="sponsor-img mr-8" src={props.picture.secure_url} />
      )}
      <StructureName>{props.nom}</StructureName>
      <RoleDetail>{props.role}</RoleDetail>
    </RowContainer>
  </div>
);
