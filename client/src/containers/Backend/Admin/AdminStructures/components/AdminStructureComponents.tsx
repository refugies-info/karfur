import styled from "styled-components";
import { Responsable } from "types/interface";
import React from "react";
import marioProfile from "assets/mario-profile.jpg";
import "./AdminStructureComponents.scss";

export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StructureName = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
`;

interface Props {
  responsable: Responsable | null;
}

export const ResponsableComponent = (props: Props) => {
  const responsableSecureUrl =
    props.responsable &&
    props.responsable.picture &&
    props.responsable.picture.secure_url
      ? props.responsable.picture.secure_url
      : marioProfile;

  const responsableName = props.responsable
    ? props.responsable.username
    : "Aucun responsable";
  return (
    <RowContainer>
      {props.responsable && (
        <img className="respo-img mr-8" src={responsableSecureUrl} />
      )}
      {responsableName}
    </RowContainer>
  );
};
