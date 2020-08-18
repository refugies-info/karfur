import React, { Component } from "react";
import track from "react-tracking";
import { Form } from "reactstrap";
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
import variables from "scss/colors.scss";
import {
  fetchLanguesActionCreator,
  toggleLangueActionCreator,
  toggleLangueModalActionCreator,
} from "../../services/Langue/langue.actions";

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

const PseudoForgottenContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  line-height: 20px;
  color: #828282;
  margin-top: 16px;
  font-weight: bold;
`;

const FooterLink = styled.div`
  color: #828282;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-top: 64px;
`;

const ErrorMessageContainer = styled.div`
  color: #e8140f;
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
`;

const NoEmailRelatedContainer = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: #e8140f;
  margin-top: 64px;
  margin-bottom: 64px;
`;

const EmailRelatedContainer = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-top: 64px;
  margin-bottom: 16px;
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
          {props.t("Login.Retour", "Retour")}
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
      {props.t("Login.Retour", "Retour")}
    </FButton>
  );
};

export class Register extends Component {
  state = {
    username: "",
    password: "",
    code: "",
    email: "",
    phone: "",
    passwordVisible: false,
    step: 0,
    noUserError: false,
    wrongPasswordError: false,
    wrongAdminCodeError: false,
    unexpectedError: false,
    pseudoAlreadyTaken: false,
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
      cpassword: "",
      pseudoAlreadyTaken: false,
    });

  changeLanguage = (lng) => {
    this.props.toggleLangue(lng);
    if (this.props.i18n.getResourceBundle(lng, "translation")) {
      this.props.i18n.changeLanguage(lng);
    } else {
      // eslint-disable-next-line no-console
      console.log("Resource not found in i18next.");
    }
    if (this.props.showLangModal) {
      this.props.toggleLangueModal();
    }
  };

  /**
   * Errors returned by login route
   * 400 : invalid request, no user with this pseudo
   * 500 : internal error
   * 401 : wrong password
   * 402 : wrong code (admin)
   * 404 : error sending code (admin), error creating admin account
   * 501 : no code provided (admin)
   * 200 : authentification succeeded
   * 502 : new admin without phone number or email
   */

  login = () => {
    const user = {
      username: this.state.username,
      password: this.state.password,
      code: this.state.code,
      email: this.state.email,
      phone: this.state.phone,
    };
    API.login(user)
      .then((data) => {
        const token = data.data.token;

        Swal.fire({
          title: "Yay...",
          text: "Authentification réussie !",
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
        if (e.response.status === 401) {
          this.setState({
            wrongPasswordError: true,
          });
        } else if (e.response.status === 402) {
          this.setState({ wrongAdminCodeError: true });
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
        const userExists = data.status === 200;
        // if user, go to next step (password)
        if (userExists) {
          this.setState({
            pseudoAlreadyTaken: true,
          });
        } else {
          // if no user: display error
          this.setState({
            step: 1,
          });
        }
      });
    } else {
      // password check
      if (this.state.password.length === 0) {
        return Swal.fire({
          title: "Oops...",
          text: "Aucun mot de passe n'est renseigné !",
          type: "error",
          timer: 1500,
        });
      }
      this.login();
    }
  };

  handleChange = (event) =>
    this.setState({ [event.target.id]: event.target.value });

  getHeaderText = () => {
    if (this.state.step === 0) {
      return this.props.t(
        "Login.Créer un nouveau compte",
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
      return this.props.t(
        "Login.Double authentification",
        "Double authentification "
      );
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
        "Login.Un code vous a été envoyé par sms sur votre mobile.",
        "Un code vous a été envoyé par sms sur votre mobile."
      );
    }
  };

  render() {
    const {
      passwordVisible,
      username,
      step,
      code,
      email,
      phone,
      noUserError,
      password,
      wrongAdminCodeError,
      wrongPasswordError,
      unexpectedError,
      pseudoAlreadyTaken,
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
              fill={variables.noir}
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
              ) : (
                <PasswordField
                  id="password"
                  value={password}
                  onChange={this.handleChange}
                  passwordVisible={passwordVisible}
                  onClick={this.togglePasswordVisibility}
                  t={t}
                  wrongPasswordError={wrongPasswordError}
                />
              )}
            </Form>
            <Footer step={step} t={t} />
            <Gauge step={step} />
          </ContentContainer>
          <LanguageModal
            show={this.props.showLangModal}
            current_language={i18n.language}
            toggle={this.props.toggleLangueModal}
            changeLanguage={this.changeLanguage}
            languages={{
              ...this.props.langues.filter((x) => x.avancement >= 0.5),
              unavailable: { unavailable: true },
            }}
          />
        </MainContainer>
      </div>
    );
  }
}

const ResetPasswordMessage = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: #828282;
  margin-bottom: 16px;
`;

const ContactSupport = (props) => (
  <a onClick={() => window.$crisp.push(["do", "chat:open"])}>
    <div
      style={{
        fontWeight: "bold",
        textDecoration: "underline",
        cursor: "pointer",
        color: "#828282",
      }}
    >
      {props.t("Login.Contactez le support", "Contactez le support")}
    </div>
  </a>
);
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

  if (props.step === 2) {
    return (
      <FooterLink>
        <div onClick={props.login}>
          <u>{props.t("Login.Renvoyer le code", "Renvoyer le code")}</u>
        </div>
      </FooterLink>
    );
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

const PseudoPrecisions = styled.div`
  font-size: 12px;
  line-height: 15px;
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
          error={props.noUserError}
          {...props}
        />
      </div>
      <div style={{ marginLeft: "10px" }}>
        <FButton
          type="grey"
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

const PasswordField = (props) => (
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
        />
      </div>
      <div style={{ marginLeft: "10px" }}>
        <FButton
          type="validate"
          name="checkmark-outline"
          disabled={!props.value}
        >
          {props.t("Valider", "Valider")}
        </FButton>
      </div>
    </div>
    {props.wrongPasswordError && (
      <ErrorMessageContainer>
        {props.t(
          "Login.Mauvais mot de passe",
          "Erreur, mauvais mot de passe : "
        )}
        <b>{props.t("Login.Reessayez", "réessayez !")}</b>
      </ErrorMessageContainer>
    )}
  </>
);

const PasswordFooter = (props) => (
  <FooterLink>
    <div onClick={props.resetPassword}>
      <u>
        {props.t("Login.Mot de passe oublié ?", "J'ai oublié mon mot de passe")}
      </u>
    </div>
  </FooterLink>
);

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
  };
};

export default track(
  {
    page: "Login",
  },
  { dispatchOnMount: true }
)(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Register)));
