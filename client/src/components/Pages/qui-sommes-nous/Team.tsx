import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import FButton from "components/FigmaUI/FButton/FButton";
import Alain from "assets/qui-sommes-nous/Alain.png";
import Agathe from "assets/qui-sommes-nous/Agathe.png";
import Nour from "assets/qui-sommes-nous/Nour.png";
import Soufiane from "assets/qui-sommes-nous/Soufiane.png";
import Simon from "assets/qui-sommes-nous/Simon.png";
import Luca from "assets/qui-sommes-nous/Luca.png";
import Ana from "assets/qui-sommes-nous/Ana.png";
import Hugo from "assets/qui-sommes-nous/Hugo.png";
import Chloé from "assets/qui-sommes-nous/Chloé.png";
import Camille from "assets/qui-sommes-nous/Camille.png";
import Alice from "assets/qui-sommes-nous/Alice.png";
import Gael from "assets/qui-sommes-nous/Gael.png";
import Margot from "assets/qui-sommes-nous/Margot.png";
import { members, former_members } from "data/members";
import type { Member } from "data/members";

const TeamContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: 40px;
  margin-left: 66px;
  justify-content: center;
`;


interface MemberCardContainerProps {
  borderColor: string
  background: string
  isHover: boolean
}
const MemberCardContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 207px;
  height: 250px;
  margin-left: 4px;
  margin-right: 4px;
  margin-bottom: 32px;
  border-radius: 12px;
  background: ${(props: MemberCardContainerProps) =>
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

const getImage = (name: string) => {
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

interface MemberProps {
  member: Member;
  onMemberCardClick: any;
  memberSelected: boolean;
}
const MemberCard = (props: MemberProps) => {
  const [isHover, setIsHover] = useState(false);
  const { t } = useTranslation();

  return (
    <MemberContainer>
      <MemberCardContainer
        background={props.member.color}
        borderColor={props.member.borderColor}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        isHover={isHover}
        membreSelected={props.memberSelected}
      >
        {isHover ? (
          <LinkContainer>
            {props.member.portfolio && (
              <FButton
                target="_blank"
                href={props.member.portfolio}
                type="white"
                className="mb-10 mt-10"
                name="external-link-outline"
              >
                {t("QuiSommesNous.Portfolio", "Portfolio ")}
              </FButton>
            )}
            {props.member.linkedin && (
              <FButton
                target="_blank"
                href={props.member.linkedin}
                type="white"
                className="mb-10  mt-10"
                name="linkedin-outline"
              >
                Linkedin
              </FButton>
            )}
            {props.member.twitter && (
              <FButton
                target="_blank"
                href={props.member.twitter}
                type="white"
                className="mb-10 mt-10"
                name="twitter-outline"
              >
                Twitter
              </FButton>
            )}
            {props.member.autre && (
              <FButton
                target="_blank"
                href={props.member.autre}
                type="white"
                className="mb-10  mt-10"
                name="external-link-outline"
              >
                {t("QuiSommesNous.Autre", "Autre ")}
              </FButton>
            )}
          </LinkContainer>
        ) : (
          <>
            <div>
              <Image
                src={getImage(props.member.name)}
                //   onClick={this._closeSide}
                alt={props.member.name}
              />
            </div>
            <NameContainer>{props.member.name}</NameContainer>
            <RoleContainer>
              {props.member.roleShort || props.member.roleName}
            </RoleContainer>
          </>
        )}
      </MemberCardContainer>
    </MemberContainer>
  );
};

interface TeamProps {
  type: "members" | "former_members";
  onMemberCardClick: any;
  sideVisible: boolean;
  member: any;
}

export const Team = (props: TeamProps) => (
  <TeamContainer>
    {props.type === "members"
      ? members.map((member, i) => (
        <MemberCard
            key={i}
            member={member}
            onMemberCardClick={props.onMemberCardClick}
            memberSelected={props.member === member.name && props.sideVisible}
          />
        ))
      : props.type === "former_members"
      ? former_members.map((member, i) => (
          <MemberCard
            key={i}
            member={member}
            onMemberCardClick={props.onMemberCardClick}
            memberSelected={props.member === member.name && props.sideVisible}
          />
        ))
      : null}
  </TeamContainer>
);
