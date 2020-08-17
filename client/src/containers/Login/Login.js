import React, { Component } from "react";
import track from "react-tracking";
import {
  Button,
  Card,
  CardBody,
  Form,
  ModalBody,
  ModalFooter,
  Progress,
} from "reactstrap";
import i18n from "../../i18n";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import passwdCheck from "zxcvbn";
import querySearch from "stringquery";
import { Link } from "react-router-dom";
import LanguageBtn from "../../components/FigmaUI/LanguageBtn/LanguageBtn";
import API from "../../utils/API";
import setAuthToken from "../../utils/setAuthToken";
import FButton from "../../components/FigmaUI/FButton/FButton";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import FInput from "../../components/FigmaUI/FInput/FInput";
import { fetchUserActionCreator } from "../../services/User/user.actions";
import Modal from "../../components/Modals/Modal";
import { colorAvancement } from "../../components/Functions/ColorFunctions";
import styled from "styled-components";
import LanguageModal from "../../components/Modals/LanguageModal/LanguageModal";

import "./Login.scss";
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
  background: #cdcdcd;
  display: flex;
  align-items: center;
  flex: 1;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  padding-top: 100px;
`;

const NoAccountContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  line-height: 20px;
  color: #828282;
  margin-top: 64px;
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

const PasswordForgottenLink = styled.div`
  color: #828282;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
