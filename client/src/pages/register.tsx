import React, { useState, useEffect, ReactElement } from "react";
import { Form } from "reactstrap";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { fetchUserActionCreator } from "services/User/user.actions";
import styled from "styled-components";
import { colors } from "colors";

import { fetchLanguesActionCreator, toggleLangueModalActionCreator } from "services/Langue/langue.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { showLangModalSelector, allLanguesSelector } from "services/Langue/langue.selectors";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import LanguageModal from "components/Modals/LanguageModal/LanguageModal";
import { Gauge } from "components/UI/Gauge/Gauge";
import LanguageBtn from "components/UI/LanguageBtn/LanguageBtn";
import FButton from "components/UI/FButton/FButton";
import GoBackButton from "components/Pages/register/GoBackButton";
import PasswordField from "components/Pages/register/PasswordField";
import UsernameField from "components/Pages/register/UsernameField";
import EmailField from "components/Pages/register/EmailField";
import Footer from "components/Pages/register/Footer";
import API from "utils/API";
import { setAuthToken } from "utils/authToken";
import { logger } from "logger";
import styles from "scss/components/login.module.scss";
import SEO from "components/Seo";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { LoginRequest } from "@refugies-info/api-types";
import { useChangeLanguage } from "hooks";

const StyledHeader = styled.h4`
  font-weight: 600;
  color: #0421b1;
  margin-top: 64px;
`;
const StyledEnterValue = styled.p`
  font-weight: bold;
  margin-top: 64px;
  margin-bottom: 16px;
`;

const ContentContainer = styled.div`
  padding-top: 100px;
`;
const EmailPrecisions = styled.p`
  margin-top: 16px;
`;

