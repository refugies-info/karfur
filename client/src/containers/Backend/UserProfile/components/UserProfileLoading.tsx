import React from "react";
import {
  MainContainer,
  ProfilePictureContainer,
  ProfileContainer,
  Title,
} from "../UserProfile.component";
import styled from "styled-components";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const ImageContainer = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background-color: #ffffff;
  margin-bottom: 8px;
`;
export const UserProfileLoading = (props: { t: any }) => (
  <MainContainer>
    <ProfilePictureContainer>
      <ImageContainer />
      <SkeletonTheme color="#FFFFFF">
        <Skeleton count={1} height={20} width={160} />
      </SkeletonTheme>
    </ProfilePictureContainer>
    <ProfileContainer>
      <Title>{props.t("UserProfile.votre pseudo", "Votre pseudonyme")}</Title>
      <SkeletonTheme color="#FFFFFF">
        <Skeleton count={1} height={50} />
      </SkeletonTheme>
      <Title marginTop={"24px"}>
        {props.t("Register.Votre email", "Votre email")}
      </Title>
      <SkeletonTheme color="#FFFFFF">
        <Skeleton count={1} height={50} />
      </SkeletonTheme>

      <Title marginTop={"24px"}>
        {props.t("UserProfile.Votre mot de passe", "Votre mot de passe")}
      </Title>
      <SkeletonTheme color="#FFFFFF">
        <Skeleton count={1} height={50} />
      </SkeletonTheme>
    </ProfileContainer>
  </MainContainer>
);
