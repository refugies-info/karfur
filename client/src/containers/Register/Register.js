import React, { Component } from "react";
import { Form, Progress } from "reactstrap";
import i18n from "../../i18n";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageBtn from "../../components/FigmaUI/LanguageBtn/LanguageBtn";
import API from "../../utils/API";
import setAuthToken from "../../utils/setAuthToken";
import FButton from "../../components/FigmaUI/FButton/FButton";
import FInput from "../../components/FigmaUI/FInput/FInput";
import { fetchUserActionCreator } from "../../services/User/user.actions";
import styled from "styled-components";
import LanguageModal from "../../components/Modals/LanguageModal/LanguageModal";
import { Gauge } from "../../components/UI/Gauge/Gauge";
import { colors } from "colors";
import {
  fetchLanguesActionCreator,
  toggleLangueActionCreator,
  toggleLangueModalActionCreator,
} from "../../services/Langue/langue.actions";
import { logger } from "../../logger";
import { colorAvancement } from "../../components/Functions/ColorFunctions";
import img from "../../assets/login_background.svg";
import { LoadingStatusKey } from "../../services/LoadingStatus/loadingStatus.actions";
import { computePasswordStrengthScore } from "../../lib/index";

const StyledHeader = styled.div`
  font-weight: 500;
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

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  flex-direction: column;
  background-image: url(${img});
  background-color: #fbfbfb;
`;

const ContentContainer = styled.div`
  padding-top: 100px;
`;

const AlreadyAccountContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  line-height: 20px;
  color: #828282;
  margin-top: 16px;
