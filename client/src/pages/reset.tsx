import React, { useState, useEffect, ReactElement } from "react";
import { Form } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import setAuthToken from "utils/setAuthToken";
import { fetchUserActionCreator } from "services/User/user.actions";
import {
  fetchLanguesActionCreator,
  toggleLangueActionCreator,
  toggleLangueModalActionCreator,
} from "services/Langue/langue.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { showLangModalSelector, allLanguesSelector } from "services/Langue/langue.selectors";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import PasswordField from "components/Pages/register/PasswordField";
import FButton from "components/UI/FButton/FButton";
import LanguageModal from "components/Modals/LanguageModal/LanguageModal";
import LanguageBtn from "components/UI/LanguageBtn/LanguageBtn";
import { cls } from "lib/classname";
import API from "utils/API";

import { colors } from "colors";
import styles from "scss/components/login.module.scss";
import SEO from "components/Seo";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { getPath, PathNames } from "routes";
import PhoneAndEmailFields from "components/Pages/login/PhoneAndEmailFields";
import CodeField from "components/Pages/login/CodeField";
import Footer from "components/Pages/login/Footer";

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

type Structure = {
  nom: string;
  picture: {
    secure_url: string;
  };
};

const Reset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [resetPasswordToken, setResetPasswordToken] = useState("");

  // 2FA
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [smsSentTo, setSmsSentTo] = useState("");
  const [structure, setStructure] = useState<Structure | null>(null);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(0);
  const [wrongAdminCodeError, setWrongAdminCodeError] = useState(false);
  const [newHasStructureWithoutPhoneOrEmail, setNewHasStructureWithoutPhoneOrEmail] = useState(false);
  const [unexpectedError, setUnexpectedError] = useState(false);
  const [samePasswordError, setSamePasswordError] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const showLangModal = useSelector(showLangModalSelector);
  const langues = useSelector(allLanguesSelector);
  const isLanguagesLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_LANGUES));

  useEffect(() => {
    dispatch(fetchLanguesActionCreator());
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setIsLoading(false);
      setIsError(true);
      return;
    }
    API.checkResetToken(token)
      .then(() => {
        setIsLoading(false);
        setResetPasswordToken(token);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [dispatch, router.query.id]);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const send = (e: any) => {
    e.preventDefault();
    setSamePasswordError(false);
    if (newPassword.length === 0) {
      Swal.fire({
        title: "Oops...",
        text: "Aucun mot de passe n'est renseigné !",
        icon: "error",
        timer: 1500,
      });
      return;
    }

    const user = {
      newPassword: newPassword,
      reset_password_token: resetPasswordToken,
      code,
      email,
      phone,
    };
    API.set_new_password(user)
      .then((data) => {
        Swal.fire({
          title: "Yay...",
          text: "Modification du mot de passe réussie !",
          icon: "success",
          timer: 1500,
        }).then(() => {
          localStorage.setItem("token", data.data.token);
          setAuthToken(data.data.token);
          dispatch(fetchUserActionCreator());
          router.push("/");
        });
      })
      .catch((e) => {
        if (e.response.status === 501) {
          setStep(2);
          setNewHasStructureWithoutPhoneOrEmail(false);
          setSmsSentTo(e.response?.data?.phone || "");
        } else if (e.response.status === 402) {
          setWrongAdminCodeError(true);
        } else if (e.response.status === 502) {
          setStep(1);
          setNewHasStructureWithoutPhoneOrEmail(true);
          setEmail(e.response?.data?.email || "");
          setStructure(e.response?.data?.structure);
        } else if (e.response.status === 400 && e.response.data.code === "USED_PASSWORD") {
          setSamePasswordError(true);
        } else {
          setUnexpectedError(true);
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

  const getFormTemplate = () => {
    if (step === 0) {
      // STEP 0: New password
      return (
        <PasswordField
          id="newPassword"
          value={newPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
          passwordVisible={passwordVisible}
          onShowPassword={togglePasswordVisibility}
          weakPasswordError={null}
          nextButtonText={t("Valider", "Valider")}
        />
      );
    } else if (step === 1) {
      // STEP 1: No phone
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
      // STEP 2: 2FA code
      <CodeField
        value={code}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
        wrongAdminCodeError={wrongAdminCodeError}
      />
    );
  };

  if (isLoading) {
    return (
      <div className={styles.reset_loading_access}>
        <SEO />
        <h3>
          {t("Login.Chargement des données utilisateur", "Chargement des données utilisateur")}
          ...
        </h3>
      </div>
    );
  } else if (isError) {
    return (
      <div className={styles.reset_loading_access}>
        <SEO />
        <h5>
          {t(
            "Login.Problème mdp",
            "Un problème est survenu au moment de réinitialiser le mot de passe. Merci d'essayer à nouveau",
          )}
          ...
        </h5>
        <Link legacyBehavior href={getPath("/login", router.locale)} passHref>
          <FButton tag="a" fill={colors.gray90} name="arrow-back-outline">
            {t("Login.Revenir à la page de connexion", "Revenir à la page de connexion")}
          </FButton>
        </Link>
      </div>
    );
  }

  const getSubtitle = () => {
    if (step === 0) {
      {
        t("Reset.Entrez votre nouveau mot de passe", "Entrez votre nouveau mot de passe");
      }
    }
    if (newHasStructureWithoutPhoneOrEmail) {
      return "";
    }

    if (step === 2) {
      return t("Login.code_sent_sms", { phone: smsSentTo });
    }
    return "";
  };

  return (
    <main className={styles.main}>
      <SEO />
      <div className={styles.container}>
        <ContentContainer>
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
            {t("Login.Centre d'aide", "Centre d'aide")}
          </FButton>
          <StyledHeader>
            {step !== 2
              ? t("Reset.Réinitialisation du mot de passe", "Réinitialisation du mot de passe")
              : t("Login.Double authentification", "Double authentification ")}
          </StyledHeader>
          <StyledEnterValue>{getSubtitle()}</StyledEnterValue>
          <Form onSubmit={send}>{getFormTemplate()}</Form>

          {samePasswordError && (
            <div className={cls(styles.error_message, "fw-bold")}>
              {t("Login.same_password_error", "Le mot de passe ne peut pas être identique à l'ancien mot de passe.")}
            </div>
          )}

          {step === 2 && (
            <Footer
              step={2}
              resetPassword={() => {}}
              resetPasswordNotPossible={false}
              resetPasswordPossible={false}
              login={send}
              unexpectedError={unexpectedError}
              newAdminWithoutPhoneOrEmail={false}
              newHasStructureWithoutPhoneOrEmail={newHasStructureWithoutPhoneOrEmail}
              userDeletedError={false}
            />
          )}
        </ContentContainer>
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

export default Reset;

// override default layout
Reset.getLayout = (page: ReactElement) => page;
