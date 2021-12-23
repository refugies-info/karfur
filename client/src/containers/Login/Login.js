import React, { Component } from "react";
import { Form } from "reactstrap";
import i18n from "../../i18n";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import {
  fetchLanguesActionCreator,
  toggleLangueActionCreator,
  toggleLangueModalActionCreator,
} from "../../services/Langue/langue.actions";
import { fetchUserActionCreator } from "../../services/User/user.actions";
import { LoadingStatusKey } from "../../services/LoadingStatus/loadingStatus.actions";
import API from "../../utils/API";
import setAuthToken from "../../utils/setAuthToken";
import LanguageBtn from "../../components/FigmaUI/LanguageBtn/LanguageBtn";
import FButton from "../../components/FigmaUI/FButton/FButton";
import LanguageModal from "../../components/Modals/LanguageModal/LanguageModal";
import { GoBackButton } from "./components/GoBackButton";
import { Footer } from "./components/Footer";
import { CodeField } from "./components/fields/CodeField";
import { PasswordField } from "./components/fields/PasswordField";
import { PhoneAndEmailFields } from "./components/fields/PhoneAndEmailFields";
import { UsernameField } from "./components/fields/UsernameField";
import * as S from "./styles";
import { colors } from "colors";

export class Login extends Component {
  state = {
    username: "",
    password: "",
    code: "",
    email: "",
    phone: "",
    smsSentTo: "",
    structure: null,
    passwordVisible: false,
    step: 0,
    noUserError: false,
    wrongPasswordError: false,
    resetPasswordNotPossible: false,
    resetPasswordPossible: false,
    wrongAdminCodeError: false,
    unexpectedError: false,
    newAdminWithoutPhoneOrEmail: false,
    newHasStructureWithoutPhoneOrEmail: false,
    userDeletedError: false,
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
      smsSentTo: "",
      structure: null,
      wrongPasswordError: false,
      resetPasswordNotPossible: false,
      resetPasswordPossible: false,
      wrongAdminCodeError: false,
      unexpectedError: false,
      newAdminWithoutPhoneOrEmail: false,
      newHasStructureWithoutPhoneOrEmail: false,
    });

  resetPassword = () => {
    API.reset_password({ username: this.state.username })
      .then((data) => {
        this.setState({ resetPasswordPossible: true, email: data.data.data });
      })
      .catch((e) => {
        if (e.response.status === 403) {
          this.setState({ resetPasswordNotPossible: true });
        }
      });
  };

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
   * Errors returned by login route
   * 400 : invalid request, no user with this pseudo
   * 500 : internal error
   * 401 : wrong password
   * 402 : wrong code (admin or hasStructure)
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
        // status 501 corresponds to an admin connecting (before entering the code)
        if (e.response.status === 501) {
          this.setState({
            step: 2,
            newAdminWithoutPhoneOrEmail: false,
            newHasStructureWithoutPhoneOrEmail: false,
            smsSentTo: e.response?.data?.phone || ""
          });
          // status 401 corresponds to wrong password
        } else if (e.response.status === 401) {
          this.setState({
            wrongPasswordError: true,
          });
        } else if (e.response.status === 402) {
          this.setState({ wrongAdminCodeError: true });
        } else if (e.response.status === 502) {
          if (e.response?.data?.role === "admin") {
            this.setState({
              newAdminWithoutPhoneOrEmail: true,
              email: e.response?.data?.email || ""
            });
          } else {
            this.setState({
              newHasStructureWithoutPhoneOrEmail: true,
              email: e.response?.data?.email || "",
              structure: e.response?.data?.structure
            });
          }
        } else if (e.response.status === 405) {
          this.setState({ userDeletedError: true });
        } else {
          this.setState({ unexpectedError: true });
        }
      });
  };

  submitForm = (e) => {
    e.preventDefault();
    this.setState({ wrongPasswordError: false });

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
            step: 1,
          });
        } else {
          // if no user: display error
          this.setState({
            noUserError: !userExists,
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
        "Login.Content de vous revoir !",
        "Content de vous revoir !"
      );
    }

    if (this.state.newAdminWithoutPhoneOrEmail) {
      return this.props.t(
        "Login.Nouvel administrateur",
        "Nouvel administrateur"
      );
    }
    if (this.state.newHasStructureWithoutPhoneOrEmail) {
      return this.props.t(
        "Login.new_has_structure",
        "Nouveau responsable de structure ! 🎉"
      );
    }
    if (this.state.resetPasswordNotPossible) {
      return this.props.t(
        "Login.Impossible de réinitialiser",
        "Impossible de réinitialiser"
      );
    }

    if (this.state.resetPasswordPossible) {
      return this.props.t(
        "Login.Réinitialisation du mot de passe",
        "Un lien de réinitialisation a été envoyé"
      );
    }
    if (this.state.step === 1) {
      return (
        this.props.t("Login.Bonjour", "Bonjour ") + this.state.username + " !"
      );
    }

    if (this.state.step === 2) {
      return this.props.t(
        "Login.Double authentification",
        "Double authentification "
      );
    }
  };

  getHashedEmail = () => {
    const splittedEmailArray = this.state.email.split("@");
    if (splittedEmailArray.length === 2) {
      const prefixEmail = splittedEmailArray[0];
      const suffixEmail = splittedEmailArray[1];
      const hashLength =
        prefixEmail.length - 2 > 0 ? prefixEmail.length - 2 : 0;
      const hashedPrefix = prefixEmail.substring(0, 2) + "*".repeat(hashLength);
      return hashedPrefix + "@" + suffixEmail;
    }
    return "";
  };

  getSubtitle = () => {
    if (this.state.step === 0) {
      return this.props.t(
        "Login.Entrez votre pseudonyme",
        "Entrez votre pseudonyme"
      );
    }

    if (this.state.newAdminWithoutPhoneOrEmail) {
      return this.props.t(
        "Login.Entrez votre numéro et votre email",
        "Entrez votre numéro et votre email"
      );
    }
    if (this.state.newHasStructureWithoutPhoneOrEmail) {
      return null
    }
    if (this.state.step === 1) {
      return this.props.t(
        "Login.Entrez votre mot de passe",
        "Entrez votre mot de passe"
      );
    }

    if (this.state.step === 2) {
      return this.props.t(
        "Login.code_sent_sms", { phone: this.state.smsSentTo }
      );
    }
  };

  getFormTemplate = () => {
    if (this.state.step === 0) { // STEP 0: username
      return (
        <UsernameField
          value={this.state.username}
          onChange={this.handleChange}
          t={this.props.t}
          noUserError={this.state.noUserError}
        />
      )
    } else if (this.state.step === 1) { // STEP 1: password or contact infos
      if (this.state.newAdminWithoutPhoneOrEmail && !this.state.wrongPasswordError) {
        return (
          <PhoneAndEmailFields
            t={this.props.t}
            onChange={this.handleChange}
            phone={this.state.phone}
            email={this.state.email}
            isAdmin={true}
          />
        )
      }
      if (this.state.newHasStructureWithoutPhoneOrEmail && !this.state.wrongPasswordError) {
        return (
          <>
            <PhoneAndEmailFields
              t={this.props.t}
              onChange={this.handleChange}
              phone={this.state.phone}
              email={this.state.email}
              structure={this.state.structure}
              isAdmin={false}
            />
          </>
        )
      }
      return (
        <PasswordField
          id="password"
          value={this.state.password}
          onChange={this.handleChange}
          passwordVisible={this.state.passwordVisible}
          onClick={this.togglePasswordVisibility}
          t={this.props.t}
          wrongPasswordError={this.state.wrongPasswordError}
        />
      )
    }

    return ( // STEP 2: 2FA code
      <CodeField
        value={this.state.code}
        onChange={this.handleChange}
        t={this.props.t}
        wrongAdminCodeError={this.state.wrongAdminCodeError}
      />
    )
  }

  render() {
    const {
      step,
      resetPasswordNotPossible,
      resetPasswordPossible,
      newAdminWithoutPhoneOrEmail,
      newHasStructureWithoutPhoneOrEmail,
      unexpectedError,
      userDeletedError,
    } = this.state;
    const { t } = this.props;

    return (
      <div className="app">
        <S.MainContainer>
          <S.ContentContainer smallPadding={step === 1 && newHasStructureWithoutPhoneOrEmail}>
            <S.HeaderContainer>
              <GoBackButton step={step} goBack={this.goBack} t={t} />
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
                  fill={colors.noir}
                >
                  {t("Login.Centre d'aide", "Centre d'aide")}
                </FButton>
              </div>
            </S.HeaderContainer>

            <S.StyledH2>{this.getHeaderText()}</S.StyledH2>
            {resetPasswordNotPossible && (
              <S.NoEmailRelatedContainer>
                {t(
                  "Login.Pas email",
                  "Il n'y a pas d'email associé à ce pseudonyme."
                )}
              </S.NoEmailRelatedContainer>
            )}
            {resetPasswordPossible && (
              <>
                <S.EmailRelatedContainer>
                  {t(
                    "Login.Lien réinitialisation",
                    "Un lien de réinitialisation a été envoyé à "
                  ) +
                    this.getHashedEmail() +
                    "."}
                </S.EmailRelatedContainer>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    lineHeight: "20px",
                    marginBottom: "64px",
                  }}
                >
                  {t(
                    "Login.Réinitialisation texte",
                    "Vous n'avez rien reçu ? Avez-vous vérifié dans vos spams ?"
                  )}
                </div>
              </>
            )}
            {!resetPasswordNotPossible && !resetPasswordPossible && (
              <>
                {!!this.getSubtitle() &&
                  <S.StyledEnterValue>{this.getSubtitle()}</S.StyledEnterValue>
                }
                <Form onSubmit={this.submitForm}>
                  {this.getFormTemplate()}
                </Form>
              </>
            )}
            <Footer
              step={step}
              t={t}
              resetPassword={this.resetPassword}
              resetPasswordNotPossible={resetPasswordNotPossible}
              resetPasswordPossible={resetPasswordPossible}
              login={this.login}
              unexpectedError={unexpectedError}
              newAdminWithoutPhoneOrEmail={newAdminWithoutPhoneOrEmail}
              newHasStructureWithoutPhoneOrEmail={newHasStructureWithoutPhoneOrEmail}
              userDeletedError={userDeletedError}
            />
          </S.ContentContainer>
          <LanguageModal
            show={this.props.showLangModal}
            current_language={i18n.language}
            toggle={this.props.toggleLangueModal}
            changeLanguage={this.changeLanguage}
            langues={this.props.langues}
            isLanguagesLoading={this.props.isLanguagesLoading}
          />
        </S.MainContainer>
      </div>
    );
  }
}

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
)(withTranslation()(Login));