`;

const ErrorMessageContainer = styled.div`
  color: #e8140f;
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
`;

const GoBackButton = (props) => {
  if (props.step === 0) {
    return (
      <NavLink to="/">
        <FButton
          type="light-action"
          name="arrow-back-outline"
          className="mr-10"
        >
          {props.t("Retour", "Retour")}
        </FButton>
      </NavLink>
    );
  }

  return (
    <FButton
      type="light-action"
      name="arrow-back-outline"
      className="mr-10"
      onClick={props.goBack}
    >
      {props.t("Retour", "Retour")}
    </FButton>
  );
};

export class Register extends Component {
  state = {
    username: "",
    password: "",
    email: "",
    passwordVisible: false,
    step: 0,
    weakPasswordError: false,
    unexpectedError: false,
    pseudoAlreadyTaken: false,
    notEmailError: false,
  };

  componentDidMount() {
    this.props.fetchLangues();
    if (API.isAuth()) {
      return this.props.history.push("/");
    }
    window.scrollTo(0, 0);
  }

  togglePasswordVisibility = () =>
    this.setState((pS) => ({ passwordVisible: !pS.passwordVisible }));

  goBack = () =>
    this.setState({
      step: 0,
      password: "",
      pseudoAlreadyTaken: false,
    });

  changeLanguage = (lng) => {
    this.props.toggleLangue(lng);
    if (this.props.i18n.getResourceBundle(lng, "translation")) {
      this.props.i18n.changeLanguage(lng);
    }
    if (this.props.showLangModal) {
      this.props.toggleLangueModal();
    }
  };

  /**
   * Codes returned by login when register
   * 401 : weak password
   * 403 : user creation not possible from api
   * 500 : internal error
   * 200: ok
   */

  login = () => {
    const user = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
    };
    logger.info("[Register] register attempt for user", {
      username: user.username,
      email: user.email,
    });
    API.login(user)
      .then((data) => {
        const token = data.data.token;
        logger.info("[Register] user successfully registered", {
          username: user.username,
        });
        Swal.fire({
          title: "Yay...",
          text: this.props.t(
            "Authentification réussie !",
            "Authentification réussie !"
          ),
          type: "success",
          timer: 1500,
        }).then(() => {
          return this.props.history.push("/");
        });
        localStorage.setItem("token", token);
        setAuthToken(token);
        this.props.fetchUser();
      })
      .catch((e) => {
        logger.error("[Register] error while registering", {
          username: user.username,
          error: e,
        });
        if (e.response.status === 401) {
          this.setState({
            weakPasswordError: true,
            step: 1,
          });
        } else {
          this.setState({ unexpectedError: true });
        }
      });
  };

  send = (e) => {
    e.preventDefault();

    // validate pseudo
    if (this.state.step === 0) {
      if (this.state.username.length === 0) {
        Swal.fire({
          title: "Oops...",
          text: "Aucun nom d'utilisateur n'est renseigné !",
          type: "error",
          timer: 1500,
        });
        return;
      }
      API.checkUserExists({ username: this.state.username }).then((data) => {
        logger.info("[Register] check if pseudo already exists", {
          username: this.state.username,
        });
        const userExists = data.status === 200;
        // if user, go to next step (password)
        if (userExists) {
          logger.info("[Register] pseudo already exists", {
            username: this.state.username,
          });
          this.setState({
            pseudoAlreadyTaken: true,
          });
        } else {
          logger.info("[Register] pseudo available", {
            username: this.state.username,
          });
          // if no user: display error
          this.setState({
            step: 1,
          });
        }
      });
    } else if (this.state.step === 1) {
      // password check
      if (this.state.password.length === 0) {
        return Swal.fire({
          title: "Oops...",
          text: "Aucun mot de passe n'est renseigné !",
          type: "error",
          timer: 1500,
        });
      }

      this.setState({ step: 2 });
    } else if (this.state.step === 2) {
      if (this.state.email) {
        logger.info("[Register] checking email", {
          username: this.state.username,
          email: this.state.email,
        });
        // if there is an email, check that the string is an email
        const regex = /^\S+@\S+\.\S+$/;
        const isEmail = !!this.state.email.match(regex);
        if (isEmail) {
          this.login();
        } else {
          this.setState({ notEmailError: true });
        }
      }
    } else {
      this.login();
    }
  };

  onLaterClick = () => {
    this.setState({ email: "" });
    this.login();
  };

  handleChange = (event) =>
    this.setState({ [event.target.id]: event.target.value });

  getHeaderText = () => {
    if (this.state.step === 0) {
      return this.props.t(
        "Register.Créer un nouveau compte",
        "Créer un nouveau compte"
      );
    }

    if (this.state.step === 1) {
      return (
        this.props.t("Register.Bienvenue", "Bienvenue ") +
        this.state.username +
        " !"
      );
    }

    if (this.state.step === 2) {
      return this.props.t("Register.Dernière étape", "Une dernière étape !");
    }
  };

  getSubtitle = () => {
    if (this.state.step === 0) {
      return this.props.t(
        "Login.Choisissez un pseudonyme",
        "Choisissez un pseudonyme"
      );
    }

    if (this.state.step === 1) {
      return this.props.t(
        "Register.Choisissez un mot de passe",
        "Choisissez un mot de passe"
      );
    }

    if (this.state.step === 2) {
      return this.props.t(
        "Register.Renseignez votre adresse email",
        "Renseignez votre adresse email"
      );
    }
  };

  render() {
    const {
      passwordVisible,
      username,
      step,
      email,
      password,
      weakPasswordError,
      unexpectedError,
      pseudoAlreadyTaken,
      notEmailError,
    } = this.state;
    const { t } = this.props;
    return (
      <div className="app">
        <MainContainer>
          <ContentContainer>
            <GoBackButton step={step} goBack={this.goBack} t={t} />
            <LanguageBtn />
            <FButton
              tag={"a"}
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
            <StyledHeader>{this.getHeaderText()}</StyledHeader>
            <StyledEnterValue>{this.getSubtitle()}</StyledEnterValue>
            <Form onSubmit={this.send}>
              {step === 0 ? (
                <UsernameField
                  value={username}
                  onChange={this.handleChange}
                  step={step}
                  key="username-field"
                  t={t}
                  pseudoAlreadyTaken={pseudoAlreadyTaken}
                />
              ) : step === 1 ? (
                <PasswordField
                  id="password"
                  value={password}
                  onChange={this.handleChange}
                  passwordVisible={passwordVisible}
                  onClick={this.togglePasswordVisibility}
                  t={t}
                  weakPasswordError={weakPasswordError}
                />
              ) : (
                <EmailField
                  id="email"
                  value={email}
                  onChange={this.handleChange}
                  t={t}
                  notEmailError={notEmailError}
                />
              )}
            </Form>
            {step === 2 && (
              <>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <FButton
                    type="validate-light"
                    name="checkmark-outline"
                    disabled={!email}
                    onClick={this.send}
                  >
                    {t("Valider", "Valider")}
                  </FButton>
                  <div style={{ marginLeft: "8px" }}>
                    <FButton
                      type="default"
                      name="arrowhead-right-outline"
                      onClick={this.onLaterClick}
                    >
                      {t("Plus tard", "Plus tard")}
                    </FButton>
                  </div>
                </div>
                {this.state.notEmailError && (
                  <ErrorMessageContainer>
                    <b>
                      {t(
                        "Register.Ceci n'est pas un email,",
                        "Ceci n'est pas un email,"
                      )}
                    </b>{" "}
                    {t(
                      "Register.vérifiez l'orthographe.",
                      "vérifiez l'orthographe."
                    )}
                  </ErrorMessageContainer>
                )}
                <EmailPrecisions>
                  {t(
                    "Register.Email infos",
                    "Nécessaire pour réinitialiser votre mot de passe en cas d'oubli."
                  )}
                </EmailPrecisions>{" "}
              </>
            )}
            <Footer step={step} t={t} unexpectedError={unexpectedError} />
            <Gauge step={step} />
          </ContentContainer>
          <LanguageModal
            show={this.props.showLangModal}
            current_language={i18n.language}
            toggle={this.props.toggleLangueModal}
            changeLanguage={this.changeLanguage}
            langues={this.props.langues}
            isLanguagesLoading={this.props.isLanguagesLoading}
          />
        </MainContainer>
      </div>
    );
  }
}

const Footer = (props) => {
  if (props.unexpectedError) {
    return (
      <ErrorMessageContainer>
        {props.t(
          "Login.Une erreur est survenue. Veuillez réessayer.",
          "Une erreur est survenue. Veuillez réessayer."
        )}
      </ErrorMessageContainer>
    );
  }

  if (props.step === 0) {
    return <PseudoFooter t={props.t} />;
  }

  return false;
};

const PseudoFooter = (props) => (
  <AlreadyAccountContainer>
    {props.t("Register.Déjà un compte ?", "Déjà un compte ?")}
    <Link
      to={{
        pathname: "/login",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          textDecoration: "underline",
          marginLeft: "5px",
        }}
      >
        {props.t("Register.Se connecter", "Se connecter")}
      </div>
    </Link>
  </AlreadyAccountContainer>
);

const EmailPrecisions = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
`;

