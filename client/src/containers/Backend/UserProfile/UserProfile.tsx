import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { userDetailsSelector } from "services/User/user.selectors";
import { User, Event } from "types/interface";
import marioProfile from "assets/mario-profile.jpg";
import FButton from "components/UI/FButton/FButton";
import FInput from "components/UI/FInput/FInput";
import { PasswordField } from "./components/PasswordField";
import { CodePhoneValidationModal } from "components/Modals/CodePhoneValidationModal/CodePhoneValidationModal";
import { computePasswordStrengthScore } from "lib";
import API from "utils/API";
import Swal from "sweetalert2";
import setAuthToken from "utils/setAuthToken";
import { Spinner, Input } from "reactstrap";
import {
  saveUserActionCreator,
  fetchUserActionCreator,
} from "services/User/user.actions";
import { isLoadingSelector, errorSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { userStructureMembresSelector } from "services/UserStructure/userStructure.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { UserProfileLoading } from "./components/UserProfileLoading";
import { colors } from "colors";
import Navigation from "../Navigation";
import styles from "./UserProfile.module.scss";
import { useTranslation } from "next-i18next";
import { isValidPhone } from "lib/validateFields";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex: 1;
  margin-top: 26px;
  height: fit-content;
  margin-bottom: 42px;
`;

const ErrorMessageContainer = styled.div`
  color: ${colors.error};
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
`;

export const ProfileContainer = styled.div`
  background: ${colors.lightGrey};
  border-radius: 12px;
  padding: 40px;
  margin: 0px 20px 0px 20px;
  display: flex;
  flex-direction: column;
  width: 560px;
  height: fit-content;
`;

export const ProfilePictureContainer = styled.div`
  background: ${colors.lightGrey};
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

export const UserName = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const DescriptionText = styled.div`
  word-wrap: break-word;
`;

export const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  margin-bottom: 8px;
  margin-top: ${(props: {marginTop?: number}) => props.marginTop || 0}px;
`;

const FInputContainer = styled.div`
  width: 480px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const getUserImage = (user: User) =>
  user.picture && user.picture.secure_url
    ? user.picture.secure_url
    : marioProfile;

export const UserProfile = () => {
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState<string | undefined>("");
  const [phone, setPhone] = useState<string | undefined>("");
  const [code, setCode] = useState<string>("");
  const [isModifyPasswordOpen, setIsModifyPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isChangePasswordLoading, setIsChangePasswordLoading] = useState(false);
  const [newPasswordScore, setNewPasswordScore] = useState(0);
  const [isPseudoModifyDisabled, setIsPseudoModifyDisabled] = useState(true);
  const [isEmailModifyDisabled, setIsEmailModifyDisabled] = useState(true);
  const [isPhoneModifyDisabled, setIsPhoneModifyDisabled] = useState(true);
  const [isPictureUploading, setIsPictureUploading] = useState(false);
  const [notEmailError, setNotEmailError] = useState(false);
  const [notPhoneError, setNotPhoneError] = useState(false);
  const isLoadingSave = useSelector(
    isLoadingSelector(LoadingStatusKey.SAVE_USER)
  );
  const errorSave = useSelector(
    errorSelector(LoadingStatusKey.SAVE_USER)
  );
  const isLoadingFetch = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER)
  );

  const openModifyPassword = () => setIsModifyPasswordOpen(true);
  const toggleNewPasswordVisibility = () =>
    setIsNewPasswordVisible(!isNewPasswordVisible);

  const toggleCurrentPasswordVisibility = () =>
    setIsCurrentPasswordVisible(!isCurrentPasswordVisible);

  const user = useSelector(userDetailsSelector);
  const userStructureMembres = useSelector(userStructureMembresSelector);
  const dispatch = useDispatch();

  const [showPhone, setShowPhone] = useState(false);
  useEffect(() => {
    if (user) {
      const isAdmin = (user.roles || []).find(r => r.nom === "Admin");
      //@ts-ignore
      const userStructureMembre = userStructureMembres.find(membre => membre.userId === user._id);
      setShowPhone(!!isAdmin || !!userStructureMembre?.roles.includes("administrateur"));
    }
  }, [user, userStructureMembres]);


  const onChange = (e: Event) => {
    if (e.target.id === "username") {
      setUsername(e.target.value);
      setIsPseudoModifyDisabled(false);
      return;
    }
    if (e.target.id === "email") {
      setEmail(e.target.value);
      setIsEmailModifyDisabled(false);
      return;
    }
    if (e.target.id === "phone") {
      setPhone(e.target.value);
      setIsPhoneModifyDisabled(false);
      return;
    }

    if (e.target.id === "current-password") {
      setCurrentPassword(e.target.value);
      return;
    }

    if (e.target.id === "new-password") {
      const newPasswordScore = computePasswordStrengthScore(
        e.target.value
      ).score;
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
  const handleFileInputChange = () => {
    if (!user) return;
    setIsPictureUploading(true);
    const formData = new FormData();
    // @ts-ignore
    formData.append(0, event.target.files[0]);

    API.set_image(formData).then((data_res: any) => {
      const imgData = data_res.data.data;
      dispatch(
        saveUserActionCreator({
          user: {
            picture: {
              secure_url: imgData.secure_url,
              public_id: imgData.public_id,
              imgId: imgData.imgId,
            },
            _id: user._id,
          },
          type: "modify-my-details",
        })
      );
      setIsPictureUploading(false);
    });
  };

  const onEmailModificationValidate = () => {
    const regex = /^\S+@\S+\.\S+$/;
    const isEmail = email ? !!email.match(regex) : false;
    if (isEmail) {
      if (!user) return;
      dispatch(
        saveUserActionCreator({
          user: { email, _id: user._id },
          type: "modify-my-details",
        })
      );

      Swal.fire({
        title: "Yay...",
        text: "Votre email a bien été modifié",
        type: "success",
        timer: 1500,
      });
      setIsEmailModifyDisabled(true);
    } else {
      setNotEmailError(true);
    }
  };

  const [codePhoneModalVisible, setCodePhoneModalVisible] = useState(false);
  // show modal to validate phone
  const onPhoneModificationValidate = () => {
    if (!isValidPhone(phone)) {
      setNotPhoneError(true);
      return;
    }
    setNotPhoneError(false);
    if (!user) return;
    API.updateUser({ // will return a 501 and send SMS code
      query: {
        user: { phone, _id: user._id },
        action: "modify-my-details",
      }
    }).catch(() => setCodePhoneModalVisible(true));
  };

  // submit verification code
  const onSubmitCode = () => {
    if (!user) return;
    dispatch(
      saveUserActionCreator({
        user: { phone, code, _id: user._id },
        type: "modify-my-details",
      })
    );
  }

  useEffect(() => {
    const phoneCodeValid = !isLoadingSave && !errorSave && codePhoneModalVisible;
    if (phoneCodeValid) {
      setCodePhoneModalVisible(false);
      setCode("");
      setIsPhoneModifyDisabled(true);

      Swal.fire({
        title: "Yay...",
        text: "Votre numéro de téléphone a bien été modifié",
        type: "success",
        timer: 1500,
      });
    }
  }, [isLoadingSave])

  const onPseudoModificationValidate = async () => {
    if (!user) return;
    try {
      // update user here and not in redux to get error if pseudo already exists
      await API.updateUser({
        query: {
          user: { username, _id: user._id },
          action: "modify-my-details",
        },
      });
    } catch (error) {
      Swal.fire({
        title: "Oh non!",
        text: "Ce pseudo est déjà pris ",
        type: "error",
        timer: 1500,
      });
      return;
    }

    dispatch(fetchUserActionCreator());

    Swal.fire({
      title: "Yay...",
      text: "Votre pseudo a bien été modifié",
      type: "success",
      timer: 1500,
    });
    setIsPseudoModifyDisabled(true);
  };

  useEffect(() => {
    setUsername(user ? user.username : "");
    setEmail(user ? user.email : "");
    setPhone(user ? user.phone : "");
    window.scrollTo(0, 0);
  }, [user]);
  if (isLoadingFetch)
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Navigation selected="profil" />
        <UserProfileLoading t={t} />
      </div>
    );

  if (!user) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Navigation selected="profil" />
        <MainContainer>
          <ErrorContainer>
            {t(
              "UserProfile.ErreurChargement",
              "Une erreur est survenue, veuillez recharger la page !"
            )}
          </ErrorContainer>
        </MainContainer>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Navigation selected="profil" />
      <MainContainer className={styles.container}>
        <ProfilePictureContainer>
          <Image
            src={getUserImage(user)}
            alt="my-image"
            className={styles.user_img}
            width={160}
            height={160}
            objectFit="contain"
          />
          <UserName>{user.username}</UserName>
          <FButton
            type="dark"
            name="upload-outline"
            className="position-relative mb-16"
          >
            <Input
              type="file"
              id="picture"
              name="structure"
              accept="image/*"
              onChange={handleFileInputChange}
            />
            {isPictureUploading && (
              <Spinner color="success" className="ml-10" />
            )}
            {!isPictureUploading &&
              t("UserProfile.Modifier ma photo", "Modifier ma photo")}
          </FButton>
          <DescriptionText>
            {t(
              "UserProfile.photoUsage",
              "Votre photo apparaîtra sur les fiches auxquelles vous allez contribuer."
            )}
          </DescriptionText>
        </ProfilePictureContainer>
        <ProfileContainer>
          <div>
            <Title>
              {t("UserProfile.votre pseudo", "Votre pseudonyme")}
            </Title>
            <RowContainer>
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
              <div>
                <FButton
                  disabled={isPseudoModifyDisabled}
                  type="validate-light"
                  name="save-outline"
                  className="ml-8"
                  onClick={onPseudoModificationValidate}
                  testid="test-save-pseudo"
                >
                  {t("UserProfile.Enregistrer", "Enregistrer")}
                </FButton>
              </div>
            </RowContainer>
            <DescriptionText>
              {t(
                "UserProfile.pseudoExplication",
                "Ce pseudonyme est public. Il apparaître sur les fiches auxquelles vous allez contribuer."
              )}
            </DescriptionText>
          </div>
          <div>
            <Title marginTop={24}>
              {t("Register.Votre email", "Votre email")}
            </Title>
            <RowContainer>
              <FInputContainer>
                <FInput
                  id="email"
                  value={email}
                  onChange={onChange}
                  newSize={true}
                  autoFocus={false}
                  prepend
                  prependName="email-outline"
                  placeholder={t(
                    "Register.Renseignez votre adresse email",
                    "Renseignez votre adresse email"
                  )}
                />
              </FInputContainer>
              <div>
                <FButton
                  disabled={isEmailModifyDisabled}
                  type="validate-light"
                  name="save-outline"
                  className="ml-8"
                  onClick={onEmailModificationValidate}
                  testid="test-save-email"
                >
                  {t("UserProfile.Enregistrer", "Enregistrer")}
                </FButton>
              </div>
            </RowContainer>
            {notEmailError && (
              <ErrorMessageContainer>
                {`${t("Register.Ceci n'est pas un email,")} ${t("Register.vérifiez l'orthographe")}`}
              </ErrorMessageContainer>
            )}
            <DescriptionText>
              {t(
                "UserProfile.emailExplication",
                "Votre email sera utilisé seulement en cas de réinitialisation de votre mot de passe et pour des notifications liées à votre activité sur le site."
              )}
            </DescriptionText>
          </div>
          {showPhone &&
            <div>
              <Title marginTop={24}>
                {t("Register.Votre numéro de téléphone", "Votre numéro de téléphone")}
              </Title>
              <RowContainer>
                <FInputContainer>
                  <FInput
                    id="phone"
                    inputClassName="phone-user-input"
                    value={phone}
                    onChange={onChange}
                    newSize={true}
                    autoFocus={false}
                    prepend
                    prependName="smartphone-outline"
                    error={!user.phone && !phone}
                    placeholder={(!user.phone && !phone) ?
                      t(
                        "Register.Aucun numéro de téléphone",
                        "Aucun numéro de téléphone")
                      : t(
                        "Register.Renseignez votre numéro de téléphone",
                        "Renseignez votre numéro de téléphone")
                    }
                  />
                </FInputContainer>
                <div>
                  <FButton
                    disabled={isPhoneModifyDisabled}
                    type="validate-light"
                    name="save-outline"
                    className="ml-8"
                    onClick={onPhoneModificationValidate}
                    testid="test-save-phone"
                  >
                    {t("UserProfile.Enregistrer", "Enregistrer")}
                  </FButton>
                </div>
              </RowContainer>
              {notPhoneError && (
                <ErrorMessageContainer>
                  {t("Ceci n'est pas un numéro de téléphone valide, vérifiez votre saisie")}
                </ErrorMessageContainer>
              )}
              <DescriptionText>
                {t(
                  "UserProfile.phoneExplication",
                  "Si vous modifiez votre numéro de téléphone, un code de confirmation vous sera demandé pour mettre à jour la double authentification."
                )}
              </DescriptionText>
            </div>
          }
          <Title marginTop={24}>
            {t("UserProfile.Votre mot de passe", "Votre mot de passe")}
          </Title>
          {!isModifyPasswordOpen && (
            <FButton
              type="dark"
              name="edit-outline"
              onClick={openModifyPassword}
              testid="test-modify-password"
            >
              {t(
                "UserProfile.modifyPassword",
                "Modifier mon mot de passe"
              )}
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
                    isCurrentPasswordVisible
                      ? "eye-off-2-outline"
                      : "eye-outline"
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
                  t={t}
                  passwordScore={newPasswordScore}
                />
              </FInputContainer>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: "16px",
                }}
              >
                {isChangePasswordLoading ? (
                  <FButton
                    disabled={true}
                    type="validate-light"
                    name="save-outline"
                    className="mt-8"
                    onClick={modifyPassword}
                  >
                    <Spinner />
                  </FButton>
                ) : (
                  <FButton
                    disabled={newPasswordScore < 1 || !currentPassword}
                    type="validate-light"
                    name="save-outline"
                    onClick={modifyPassword}
                    testid="test-save-password"
                  >
                    {t("UserProfile.Enregistrer", "Enregistrer")}
                  </FButton>
                )}
              </div>
            </>
          )}
        </ProfileContainer>
      </MainContainer>
      <CodePhoneValidationModal
        visible={codePhoneModalVisible}
        onValidate={onSubmitCode}
        isLoading={isLoadingSave}
        t={t}
        code={code}
        error={errorSave}
        phone={phone || ""}
        toggle={() => setCodePhoneModalVisible(false)}
        onChange={(e: Event) => setCode(e.target.value)}
      ></CodePhoneValidationModal>
    </div>
  );
};

export default UserProfile;
