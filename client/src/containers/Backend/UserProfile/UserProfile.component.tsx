/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { userDetailsSelector } from "../../../services/User/user.selectors";
import { User, Event } from "../../../types/interface";
import marioProfile from "../../../assets/mario-profile.jpg";
import "./UserProfile.scss";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import { Props } from "./UserProfile.container";
import FInput from "../../../components/FigmaUI/FInput/FInput";
import { PasswordField } from "./components/PasswordField";
import { computePasswordStrengthScore } from "../../../lib";
import API from "../../../utils/API";
import Swal from "sweetalert2";
import setAuthToken from "../../../utils/setAuthToken";
import { Spinner } from "reactstrap";

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex: 1;
  margin-top: 42px;
  height: fit-content;
  margin-bottom: 42px;
`;

const ProfileContainer = styled.div`
  background: #edebeb;
  border-radius: 12px;
  padding: 40px;
  margin: 0px 20px 0px 20px;
  display: flex;
  flex-direction: column;
  width: 560px;
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
  height: fit-content;
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
  word-wrap: break-word;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  margin-bottom: 8px;
  margin-top: ${(props) => props.marginTop || "0px"};
`;

const FInputContainer = styled.div`
  width: 480px;
`;
export interface PropsBeforeInjection {
  t: any;
}

const getUserImage = (user: User) =>
  user.picture && user.picture.secure_url
    ? user.picture.secure_url
    : marioProfile;

export const UserProfileComponent = (props: Props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState<string | undefined>("");
  const [isModifyPasswordOpen, setIsModifyPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(
    false
  );
  const [isChangePasswordLoading, setIsChangePasswordLoading] = useState(false);

  const [newPasswordScore, setNewPasswordScore] = useState(0);

  const openModifyPassword = () => setIsModifyPasswordOpen(true);
  const toggleNewPasswordVisibility = () =>
    setIsNewPasswordVisible(!isNewPasswordVisible);

  const toggleCurrentPasswordVisibility = () =>
    setIsCurrentPasswordVisible(!isCurrentPasswordVisible);

  const user = useSelector(userDetailsSelector);

  const onChange = (e: Event) => {
    if (e.target.id === "username") {
      setUsername(e.target.value);
      return;
    }
    if (e.target.id === "email") {
      setEmail(e.target.value);
      return;
    }

    if (e.target.id === "current-password") {
      setCurrentPassword(e.target.value);
      return;
    }

    if (e.target.id === "new-password") {
      const newPasswordScore = computePasswordStrengthScore(e.target.value)
        .score;
      setNewPasswordScore(newPasswordScore);
      setNewPassword(e.target.value);
      return;
    }
    return;
  };

  const modifyPassword = async () => {
    try {
      if (!user) return;
      setIsChangePasswordLoading(true);
      const data = await API.changePassword({
        userId: user._id,
        currentPassword,
        newPassword,
      });
      Swal.fire({
        title: "Yay...",
        text: "Votre mot de passe a bien été modifié",
        type: "success",
        timer: 1500,
      });
      // @ts-ignore
      localStorage.setItem("token", data.data.token);
      setAuthToken(data.data.token);
      setCurrentPassword("");
      setNewPasswordScore(0);
      setNewPassword("");
      setIsModifyPasswordOpen(false);
      setIsChangePasswordLoading(false);
    } catch (error) {
      setIsChangePasswordLoading(false);
    }
  };

  useEffect(() => {
    setUsername(user ? user.username : "");
    setEmail(user ? user.email : "");
  }, [user]);

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
        <FButton type="dark" name="upload-outline" className="mb-16">
          {props.t("UserProfile.Modifier ma photo", "Modifier ma photo")}
        </FButton>
        <DescriptionText>
          {props.t(
            "UserProfile.photoUsage",
            "Votre photo apparaîtra sur les fiches auxquelles vous allez contribuer."
          )}
        </DescriptionText>
      </ProfilePictureContainer>
      <ProfileContainer>
        <Title>{props.t("UserProfile.votre pseudo", "Votre pseudonyme")}</Title>
        <FInputContainer>
          <FInput
            id="username"
            value={username}
            onChange={onChange}
            newSize={true}
            autoFocus={false}
            prepend
            prependName="person-outline"
          />
        </FInputContainer>
        <DescriptionText>
          {props.t(
            "UserProfile.pseudoExplication",
            "Ce pseudonyme est public. Il apparaître sur les fiches auxquelles vous allez contribuer."
          )}
        </DescriptionText>
        <Title marginTop={"24px"}>
          {props.t("Register.Votre email", "Votre email")}
        </Title>
        <FInputContainer>
          <FInput
            id="email"
            value={email}
            onChange={onChange}
            newSize={true}
            autoFocus={false}
            prepend
            prependName="email-outline"
            placeholder={props.t(
              "Register.Renseignez votre adresse email",
              "Renseignez votre adresse email"
            )}
          />
        </FInputContainer>
        <DescriptionText>
          {props.t(
            "UserProfile.emailExplication",
            "Votre email sera utilisé seulement en cas de réinitialisation de votre mot de passe et pour des notifications liées à votre activité sur le site."
          )}
        </DescriptionText>
        <Title marginTop={"24px"}>
          {props.t("UserProfile.Votre mot de passe", "Votre mot de passe")}
        </Title>
        {!isModifyPasswordOpen && (
          <FButton type="dark" name="edit-outline" onClick={openModifyPassword}>
            {props.t("UserProfile.modifyPassword", "Modifier mon mot de passe")}
          </FButton>
        )}
        {isModifyPasswordOpen && (
          <>
            <FInputContainer>
              <FInput
                id="current-password"
                value={currentPassword}
                onChange={onChange}
                newSize={true}
                autoFocus={true}
                prepend
                prependName="lock-outline"
                placeholder="Votre mot de passe actuel"
                append
                appendName={
                  isCurrentPasswordVisible ? "eye-off-2-outline" : "eye-outline"
                }
                inputClassName="password-input"
                onAppendClick={toggleCurrentPasswordVisibility}
                type={isCurrentPasswordVisible ? "text" : "password"}
              />
            </FInputContainer>
            <FInputContainer>
              <PasswordField
                id="new-password"
                value={newPassword}
                onChange={onChange}
                passwordVisible={isNewPasswordVisible}
                onClick={toggleNewPasswordVisibility}
                t={props.t}
                passwordScore={newPasswordScore}
              />
            </FInputContainer>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              {isChangePasswordLoading ? (
                <FButton
                  disabled={true}
                  type="validate-light"
                  name="checkmark-outline"
                  className="mt-8"
                  onClick={modifyPassword}
                >
                  <Spinner />
                </FButton>
              ) : (
                <FButton
                  disabled={newPasswordScore < 1}
                  type="validate-light"
                  name="checkmark-outline"
                  className="mt-8"
                  onClick={modifyPassword}
                >
                  {props.t("UserProfile.Enregistrer", "Enregistrer")}
                </FButton>
              )}
            </div>
          </>
        )}
      </ProfileContainer>
    </MainContainer>
  );
};