const EmailField = (props) => (
  <>
    <FInput
      prepend
      prependName="at-outline"
      value={props.value}
      {...props}
      id="email"
      type="email"
      placeholder={props.t("Register.Votre email", "Votre email")}
      error={props.notEmailError}
      errorIcon="at"
      newSize
    />
  </>
);

const PseudoPrecisions = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: #828282;
  margin-top: 16px;
`;
const UsernameField = (props) => (
  <>
    <div
      key="username-field"
      style={{
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ marginTop: "10px" }}>
        <FInput
          prepend
          prependName="person-outline"
          id="username"
          type="username"
          placeholder={props.t("Login.Pseudonyme", "Pseudonyme")}
          autoComplete="username"
          error={props.pseudoAlreadyTaken}
          errorIcon="person"
          newSize
          {...props}
        />
      </div>
      <div style={{ marginLeft: "10px" }}>
        <FButton
          type="validate-light"
          name="arrow-forward-outline"
          disabled={!props.value}
        >
          {props.t("Suivant", "Suivant")}
        </FButton>
      </div>
    </div>
    <PseudoPrecisions>
      <div>
        {props.t(
          "Register.Pseudo usage",
          "Ce pseudonyme apparaîtra sur les fiches auxquelles vous allez contribuer."
        )}
      </div>
      <div>
        {props.t("Register.Exemples", "Exemples : Guillaume Dupont, Nora78")}
      </div>
    </PseudoPrecisions>

    {props.pseudoAlreadyTaken && (
      <ErrorMessageContainer>
        <b>
          {props.t(
            "Register.Oups, ce pseudonyme existe déjà.",
            "Oups, ce pseudonyme existe déjà."
          )}
        </b>{" "}
      </ErrorMessageContainer>
    )}
  </>
);

const ProgressContainer = styled.div`
  width: 30%;
  margin-right: 16px;
`;

const StrenghText = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
`;

const getStrength = (score) => {
  if (score > 0.75) {
    return "Fort";
  } else if (score > 0.25) {
    return "Moyen";
  }

  return "Faible";
};

const PasswordField = (props) => {
  const passwordScore = computePasswordStrengthScore(props.value).score;
  return (
    <>
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ marginTop: "10px" }}>
          <FInput
            prepend
            append
            autoFocus={props.id === "password"}
            prependName="lock-outline"
            appendName={
              props.passwordVisible ? "eye-off-2-outline" : "eye-outline"
            }
            inputClassName="password-input"
            onAppendClick={props.onClick}
            {...props}
            type={props.passwordVisible ? "text" : "password"}
            id={props.id}
            placeholder={props.t("Login.Mot de passe", "Mot de passe")}
            autoComplete="new-password"
            newSize
          />
        </div>
        <div style={{ marginLeft: "10px" }}>
          <FButton
            type="validate-light"
            name="checkmark-outline"
            disabled={passwordScore < 1}
          >
            {props.t("Suivant", "Suivant")}
          </FButton>
        </div>
      </div>
      {props.value && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "16px",
            }}
          >
            <ProgressContainer>
              <Progress
                color={colorAvancement(passwordScore / 4)}
                value={((0.1 + passwordScore / 4) * 100) / 1.1}
              />
            </ProgressContainer>
            <StrenghText>
              {props.t(
                "Register." + getStrength(passwordScore / 4),
                getStrength(passwordScore / 4)
              )}
            </StrenghText>
          </div>
        </>
      )}
      {((props.value && passwordScore < 1) || props.weakPasswordError) && (
        <ErrorMessageContainer>
          <b>
            {props.t(
              "Register.Mot de passe trop faible",
              "Oups, votre mot de passe est trop faible."
            )}
          </b>
        </ErrorMessageContainer>
      )}
    </>
  );
};

const mapDispatchToProps = {
  fetchUser: fetchUserActionCreator,
  fetchLangues: fetchLanguesActionCreator,
  toggleLangue: toggleLangueActionCreator,
  toggleLangueModal: toggleLangueModalActionCreator,
};
const mapStateToProps = (state) => {
  return {
    languei18nCode: state.langue.languei18nCode,
    showLangModal: state.langue.showLangModal,
    langues: state.langue.langues,
    isLanguagesLoading:
      state.loadingStatus[LoadingStatusKey.FETCH_LANGUES] &&
      state.loadingStatus[LoadingStatusKey.FETCH_LANGUES].isLoading,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Register));