`;
export class Login extends Component {
  state = {
    username: "",
    password: "",
    cpassword: "",
    code: "",
    email: "",
    phone: "",
    authy_id: "",
    traducteur: false,
    passwordVisible: false,
    redirectTo: "/",
    step: 0,
    userExists: false,
    usernameHidden: false,
    showModal: false,
    cannyRedirect: false,
  };

  componentDidMount() {
    this.props.fetchLangues();
    // const locState = this.props.location.state;
    // const qParam = querySearch(this.props.location.search).redirect;
    if (API.isAuth()) {
      // if (qParam) {
      //   const redirectTo = decodeURIComponent(qParam);
      //   return window.location.assign(
      //     redirectTo +
      //       (redirectTo.indexOf("?") === -1 ? "?" : "&") +
      //       "ssoToken=" +
      //       localStorage.getItem("token")
      //   );
      // }
      return this.props.history.push("/");
    }
    // if (locState) {
    //   this.setState({
    //     traducteur: locState.traducteur,
    //     redirectTo: locState.redirectTo || "/",
    //   });
    // }
    // if (qParam) {
    //   this.setState({
    //     cannyRedirect: true,
    //     redirectTo: decodeURIComponent(qParam),
    //   });
    // }
    window.scrollTo(0, 0);
  }

  togglePasswordVisibility = () =>
    this.setState((pS) => ({ passwordVisible: !pS.passwordVisible }));
  toggleModal = () => this.setState((pS) => ({ showModal: !pS.showModal }));

  goBack = () =>
    this.setState({ step: 0, userExists: false, password: "", cpassword: "" });

  resetPassword = () => {
    API.reset_password({ username: this.state.username }).then(() => {
      Swal.fire({
        title: "Yay...",
        text:
          "Le mot de passe de récupération a été envoyé à l'adresse mail renseignée lors de la création du compte",
        type: "success",
      });
    });
  };

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
        this.setState({ userExists: data.status === 200, step: 1 });
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

      // creation compte
      // if (
      //   !this.state.userExists &&
      //   this.state.password !== this.state.cpassword
      // ) {
      //   return Swal.fire({
      //     title: "Oops...",
      //     text: "Les mots de passes ne correspondent pas !",
      //     type: "error",
      //     timer: 1500,
      //   });
      // }
      // if (
      //   !this.state.userExists &&
      //   (passwdCheck(this.state.password) || {}).score < 1
      // ) {
      //   return Swal.fire({
      //     title: "Oops...",
      //     text: "Le mot de passe est trop faible",
      //     type: "error",
      //     timer: 1500,
      //   });
      // }
      const user = {
        username: this.state.username,
        password: this.state.password,
        cpassword: this.state.cpassword,
        traducteur: this.state.traducteur,
        code: this.state.code,
        email: this.state.email,
        phone: this.state.phone,
      };
      API.login(user)
        .then((data) => {
          const token = data.data.token,
            { redirectTo } = this.state;
          Swal.fire({
            title: "Yay...",
            text: "Authentification réussie !",
            type: "success",
            timer: 1500,
          }).then(() => {
            return this.props.history.push(redirectTo);
          });
          localStorage.setItem("token", token);
          setAuthToken(token);
          this.props.fetchUser();
        })
        .catch((e) => {
          if (e.response.status === 501) {
            this.setState({ showModal: false, step: 2 });
          } else if (e.response.status === 502) {
            this.setState({
              showModal: true,
              phone: _.get(e, "response.data.phone", ""),
              email: _.get(e, "response.data.email", ""),
            });
          } else {
            // eslint-disable-next-line no-console
            console.log(e.response);
          }
        });
    }
  };

  handleChange = (event) =>
    this.setState({ [event.target.id]: event.target.value });

  upcoming = () =>
    Swal.fire({
      title: "Oh non!",
      text: "Cette fonctionnalité n'est pas encore disponible",
      type: "error",
      timer: 1500,
    });

  render() {
    const {
      passwordVisible,
      username,
      step,
      userExists,
      code,
      showModal,
      email,
      phone,
    } = this.state;
    const { t } = this.props;
    return (
      <div className="app">
        <MainContainer>
          <ContentContainer>
            <NavLink to="/">
              <FButton
                type="light-action"
                name="arrow-back-outline"
                className="mr-10"
              >
                {t("Login.Retour", "Retour")}
              </FButton>
            </NavLink>
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
            <Form onSubmit={this.send}>
              <StyledHeader>
                {step === 0
                  ? t(
                      "Login.Content de vous revoir !",
                      "Content de vous revoir !"
                    )
                  : t("Login.Bonjour", "Bonjour ") + username}
              </StyledHeader>
              <StyledEnterValue>
                {step === 0
                  ? t(
                      "Login.Entrez votre pseudonyme",
                      "Entrez votre pseudonyme"
                    )
                  : t(
                      "Login.Entrez votre mot de passe",
                      "Entrez votre mot de passe"
                    )}
              </StyledEnterValue>

              {step === 0 ? (
                <UsernameField
                  value={username}
                  onChange={this.handleChange}
                  step={step}
                  key="username-field"
                  t={t}
                />
              ) : (
                <>
                  <PasswordField
                    id="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    passwordVisible={passwordVisible}
                    onClick={this.togglePasswordVisibility}
                    userExists={userExists}
                    t={t}
                  />
                </>
              )}
              {step === 0 ? (
                <>
                  <NoAccountContainer>
                    {t("Pas encore de compte ?", "Pas encore de compte ?")}
                    <Link
                      to={{
                        pathname: "/register",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          textDecoration: "underline",
                          marginLeft: "5px",
                        }}
                      >
                        {t("Créer un compte", "Créer un compte")}
                      </div>
                    </Link>
                  </NoAccountContainer>
                  <PseudoForgottenContainer>
                    {t("Pseudonyme oublié ?", "Pseudonyme oublié ?")}
                    <a onClick={() => window.$crisp.push(["do", "chat:open"])}>
                      <div
                        style={{
                          fontWeight: "bold",
                          textDecoration: "underline",
                          marginLeft: "5px",
                          cursor: "pointer",
                        }}
                      >
                        {t("Contactez le support", "Contactez le support")}
                      </div>
                    </a>
                  </PseudoForgottenContainer>{" "}
                </>
              ) : (
                <div style={{ marginTop: "64px" }}>
                  <PasswordForgottenLink>
                    <div onClick={this.resetPassword}>
                      <u>
                        {t(
                          "Login.Mot de passe oublié ?",
                          "J'ai oublié mon mot de passe"
                        )}
                      </u>
                    </div>
                  </PasswordForgottenLink>
                </div>
              )}
            </Form>
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

// <div className="app flex-row align-items-center login">
//         <div className="login-wrapper">
//           {step === 1 && !userExists && (
//             <RegisterHeader goBack={this.goBack} t={t} />
//           )}
//           <Card className="card-login main-card">
//             <CardBody>
//               <Form onSubmit={this.send}>
//                 <h5>
//                   {step === 0 || userExists
//                     ? t("Login.Se connecter", "Se connecter")
//                     : step === 1
//                     ? t("Login.Se créer un compte", "Se créer un compte")
//                     : "Votre code de confirmation"}
//                 </h5>
//                 <div className="texte-small mb-12">
//                   {step === 0
//                     ? t("Login.Ou se créer un compte", "Ou se créer un compte")
//                     : userExists && step === 1
//                     ? t(
//                         "Login.Content de vous revoir !",
//                         "Content de vous revoir !"
//                       )
//                     : step === 1
//                     ? t("Login.Pas besoin d’email", "Pas besoin d’email")
//                     : "Nous vous avons envoyé un SMS à votre numéro"}
//                 </div>
//                 <CSSTransition
//                   in={true}
//                   appear={true}
//                   timeout={600}
//                   classNames="example"
//                 >
//                   {step === 0 ? (
//                     <UsernameField
//                       value={username}
//                       onChange={this.handleChange}
//                       step={step}
//                       key="username-field"
//                       t={t}
//                     />
//                   ) : step === 1 ? (
//                     <>
//                       <PasswordField
//                         id="password"
//                         placeholder="Mot de passe"
//                         value={this.state.password}
//                         onChange={this.handleChange}
//                         passwordVisible={passwordVisible}
//                         onClick={this.togglePasswordVisibility}
//                         userExists={userExists}
//                         t={t}
//                       />
//                       {step === 1 && !userExists && (
//                         <PasswordField
//                           id="cpassword"
//                           placeholder="Confirmez le mot de passe"
//                           value={this.state.cpassword}
//                           onChange={this.handleChange}
//                           passwordVisible={passwordVisible}
//                           onClick={this.togglePasswordVisibility}
//                           t={t}
//                         />
//                       )}
//                     </>
//                   ) : (
//                     <CodeField
//                       value={code}
//                       onChange={this.handleChange}
//                       key="code-field"
//                     />
//                   )}
//                 </CSSTransition>

//                 {step === 1 && (
//                   <PasswordFooter
//                     value={this.state.password}
//                     upcoming={this.upcoming}
//                     t={t}
//                     userExists={userExists}
//                     resetPassword={this.resetPassword}
//                   />
//                 )}
//               </Form>
//             </CardBody>
//           </Card>
//           <NavLink to="/">
//             <FButton
//               type="outline"
//               name="corner-up-left-outline"
//               className="retour-btn"
//             >
//               {t("Login.Retour à l'accueil", "Retour à l'accueil")}
//             </FButton>
//           </NavLink>
//         </div>

//         <InfoModal
//           show={showModal}
//           email={email}
//           phone={phone}
//           toggle={this.toggleModal}
//           send={this.send}
//           onChange={this.handleChange}
//         />
//       </div>

const UsernameField = (props) => (
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
        {...props}
        id="username"
        type="username"
        placeholder={props.t("Login.Pseudonyme", "Pseudonyme")}
        autoComplete="username"
      />
    </div>
    <div style={{ marginLeft: "10px" }}>
      <FButton type="grey" name="arrow-forward-outline" disabled={!props.value}>
        {props.t("Suivant", "Suivant")}
      </FButton>
    </div>
  </div>
);

const PasswordField = (props) => {
  // const password_check = passwdCheck(props.value);
  return (
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
          placeholder={props.t(
            "Login. Votre mot de passe",
            "Votre mot de passe"
          )}
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
      {/* {props.id === "password" && !props.userExists && props.value && (
        <div className="score-wrapper mb-10">
          <span className="mr-10">{props.t("Login.Force", "Force")} :</span>
          <Progress
            color={colorAvancement(password_check.score / 4)}
            value={((0.1 + password_check.score / 4) * 100) / 1.1}
          />
        </div>
      )} */}
    </div>
  );
};

const PasswordFooter = (props) => (
  <div className="footer-buttons">
    {props.userExists && (
      <Button
        type="button"
        color="transparent"
        className="mr-10 password-btn"
        onClick={props.resetPassword}
      >
        <u>{props.t("Login.Mot de passe oublié ?", "Mot de passe oublié ?")}</u>
      </Button>
    )}
    <FButton
      type="dark"
      name="log-in"
      color="dark"
      className="connect-btn"
      disabled={!props.value}
    >
      {props.t("Connexion", "Connexion")}
    </FButton>
  </div>
);

const RegisterHeader = (props) => (
  <Card
    className="card-login header-card cursor-pointer"
    onClick={props.goBack}
  >
    <CardBody>
      <EVAIcon
        name="corner-up-left-outline"
        fill={variables.noir}
        className="mr-20"
      />
      <span>
        {props.t("Login.no-account", "Il n'existe pas de compte à ce nom")}.{" "}
      </span>
    </CardBody>
  </Card>
);

const CodeField = (props) => (
  <div key="code-field">
    <FInput
      prepend
      prependName="lock-outline"
      {...props}
      id="code"
      type="number"
      placeholder="code"
    />
    <div className="footer-buttons">
      <FButton
        type="dark"
        name="arrow-forward-outline"
        color="dark"
        className="connect-btn"
        disabled={!props.value}
      >
        Valider
      </FButton>
    </div>
  </div>
);

const InfoModal = (props) => (
  <Modal
    className="info-modal"
    modalHeader="Vos informations de compte"
    {...props}
  >
    <ModalBody>
      <FInput
        prepend
        prependName="at-outline"
        value={props.email}
        {...props}
        id="email"
        type="email"
        placeholder="Email"
      />
      <FInput
        prepend
        prependName="phone-call-outline"
        value={props.phone}
        {...props}
        id="phone"
        type="phone"
        placeholder="Téléphone : 06 11 22 33 44"
      />
    </ModalBody>
    <ModalFooter>
      <FButton type="light-action" onClick={props.toggle} className="mr-10">
        Annuler
      </FButton>
      <FButton type="validate" name="checkmark" onClick={props.send}>
        Valider
      </FButton>
    </ModalFooter>
  </Modal>
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
)(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Login)));
