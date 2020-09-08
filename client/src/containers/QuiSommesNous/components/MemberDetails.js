import React from "react";
import styled from "styled-components";

import { membres } from "../data";
import _ from "lodash";
import FButton from "../../../components/FigmaUI/FButton/FButton";

const MainContainerLeft = styled.div`
  width: 600px;
  background: ${(props) => props.backgroundColor};
  height: 850px;
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 40px;
`;

const MainContainerRight = styled.div`
  width: 600px;
  background: ${(props) => props.backgroundColor};
  height: 850px;
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 40px;
  display: flex;
  flex-direction: column;
`;

const NameContainer = styled.div`
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
  color: ${(props) => props.textColor};
`;

const RoleContainer = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: ${(props) => props.textColor};
  margin-top: 8px;
`;
const TitleContainer = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-bottom: 16px;
  margin-top: 32px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 32px;
`;

const getMemberFromName = (name) => {
  const membre = _.find(membres, (membre) => membre.name === name);
  const index = _.findIndex(membres, (membre) => membre.name === name);
  return { membre, index };
};

export const MemberDetails = (props) => {
  const { membre, index } = getMemberFromName(props.membreName);

  if (!props.isOpened) return false;

  if ([2, 3, 6, 7].includes(index))
    return (
      <MainContainerLeft backgroundColor={membre.color}>
        <NameContainer textColor={membre.textColor}>
          {membre.name}
        </NameContainer>
        <RoleContainer textColor={membre.textColor}>
          {membre.roleName}
        </RoleContainer>
        <TitleContainer>Mon engagement</TitleContainer>
        {membre.engagement}
        <TitleContainer>Mon rôle</TitleContainer>
        {membre.role}
        {membre.outils && (
          <>
            <TitleContainer>Mes outils</TitleContainer>
            {membre.outils}
          </>
        )}
        <Buttons membre={membre} />
      </MainContainerLeft>
    );
  return (
    <MainContainerRight backgroundColor={membre.color}>
      <NameContainer textColor={membre.textColor}>{membre.name}</NameContainer>
      <RoleContainer textColor={membre.textColor}>
        {membre.roleName}
      </RoleContainer>
      <TitleContainer>Mon engagement</TitleContainer>
      {membre.engagement}
      <TitleContainer>Mon rôle</TitleContainer>
      {membre.role}
      {membre.outils && (
        <>
          <TitleContainer>Mes outils</TitleContainer>
          {membre.outils}
        </>
      )}
      <Buttons membre={membre} />
    </MainContainerRight>
  );
};

const Buttons = (props) => (
  <ButtonContainer>
    {props.membre.portfolio && (
      <FButton
        type="fill-dark"
        name="image"
        tag="a"
        href={props.membre.portfolio}
        target="_blank"
        rel="noopener noreferrer"
        className="mr-8"
      >
        Portfolio
      </FButton>
    )}
    {props.membre.linkedin && (
      <FButton
        type="fill-dark"
        name="linkedin"
        tag="a"
        href={props.membre.linkedin}
        target="_blank"
        rel="noopener noreferrer"
      >
        Linkedin
      </FButton>
    )}
    {props.membre.twitter && (
      <FButton
        type="fill-dark"
        name="twitter"
        tag="a"
        href={props.membre.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-8"
      >
        Twitter
      </FButton>
    )}
  </ButtonContainer>
);
