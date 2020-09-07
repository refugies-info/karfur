import React from "react";
import styled from "styled-components";

import { membres } from "../data";
import Alain from "../../../assets/qui-sommes-nous/Alain.png";
import Agathe from "../../../assets/qui-sommes-nous/Agathe.png";
import Nour from "../../../assets/qui-sommes-nous/Nour.png";
import Simon from "../../../assets/qui-sommes-nous/Simon.png";
import Luca from "../../../assets/qui-sommes-nous/Luca.png";
import Ana from "../../../assets/qui-sommes-nous/Ana.png";
import Hugo from "../../../assets/qui-sommes-nous/Hugo.png";
import Chloé from "../../../assets/qui-sommes-nous/Chloé.png";

const TeamContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: 232px;
  margin-left: 232px;
  justify-content: space-between;
`;
export const Team = (props) => (
  <TeamContainer>
    {membres.map((membre) => (
      <MemberCard
        name={membre.name}
        key={membre.name}
        role={membre.roleShort || membre.roleName}
        color={membre.color}
        borderColor={membre.borderColor}
        onMemberCardClick={props.onMemberCardClick}
      />
    ))}
  </TeamContainer>
);

const MemberCardContainer = styled.div`
  width: 220px;
  height: 310px;
  margin-bottom: 32px;
  border-radius: 12px;
  background: ${(props) => props.background};
  position: relative;
  cursor: pointer;
  border: 4px solid #f2f2f2;
  &:hover {
    border-width: 4px;
    border-style: solid;
    border-color: ${(props) => props.borderColor};
  }
`;
const ImageContainer = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
`;

const NameContainer = styled.div`
  background: #ffffff;
  padding: 4px;
  top: 224px;
  left: 24px;
  position: absolute;
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
`;

const RoleContainer = styled.div`
  background: #ffffff;
  padding: 4px;
  top: 255px;
  left: 24px;
  position: absolute;
  font-size: 18px;
  line-height: 23px;
  margin-top: 4px;
`;

const getImage = (name) => {
  const firstName = name.split(" ")[0];

  if (firstName === "Alain") return Alain;
  if (firstName === "Agathe") return Agathe;
  if (firstName === "Simon") return Simon;
  if (firstName === "Nour") return Nour;
  if (firstName === "Hugo") return Hugo;
  if (firstName === "Chloé") return Chloé;
  if (firstName === "Ana") return Ana;
  if (firstName === "Luca") return Luca;
};

const MemberCard = (props) => (
  <MemberCardContainer
    background={props.color}
    borderColor={props.borderColor}
    onClick={() => props.onMemberCardClick(props.name)}
  >
    <ImageContainer>
      <img
        src={getImage(props.name)}
        //   onClick={this._closeSide}
        alt={props.name}
      />
    </ImageContainer>
    <NameContainer>{props.name}</NameContainer>
    <RoleContainer>{props.role}</RoleContainer>
  </MemberCardContainer>
);
