/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { userDetailsSelector } from "../../../services/User/user.selectors";
import { User } from "../../../types/interface";
import marioProfile from "../../../assets/mario-profile.jpg";
import "./UserProfile.scss";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import { Props } from "./UserProfile.container";

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex: 1;
  margin-top: 42px;
  height: fit-content;
`;

const ProfileContainer = styled.div`
  background: #edebeb;
  border-radius: 12px;
  padding: 40px;
  margin: 0px 20px 0px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfilePictureContainer = styled.div`
  background: #edebeb;
  border-radius: 12px;
  padding: 40px;
  margin: 0px 20px 0px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
`;

const ErrorContainer = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: red;
`;

const UserName = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const DescriptionText = styled.div`
  margin-top: 16px;
  word-wrap: break-word;
`;

export interface PropsBeforeInjection {
  t: any;
}

const getUserImage = (user: User) =>
  user.picture && user.picture.secure_url
    ? user.picture.secure_url
    : marioProfile;

export const UserProfileComponent = (props: Props) => {
  const user = useSelector(userDetailsSelector);

  if (!user) {
    return (
      <MainContainer>
        <ErrorContainer>
          {props.t(
            "UserProfile.ErreurChargement",
            "Une erreur est survenue, veuillez recharger la page !"
          )}
        </ErrorContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer className="user-profile">
      <ProfilePictureContainer>
        <img src={getUserImage(user)} alt="my-image" className="user-img" />
        <UserName>{user.username}</UserName>
        <FButton type="dark" name="upload-outline">
          {props.t("UserProfile.Modifier ma photo", "Modifier ma photo")}
        </FButton>
        <DescriptionText>
          {props.t(
            "UserProfile.photoUsage",
            "Votre photo apparaîtra sur les fiches auxquelles vous allez contribuer."
          )}
        </DescriptionText>
      </ProfilePictureContainer>
      <ProfileContainer>profil</ProfileContainer>
    </MainContainer>
  );
};
