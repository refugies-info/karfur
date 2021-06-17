import React, { useState } from "react";
import styled from "styled-components";
import FButton from "../../../components/FigmaUI/FButton/FButton";

import { membres } from "../data";

import { former_membres } from "../data";
import Alain from "../../../assets/qui-sommes-nous/Alain.png";
import Agathe from "../../../assets/qui-sommes-nous/Agathe.png";
import Nour from "../../../assets/qui-sommes-nous/Nour.png";
import Soufiane from "../../../assets/qui-sommes-nous/Soufiane.png";
import Simon from "../../../assets/qui-sommes-nous/Simon.png";
import Luca from "../../../assets/qui-sommes-nous/Luca.png";
import Ana from "../../../assets/qui-sommes-nous/Ana.png";
import Hugo from "../../../assets/qui-sommes-nous/Hugo.png";
import Chloé from "../../../assets/qui-sommes-nous/Chloé.png";
import Camille from "../../../assets/qui-sommes-nous/Camille.png";
import Alice from "../../../assets/qui-sommes-nous/Alice.png";
import Gael from "../../../assets/qui-sommes-nous/Gael.png";
import Margot from "../../../assets/qui-sommes-nous/Margot.png";
import { Row } from "reactstrap";

const TeamContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: 40px;
  margin-left: 66px;
  justify-content: center;
`;
export const Team = (props) => (
  <TeamContainer>
    <Row>
      {props.type === "membres"
        ? membres.map((membre) => (
            <MemberCard
              portfolio={membre.portfolio}
              linkedin={membre.linkedin}
              twitter={membre.twitter}
              name={membre.name}
              key={membre.name}
              autre={membre.autre}
              role={membre.roleShort || membre.roleName}
              color={membre.color}
              borderColor={membre.borderColor}
              onMemberCardClick={props.onMemberCardClick}
              membreSelected={props.membre === membre.name && props.sideVisible}
              t={props.t}
            />
          ))
        : props.type === "former_membres"
        ? former_membres.map((membre) => (
            <MemberCard
              portfolio={membre.portfolio}
              linkedin={membre.linkedin}
              twitter={membre.twitter}
              name={membre.name}
              key={membre.name}
              autre={membre.autre}
              role={membre.roleShort || membre.roleName}
              color={membre.color}
              borderColor={membre.borderColor}
              onMemberCardClick={props.onMemberCardClick}
              membreSelected={props.membre === membre.name && props.sideVisible}
              t={props.t}
            />
          ))
        : null}
    </Row>
  </TeamContainer>
);

const MemberCardContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 158px;
  width: fit-content;
  margin-left: 4px;
  margin-right: 4px;
  margin-bottom: 32px;
  border-radius: 12px;
  background: ${(props) =>
    props.isHover ? props.borderColor : props.background};
  position: relative;
  cursor: pointer;
  padding: 14px;
  border-width: 4px;
  border-style: solid;
  border-color: ${(props) => props.borderColor};
`;
const MemberContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const NameContainer = styled.div`
  text-align: center;
  width: fit-content;
  font-weight: bold;
  font-size: 16px;
  background: #ffffff;
  padding: 4px;
  margin-top: 20px;
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const RoleContainer = styled.div`
  text-align: center;
  width: fit-content;
  font-size: 16px;
  line-height: 23px;
  margin-top: 8px;
  padding: 4px;
  background: #ffffff;
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
  if (firstName === "Gaël") return Gael;
  if (firstName === "Alice") return Alice;
  if (firstName === "Camille") return Camille;
  if (firstName === "Margot") return Margot;
  if (firstName === "Soufiane") return Soufiane;
};

const MemberCard = (props) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <MemberContainer>
      <MemberCardContainer
        background={props.color}
        borderColor={props.borderColor}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        isHover={isHover}
        membreSelected={props.membreSelected}
      >
        {isHover ? (
          <LinkContainer>
            {props.portfolio && (
              <FButton
                target="_blank"
                href={props.portfolio}
                type="white"
                className="mb-10 mt-10"
                name="external-link-outline"
              >
                {props.t("QuiSommesNous.PortFolio", "PortFolio ")}
              </FButton>
            )}
            {props.linkedin && (
              <FButton
                target="_blank"
                href={props.linkedin}
                type="white"
                className="mb-10  mt-10"
                name="linkedin-outline"
              >
                {props.t("QuiSommesNous.Linkedin", "Linkedin ")}
              </FButton>
            )}
            {props.twitter && (
              <FButton
                target="_blank"
                href={props.twitter}
                type="white"
                className="mb-10 mt-10"
                name="twitter-outline"
              >
                {props.t("QuiSommesNous.Twitter", "Twitter ")}
              </FButton>
            )}
            {props.autre && (
              <FButton
                target="_blank"
                href={props.autre}
                type="white"
                className="mb-10  mt-10"
                name="external-link-outline"
              >
                {props.t("QuiSommesNous.Autre", "Autre ")}
              </FButton>
            )}
          </LinkContainer>
        ) : (
          <>
            <div>
              <img
                src={getImage(props.name)}
                //   onClick={this._closeSide}
                alt={props.name}
              />
            </div>
            <NameContainer>{props.name}</NameContainer>
            <RoleContainer>{props.role}</RoleContainer>
          </>
        )}
      </MemberCardContainer>
    </MemberContainer>
  );
};