const Register = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(0);
  const [weakPasswordError, setWeakPasswordError] = useState(false);
  const [unexpectedError, setUnexpectedError] = useState(false);
  const [pseudoAlreadyTaken, setPseudoAlreadyTaken] = useState(false);
  const [notEmailError, setNotEmailError] = useState(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const showLangModal = useSelector(showLangModalSelector);
  const langues = useSelector(allLanguesSelector);
  const isLanguagesLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_LANGUES));

  useEffect(() => {
    if (router.query.username) {
      setUsername(router.query.username as string);
    }
  }, [router.query.username]);

  useEffect(() => {
    dispatch(fetchLanguesActionCreator());
    if (API.isAuth()) router.push("/");
  }, [dispatch, router]);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const goBack = () => {
    setStep(0);
    setPassword("");
    setPseudoAlreadyTaken(false);
  };

  const { changeLanguage } = useChangeLanguage();
  const changeLanguageCallback = (lng: string) => {
    changeLanguage(lng, "push");
    if (showLangModal) {
      dispatch(toggleLangueModalActionCreator());
    }
  };

  const login = () => {
    const user: LoginRequest = {
      username,
      password,
      email,
    };
    logger.info("[Register] register attempt for user", {
      username: user.username,
      email: user.email,
    });
    API.login(user)
      .then((data) => {
        const token = data.token;
        logger.info("[Register] user successfully registered", {
          username: user.username,
        });
        Swal.fire({
          title: "Yay...",
          text: t("authenticated_successfully", "Authentification réussie !"),
          icon: "success",
          timer: 1500,
        }).then(() => {
          const { query } = router;
          if (query.redirect) {
            router.push(query.redirect as string);
          } else {
            router.push("/");
          }
        });

        setAuthToken(token);
        dispatch(fetchUserActionCreator());
      })
      .catch((e) => {
        logger.error("[Register] error while registering", {
          username: user.username,
          error: e,
        });
        if (e.response?.data?.code === "PASSWORD_TOO_WEAK") {
          setWeakPasswordError(true);
          setStep(1);
        } else {
          setUnexpectedError(true);
        }
      });
  };

  const submitForm = (e: any) => {
    e.preventDefault();

    if (step === 0) {
      // validate pseudo
      if (username.length === 0) {
        Swal.fire({
          title: "Oops...",
          text: "Aucun nom d'utilisateur n'est renseigné !",
          icon: "error",
          timer: 1500,
        });
        return;
      }
      API.checkUserExists(encodeURIComponent(username))
        .then(() => {
          logger.info("[Register] check if pseudo already exists", { username });
          logger.info("[Register] pseudo already exists", { username });
          setPseudoAlreadyTaken(true);
        })
        .catch(() => {
          logger.info("[Register] pseudo available", { username });
          setStep(1);
        });
    } else if (step === 1) {
      // password check
      if (password.length === 0) {
        Swal.fire({
          title: "Oops...",
          text: "Aucun mot de passe n'est renseigné !",
          icon: "error",
          timer: 1500,
        });
        return;
      }

      setStep(2);
    } else if (step === 2) {
      // email check
      if (email) {
        logger.info("[Register] checking email", {
          username: username,
          email: email,
        });
        // if there is an email, check that the string is an email
        const regex = /^\S+@\S+\.\S+$/;
        const isEmail = !!email.match(regex);
        if (isEmail) {
          login();
        } else {
          setNotEmailError(true);
        }
      }
    } else {
      login();
    }
    return;
  };

  const onLaterClick = () => {
    setEmail("");
    login();
  };

  const [headerText, setHeaderText] = useState("");
  const [subtitleText, setSubtitleText] = useState("");

  useEffect(() => {
    switch (step) {
      case 0:
        setHeaderText(t("Register.new_account", "Créer un nouveau compte"));
        setSubtitleText(t("Login.Choisissez un pseudonyme", "Choisissez un pseudonyme"));
        break;
      case 1:
        setHeaderText(t("Register.Bienvenue", "Bienvenue ") + username + " !");
        setSubtitleText(t("Register.Choisissez un mot de passe", "Choisissez un mot de passe"));
        break;
      case 2:
        setHeaderText(t("Register.last_step", "Une dernière étape !"));
        setSubtitleText(t("Register.Renseignez votre adresse email", "Renseignez votre adresse email"));
        break;
      default:
        setHeaderText("");
        setSubtitleText("");
        break;
    }
  }, [step, username, t]);

  return (
    <main className={styles.main}>
      <SEO title="Créer un nouveau compte" />
      <div className={styles.container}>
        <ContentContainer>
          <GoBackButton step={step} goBack={goBack} />
          <LanguageBtn />
          <FButton
            tag="a"
            href="https://help.refugies.info/fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-btn"
            type="help"
            name="question-mark-circle-outline"
            fill={colors.gray90}
          >
            {t("Login.help_center", "Centre d'aide")}
          </FButton>
          <StyledHeader>{headerText}</StyledHeader>
          <StyledEnterValue>{subtitleText}</StyledEnterValue>
          <Form onSubmit={submitForm}>
            {step === 0 ? (
              <UsernameField
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                step={step}
                key="username-field"
                pseudoAlreadyTaken={pseudoAlreadyTaken}
              />
            ) : step === 1 ? (
              <PasswordField
                id="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                passwordVisible={passwordVisible}
                onShowPassword={togglePasswordVisibility}
                weakPasswordError={weakPasswordError}
                nextButtonText={t("Suivant", "Suivant")}
              />
            ) : (
              <EmailField
                id="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                notEmailError={notEmailError}
              />
            )}
          </Form>
          {step === 2 && (
            <>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <FButton type="validate-light" name="checkmark-outline" disabled={!email} onClick={submitForm}>
                  {t("Valider", "Valider")}
                </FButton>
                <div style={{ marginLeft: "8px" }}>
                  <FButton type="default" name="arrowhead-right-outline" onClick={onLaterClick}>
                    {t("Plus tard", "Plus tard")}
                  </FButton>
                </div>
              </div>
              {notEmailError && (
                <div className={styles.error_message}>
                  <b>{t("Register.not_an_email", "Ceci n'est pas un email,")}</b>{" "}
                  {t("Register.check_mail", "vérifiez l'orthographe.")}
                </div>
              )}
              <EmailPrecisions>
                {t("Register.Email infos", "Nécessaire pour réinitialiser votre mot de passe en cas d'oubli.")}
              </EmailPrecisions>{" "}
            </>
          )}
          <Footer step={step} unexpectedError={unexpectedError} />
          <Gauge step={step} />
        </ContentContainer>
        <LanguageModal
          show={showLangModal}
          currentLanguage={router.locale || "fr"}
          toggle={() => dispatch(toggleLangueModalActionCreator())}
          changeLanguage={changeLanguageCallback}
          languages={langues}
          isLanguagesLoading={isLanguagesLoading}
        />
      </div>
    </main>
  );
};

export const getStaticProps = defaultStaticProps;

export default Register;

// override default layout
Register.getLayout = (page: ReactElement) => page;
