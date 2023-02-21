import React, { useState, useEffect, ReactElement } from "react";
import { Form } from "reactstrap";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import {
  fetchLanguesActionCreator,
  toggleLangueActionCreator,
  toggleLangueModalActionCreator,
} from "services/Langue/langue.actions";
import { fetchUserActionCreator } from "services/User/user.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { showLangModalSelector, allLanguesSelector } from "services/Langue/langue.selectors";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import API from "utils/API";
import setAuthToken from "utils/setAuthToken";
import LanguageBtn from "components/UI/LanguageBtn/LanguageBtn";
import FButton from "components/UI/FButton/FButton";
import LanguageModal from "components/Modals/LanguageModal/LanguageModal";
import GoBackButton from "components/Pages/login/GoBackButton";
import Footer from "components/Pages/login/Footer";
import CodeField from "components/Pages/login/CodeField";
import PasswordField from "components/Pages/login/PasswordField";
import PhoneAndEmailFields from "components/Pages/login/PhoneAndEmailFields";
import UsernameField from "components/Pages/login/UsernameField";
import { colors } from "colors";
import styles from "scss/components/login.module.scss";
import SEO from "components/Seo";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { getPath, PathNames } from "routes";
import { LoginRequest } from "api-types";

type Structure = {
  nom: string;
  picture: {
    secure_url: string;
  };
};

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [smsSentTo, setSmsSentTo] = useState("");
  const [structure, setStructure] = useState<Structure | null>(null);
  const [step, setStep] = useState(0);
  const [noUserError, setNoUserError] = useState(false);
  const [wrongPasswordError, setWrongPasswordError] = useState(false);
  const [resetPasswordNotPossible, setResetPasswordNotPossible] = useState(false);
  const [resetPasswordPossible, setResetPasswordPossible] = useState(false);
  const [wrongAdminCodeError, setWrongAdminCodeError] = useState(false);
  const [unexpectedError, setUnexpectedError] = useState(false);
  const [newAdminWithoutPhoneOrEmail, setNewAdminWithoutPhoneOrEmail] = useState(false);
  const [newHasStructureWithoutPhoneOrEmail, setNewHasStructureWithoutPhoneOrEmail] = useState(false);
  const [userDeletedError, setUserDeletedError] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const showLangModal = useSelector(showLangModalSelector);
  const langues = useSelector(allLanguesSelector);
  const isLanguagesLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_LANGUES));

  useEffect(() => {
    dispatch(fetchLanguesActionCreator());
    if (API.isAuth()) {
      const { query } = router;
      if (query.redirect) {
        router.push(query.redirect as string);
      } else {
        router.push("/");
      }
    }
  }, [dispatch, router]);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const goBack = () => {
    setStep(0);
    setPassword("");
    setSmsSentTo("");
    setStructure(null);
    setWrongPasswordError(false);
    setResetPasswordNotPossible(false);
    setResetPasswordPossible(false);
    setWrongAdminCodeError(false);
    setUnexpectedError(false);
    setNewAdminWithoutPhoneOrEmail(false);
    setNewHasStructureWithoutPhoneOrEmail(false);
  };

  const resetPassword = () => {
    API.resetPassword({ username })
      .then((data) => {
        setResetPasswordPossible(true);
        setEmail(data.data.data.email);
      })
      .catch((e) => {
        if (e.response.status === 403) {
          setResetPasswordNotPossible(true);
        }
      });
  };

  const changeLanguage = (lng: string) => {
    dispatch(toggleLangueActionCreator(lng));
    const { pathname, query } = router;
    router.push(
      {
        pathname: getPath(pathname as PathNames, lng),
        query,
      },
      undefined,
      { locale: lng },
    );

    if (showLangModal) {
      dispatch(toggleLangueModalActionCreator());
    }
  };

  const login = () => {
    const user: LoginRequest = {
      username,
      password,
      code,
      email,
      phone,
    };
    API.login(user)
      .then((data) => {
        const token = data.data.data.token;

        Swal.fire({
          title: "Yay...",
          text: t("Authentification réussie !", "Authentification réussie !"),
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
        localStorage.setItem("token", token);
        setAuthToken(token);
        dispatch(fetchUserActionCreator());
      })
      .catch((e) => {
        if (e.response?.data?.code === "NO_CODE_SUPPLIED") {
          setStep(2);
          setNewAdminWithoutPhoneOrEmail(false);
          setNewHasStructureWithoutPhoneOrEmail(false);
          setSmsSentTo(e.response?.data?.phone || "");
        } else if (["INVALID_PASSWORD", "PASSWORD_TOO_WEAK", "ADMIN_FORBIDDEN"].includes(e.response?.data?.code)) {
          setWrongPasswordError(true);
        } else if (e.response?.data?.code === "WRONG_CODE") {
          setWrongAdminCodeError(true);
        } else if (e.response?.data?.code === "NO_CONTACT") {
          if (e.response?.data?.role === "admin") {
            setNewAdminWithoutPhoneOrEmail(true);
            setEmail(e.response?.data?.email || "");
          } else {
            setNewHasStructureWithoutPhoneOrEmail(true);
            setEmail(e.response?.data?.email || "");
            setStructure(e.response?.data?.structure);
          }
        } else if (e.response?.data?.code === "USER_DELETED") {
          setUserDeletedError(true);
        } else {
          setUnexpectedError(true);
        }
      });
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    setWrongPasswordError(false);

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
      API.checkUserExists(username)
        .then(() => setStep(1))
        .catch(() => setNoUserError(true));
    } else {
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
      login();
    }
  };

  const getHeaderText = () => {
    if (step === 0) {
      return t("Login.Content de vous revoir !", "Content de vous revoir !");
    }
    if (newAdminWithoutPhoneOrEmail) {
      return t("Login.Nouvel administrateur", "Nouvel administrateur");
    }
    if (newHasStructureWithoutPhoneOrEmail) {
      return t("Login.new_has_structure", "Nouveau responsable de structure ! 🎉");
    }
    if (resetPasswordNotPossible) {
      return t("Login.Impossible de réinitialiser", "Impossible de réinitialiser");
    }
    if (resetPasswordPossible) {
      return t("Login.Réinitialisation du mot de passe", "Un lien de réinitialisation a été envoyé");
    }
    if (step === 1) {
      return t("Login.Bonjour", "Bonjour ") + username + " !";
    }
    if (step === 2) {
      return t("Login.Double authentification", "Double authentification ");
    }
    return "";
  };

  const getHashedEmail = () => {
    const splittedEmailArray = email.split("@");
    if (splittedEmailArray.length === 2) {
      const prefixEmail = splittedEmailArray[0];
      const suffixEmail = splittedEmailArray[1];
      const hashLength = prefixEmail.length - 2 > 0 ? prefixEmail.length - 2 : 0;
      const hashedPrefix = prefixEmail.substring(0, 2) + "*".repeat(hashLength);
      return hashedPrefix + "@" + suffixEmail;
    }
    return "";
  };

  const getSubtitle = () => {
    if (step === 0) {
      return t("Login.Entrez votre pseudonyme", "Entrez votre pseudonyme");
    }

    if (newAdminWithoutPhoneOrEmail) {
      return t("Login.Entrez votre numéro et votre email", "Entrez votre numéro et votre email");
    }
    if (newHasStructureWithoutPhoneOrEmail) {
      return null;
    }
    if (step === 1) {
      return t("Login.Entrez votre mot de passe", "Entrez votre mot de passe");
    }

    if (step === 2) {
      return t("Login.code_sent_sms", { phone: smsSentTo });
    }
    return "";
  };

  const getFormTemplate = () => {
    if (step === 0) {
      // STEP 0: username
      return (
        <UsernameField
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          noUserError={noUserError}
        />
      );
    } else if (step === 1) {
      // STEP 1: password or contact infos
      if (newAdminWithoutPhoneOrEmail && !wrongPasswordError) {
        return (
          <PhoneAndEmailFields
            phone={phone}
            email={email}
            onChangePhone={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            onChangeEmail={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            isAdmin={true}
            structure={null}
          />
        );
      }
      if (newHasStructureWithoutPhoneOrEmail && !wrongPasswordError) {
        return (
          <PhoneAndEmailFields
            onChangePhone={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            onChangeEmail={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            phone={phone}
            email={email}
            structure={structure}
            isAdmin={false}
          />
        );
      }
      return (
        <PasswordField
          id="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          passwordVisible={passwordVisible}
          onClick={togglePasswordVisibility}
          wrongPasswordError={wrongPasswordError}
        />
      );
    }

    return (
      // STEP 2: 2FA code
      <CodeField
        value={code}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
        wrongAdminCodeError={wrongAdminCodeError}
      />
    );
  };
  return (
    <main className={styles.main}>
      <SEO title="Se connecter" />
      <div className={styles.container}>
        <div
          style={{
            paddingTop: step === 1 && newHasStructureWithoutPhoneOrEmail ? 40 : 100,
          }}
        >
          <div className={styles.header}>
            <GoBackButton step={step} goBack={goBack} />
            <div>
              <LanguageBtn />
              <FButton
                tag="a"
                href="https://help.refugies.info/fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-btn"
                type="tuto"
                name="question-mark-circle-outline"
                fill={colors.gray90}
              >
                {t("Login.Centre d'aide", "Centre d'aide")}
              </FButton>
            </div>
          </div>

          <h2 className={styles.h2}>{getHeaderText()}</h2>
          {resetPasswordNotPossible && (
            <div className={`${styles.email_message} ${styles.no_email}`}>
              {t("Login.Pas email", "Il n'y a pas d'email associé à ce pseudonyme.")}
            </div>
          )}
          {resetPasswordPossible && (
            <>
              <div className={styles.email_message}>
                {t(
                  // @ts-ignore FIXME
                  "Login.Lien réinitialisation",
                  "Un lien de réinitialisation a été envoyé à ",
                ) +
                  getHashedEmail() +
                  "."}
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  lineHeight: "20px",
                  marginBottom: "64px",
                }}
              >
                {t("Login.Réinitialisation texte", "Vous n'avez rien reçu ? Avez-vous vérifié dans vos spams ?")}
              </div>
            </>
          )}
          {!resetPasswordNotPossible && !resetPasswordPossible && (
            <>
              {!!getSubtitle() && <div className={styles.label}>{getSubtitle()}</div>}
              <Form onSubmit={submitForm}>{getFormTemplate()}</Form>
            </>
          )}
          <Footer
            step={step}
            resetPassword={resetPassword}
            resetPasswordNotPossible={resetPasswordNotPossible}
            resetPasswordPossible={resetPasswordPossible}
            login={login}
            unexpectedError={unexpectedError}
            newAdminWithoutPhoneOrEmail={newAdminWithoutPhoneOrEmail}
            newHasStructureWithoutPhoneOrEmail={newHasStructureWithoutPhoneOrEmail}
            userDeletedError={userDeletedError}
          />
        </div>
        <LanguageModal
          show={showLangModal}
          currentLanguage={router.locale || "fr"}
          toggle={() => dispatch(toggleLangueModalActionCreator())}
          changeLanguage={changeLanguage}
          languages={langues}
          isLanguagesLoading={isLanguagesLoading}
        />
      </div>
    </main>
  );
};

export const getStaticProps = defaultStaticProps;

export default Login;

// override default layout
Login.getLayout = (page: ReactElement) => page;
