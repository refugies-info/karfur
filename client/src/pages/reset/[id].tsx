import React, { useState, useEffect, ReactElement } from "react";
import { Form } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import i18n from "i18n";
import setAuthToken from "utils/setAuthToken";
import { fetchUserActionCreator } from "services/User/user.actions";
import {
  fetchLanguesActionCreator,
  toggleLangueActionCreator,
  toggleLangueModalActionCreator,
} from "services/Langue/langue.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import {
  showLangModalSelector,
  allLanguesSelector,
} from "services/Langue/langue.selectors";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import PasswordField from "components/Pages/register/PasswordField";
import FButton from "components/FigmaUI/FButton/FButton";
import LanguageModal from "components/Modals/LanguageModal/LanguageModal";
import LanguageBtn from "components/FigmaUI/LanguageBtn/LanguageBtn";
import GoBackButton from "components/Pages/register/GoBackButton";
import { computePasswordStrengthScore } from "lib/index";
import API from "utils/API";

import { colors } from "colors";
import styles from "scss/components/login.module.scss";

const StyledHeader = styled.div`
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  color: #0421b1;
  margin-top: 64px;
`;

const StyledEnterValue = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-top: 64px;
  margin-bottom: 16px;
`;

const ContentContainer = styled.div`
  padding-top: 100px;
`;

const Reset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [resetPasswordToken, setResetPasswordToken] = useState("");

  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const showLangModal = useSelector(showLangModalSelector);
  const langues = useSelector(allLanguesSelector);
  const isLanguagesLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_LANGUES)
  );

  useEffect(() => {
    dispatch(fetchLanguesActionCreator());
    const token = Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id;
    if (!token) {
      setIsLoading(false);
      setIsError(true);
      return;
    }
    API.get_users({
      query: {
        token,
        reset_password_expires: { $gt: Date.now() },
      },
    })
      .then((data) => {
        const users = data.data.data;
        if (users && users.length === 1) {
          setIsLoading(false);
          setResetPasswordToken(token);
        } else {
          setIsLoading(false);
          setIsError(true);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [dispatch, router.query.id]);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () =>
    setPasswordVisible(!setPasswordVisible);

  const send = () => {
    if (newPassword.length === 0) {
      Swal.fire({
        title: "Oops...",
        text: "Aucun mot de passe n'est renseigné !",
        type: "error",
        timer: 1500,
      });
      return;
    }

    if ((computePasswordStrengthScore(newPassword) || {}).score < 1) {
      Swal.fire({
        title: "Oops...",
        text: "Le mot de passe est trop faible",
        type: "error",
        timer: 1500,
      });
      return;
    }
    const user = {
      newPassword: newPassword,
      reset_password_token: resetPasswordToken,
    };
    API.set_new_password(user)
      .then((data) => {
        Swal.fire({
          title: "Yay...",
          text: "Modification du mot de passe réussie !",
          type: "success",
          timer: 1500,
        }).then(() => {
          router.push("/");
        });
        localStorage.setItem("token", data.data.token);
        setAuthToken(data.data.token);
        dispatch(fetchUserActionCreator());
      })
      .catch(() => {});
  };

  const changeLanguage = (lng: string) => {
    dispatch(toggleLangueActionCreator(lng));
    if (i18n.getResourceBundle(lng, "translation")) {
      i18n.changeLanguage(lng);
    }
    if (showLangModal) {
      dispatch(toggleLangueModalActionCreator());
    }
  };

  if (isLoading) {
    return (
      <div className="loading-access">
        <h3>
          {t(
            "Login.Chargement des données utilisateur",
            "Chargement des données utilisateur"
          )}
          ...
        </h3>
      </div>
    );
  } else if (isError) {
    return (
      <div className="loading-access">
        <h5>
          {t(
            "Login.Problème mdp",
            "Un problème est survenu au moment de réinitialiser le mot de passe. Merci d'essayer à nouveau"
          )}
          ...
        </h5>
        <Link href="/login" passHref>
          <FButton tag="a" fill={colors.noir} name="arrow-back-outline">
            {t(
              "Login.Revenir à la page de connexion",
              "Revenir à la page de connexion"
            )}
          </FButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="app">
      <div className={styles.container}>
        <ContentContainer>
          {/* <GoBackButton step={step} goBack={goBack} /> */}
          <LanguageBtn />
          <FButton
            tag="a"
            href="https://help.refugies.info/fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-btn"
            type="help"
            name="question-mark-circle-outline"
            fill={colors.noir}
          >
            {t("Login.Centre d'aide", "Centre d'aide")}
          </FButton>
          <StyledHeader>
            {t(
              "Reset.Réinitialisation du mot de passe",
              "Réinitialisation du mot de passe"
            )}
          </StyledHeader>
          <StyledEnterValue>
            {t(
              "Reset.Entrez votre nouveau mot de passe",
              "Entrez votre nouveau mot de passe"
            )}
          </StyledEnterValue>
          <Form onSubmit={send}>
            <PasswordField
              id="newPassword"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
              passwordVisible={passwordVisible}
              onShowPassword={togglePasswordVisibility}
              weakPasswordError={null}
              nextButtonText={t("Valider", "Valider")}
            />
          </Form>
        </ContentContainer>
        <LanguageModal
          show={showLangModal}
          currentLanguage={i18n.language}
          toggle={() => dispatch(toggleLangueModalActionCreator())}
          changeLanguage={changeLanguage}
          languages={langues}
          isLanguagesLoading={isLanguagesLoading}
        />
      </div>
    </div>
  );
};

export default Reset;

// override default layout
Reset.getLayout = (page: ReactElement) => page;
