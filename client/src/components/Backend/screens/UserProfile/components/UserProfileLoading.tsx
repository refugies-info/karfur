import React from "react";
import {
  MainContainer,
  ProfilePictureContainer,
  ProfileContainer,
  Title,
} from "../UserProfile";
import styled from "styled-components";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { colors } from "colors";

const ImageContainer = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background-color: ${colors.white};
  margin-bottom: 8px;
`;
export const UserProfileLoading = (props: { t: any }) => (
  <MainContainer>
    <ProfilePictureContainer>
      <ImageContainer />
      <SkeletonTheme baseColor={colors.white}>
        <Skeleton count={1} height={20} width={160} />
      </SkeletonTheme>
    </ProfilePictureContainer>
    <ProfileContainer>
      <Title>{props.t("UserProfile.votre pseudo", "Votre pseudonyme")}</Title>
      <SkeletonTheme baseColor={colors.white}>
        <Skeleton count={1} height={50} />
      </SkeletonTheme>
      <Title marginTop={24}>
        {props.t("Register.Votre email", "Votre email")}
      </Title>
      <SkeletonTheme baseColor={colors.white}>
        <Skeleton count={1} height={50} />
      </SkeletonTheme>

      <Title marginTop={24}>
        {props.t("UserProfile.Votre mot de passe", "Votre mot de passe")}
      </Title>
      <SkeletonTheme baseColor={colors.white}>
        <Skeleton count={1} height={50} />
      </SkeletonTheme>
    </ProfileContainer>
  </MainContainer>
);
