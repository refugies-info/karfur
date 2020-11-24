import React from "react";
import { Structure } from "../../../../../@types/interface";
import img from "../../../../../assets/annuaire/annuaire_create.svg";
import styled from "styled-components";
import { StructureType } from "./StructureType";
import { SocialsLink } from "./SocialsLink";

const LeftContainer = styled.div`
  width: 360px;
  background-image: url(${img});
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: ${(props) => props.height}px;
`;

const LogoContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 296px;
  height: 168px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

interface Props {
  structure: Structure;
  leftPartHeight: number;
  t: any;
}
export const LeftAnnuaireDetail = (props: Props) => (
  <LeftContainer height={props.leftPartHeight}>
    <div>
      <LogoContainer>
        <img
          className="sponsor-img"
          src={(props.structure.picture || {}).secure_url}
          alt={props.structure.acronyme}
        />
      </LogoContainer>
      {props.structure.structureTypes &&
        props.structure.structureTypes.map((structureType) => (
          <StructureType type={structureType} key={structureType} t={props.t} />
        ))}
    </div>
    <SocialsLink
      websites={props.structure.websites}
      facebook={props.structure.facebook}
      linkedin={props.structure.linkedin}
      twitter={props.structure.twitter}
      t={props.t}
    />
  </LeftContainer>
);
