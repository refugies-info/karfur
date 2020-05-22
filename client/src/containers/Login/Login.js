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
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import passwdCheck from "zxcvbn";
import querySearch from "stringquery";

import API from "../../utils/API";
import setAuthToken from "../../utils/setAuthToken";
// import FCBtn from '../../assets/FCboutons-10.png';
import FButton from "../../components/FigmaUI/FButton/FButton";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import FInput from "../../components/FigmaUI/FInput/FInput";
import { fetch_user } from "../../services/User/user.actions";
import Modal from "../../components/Modals/Modal";
import { colorAvancement } from "../../components/Functions/ColorFunctions";

import "./Login.scss";
import variables from "scss/colors.scss";

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
    const locState = this.props.location.state;
    const qParam = querySearch(this.props.location.search).redirect;
    if (API.isAuth()) {
      if (qParam) {
        const redirectTo = decodeURIComponent(qParam);
        return window.location.assign(
          redirectTo +
            (redirectTo.indexOf("?") === -1 ? "?" : "&") +
            "ssoToken=" +
            localStorage.getItem("token")
        );
      } else {
        return this.props.history.push("/");
      }
    }
    if (locState) {
      this.setState({
        traducteur: locState.traducteur,
        redirectTo: locState.redirectTo || "/",
      });
    }
    if (qParam) {
      this.setState({
        cannyRedirect: true,
        redirectTo: decodeURIComponent(qParam),
      });
    }
    window.scrollTo(0, 0);
  }

  togglePasswordVisibility = () =>
    this.setState((pS) => ({ passwordVisible: !pS.passwordVisible }));
  toggleModal = () => this.setState((pS) => ({ showModal: !pS.showModal }));

  goBack = () =>
    this.setState({ step: 0, userExists: false, password: "", cpassword: "" });

  resetPassword = () => {
    API.reset_password({ username: this.state.username }).then((data) => {
      Swal.fire({
        title: "Yay...",
        text:
          "Le mot de passe de récupération a été envoyé à l'adresse mail renseignée lors de la création du compte",
        type: "success",
      });
    });
  };

  send = (e) => {
    e.preventDefault();
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
      if (this.state.password.length === 0) {
        return Swal.fire({
          title: "Oops...",
          text: "Aucun mot de passe n'est renseigné !",
          type: "error",
          timer: 1500,
        });
      }
      if (
        !this.state.userExists &&
        this.state.password !== this.state.cpassword
      ) {
        return Swal.fire({
          title: "Oops...",
          text: "Les mots de passes ne correspondent pas !",
          type: "error",
          timer: 1500,
        });
      }
      if (
        !this.state.userExists &&
        (passwdCheck(this.state.password) || {}).score < 1
      ) {
        return Swal.fire({
          title: "Oops...",
          text: "Le mot de passe est trop faible",
          type: "error",
          timer: 1500,
        });
      }
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
            { cannyRedirect, redirectTo } = this.state;
          Swal.fire({
            title: "Yay...",
            text: "Authentification réussie !",
            type: "success",
            timer: 1500,
          }).then(() => {
            if (cannyRedirect) {
              return window.location.assign(
                redirectTo +
                  (redirectTo.indexOf("?") === -1 ? "?" : "&") +
                  "ssoToken=" +
                  token
              );
            } else {
              return this.props.history.push(redirectTo);
            }
          });
          localStorage.setItem("token", token);
          if (!cannyRedirect) {
            setAuthToken(token);
            this.props.fetch_user();
          }
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
      <div className="app flex-row align-items-center login">
        <div className="login-wrapper">
          {step === 1 && !userExists && (
            <RegisterHeader goBack={this.goBack} t={t} />
          )}
          <Card className="card-login main-card">
            <CardBody>
              <Form onSubmit={this.send}>
                <h5>
                  {step === 0 || userExists
                    ? t("Login.Se connecter", "Se connecter")
                    : step === 1
                    ? t("Login.Se créer un compte", "Se créer un compte")
                    : "Votre code de confirmation"}
                </h5>
                <div className="texte-small mb-12">
                  {step === 0
                    ? t("Login.Ou se créer un compte", "Ou se créer un compte")
                    : userExists && step === 1
                    ? t(
                        "Login.Content de vous revoir !",
                        "Content de vous revoir !"
                      )
                    : step === 1
                    ? t("Login.Pas besoin d’email", "Pas besoin d’email")
                    : "Nous vous avons envoyé un SMS à votre numéro"}
                </div>
                <CSSTransition
                  in={true}
                  appear={true}
                  timeout={600}
                  classNames="example"
                >
                  {step === 0 ? (
                    <UsernameField
                      value={username}
                      onChange={this.handleChange}
                      step={step}
                      key="username-field"
                      t={t}
                    />
                  ) : step === 1 ? (
                    <>
                      <PasswordField
                        id="password"
                        placeholder="Mot de passe"
                        value={this.state.password}
                        onChange={this.handleChange}
                        passwordVisible={passwordVisible}
                        onClick={this.togglePasswordVisibility}
                        userExists={userExists}
                        t={t}
                      />
                      {step === 1 && !userExists && (
                        <PasswordField
                          id="cpassword"
                          placeholder="Confirmez le mot de passe"
                          value={this.state.cpassword}
                          onChange={this.handleChange}
                          passwordVisible={passwordVisible}
                          onClick={this.togglePasswordVisibility}
                          t={t}
                        />
                      )}
                    </>
                  ) : (
                    <CodeField
                      value={code}
                      onChange={this.handleChange}
                      key="code-field"
                    />
                  )}
                </CSSTransition>

                {step === 1 && (
                  <PasswordFooter
                    value={this.state.password}
                    upcoming={this.upcoming}
                    t={t}
                    userExists={userExists}
                    resetPassword={this.resetPassword}
                  />
                )}
              </Form>
            </CardBody>
          </Card>
          {/* <Card className="card-login">
            <CardBody>
              <div className="alt-login">
                <form action="/user/FClogin" method="post">
                  <div className="field">
                    <label className="label">
                        Niveau eIDAS
                        <span
                          className="has-text-info tooltip is-tooltip-multiline"
                          data-tooltip="Vous pouvez dès à présent tester les identités de niveau faible (eidas1), substantiel (eidas2) et fort (eidas3) sur l'environnement de qualification. En production, vous n'aurez cependant accès pour l'instant qu'à des identités de niveau faible (eidas1)." >
                            (info)
                        </span>
                    </label>
                    <div className="select">
                      <select name="eidasLevel">
                        <option value="eidas1">Défaut : Faible (eidas1)</option>
                        <option value="eidas2">Substantiel (eidas2)</option>
                        <option value="eidas3">Fort (eidas3)</option>
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <input type="image" src={FCBtn} alt="Soumettre"/>
                  </div>
                </form>
              </div>
            </CardBody>
          </Card> */}
          <NavLink to="/">
            <FButton
              type="outline"
              name="corner-up-left-outline"
              className="retour-btn"
            >
              {t("Login.Retour à l'accueil", "Retour à l'accueil")}
            </FButton>
          </NavLink>
        </div>

        <InfoModal
          show={showModal}
          email={email}
          phone={phone}
          toggle={this.toggleModal}
          send={this.send}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

const UsernameField = (props) => (
  <div key="username-field">
    <FInput
      prepend
      prependName="person-outline"
      {...props}
      id="username"
      type="username"
      placeholder={props.t("Login.Pseudonyme", "Pseudonyme")}
      autoComplete="username"
    />
    <div className="footer-buttons">
      <FButton
        type="dark"
        name="arrow-forward-outline"
        color="dark"
        className="connect-btn"
        disabled={!props.value}
      >
        {props.t("Suivant", "Suivant")}
      </FButton>
    </div>
  </div>
);

const PasswordField = (props) => {
  const password_check = passwdCheck(props.value);
  return (
    <>
      <FInput
        prepend
        append
        autoFocus={props.id === "password"}
        prependName="lock-outline"
        appendName={props.passwordVisible ? "eye-off-2-outline" : "eye-outline"}
        inputClassName="password-input"
        onAppendClick={props.onClick}
        {...props}
        type={props.passwordVisible ? "text" : "password"}
        id={props.id}
        placeholder={
          props.placeholder &&
          props.t("Login." + props.placeholder, props.placeholder)
        }
        autoComplete="new-password"
      />
      {props.id === "password" && !props.userExists && props.value && (
        <div className="score-wrapper mb-10">
          <span className="mr-10">{props.t("Login.Force", "Force")} :</span>
          <Progress
            color={colorAvancement(password_check.score / 4)}
            value={((0.1 + password_check.score / 4) * 100) / 1.1}
          />
        </div>
      )}
    </>
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

const mapDispatchToProps = { fetch_user };

export default track(
  {
    page: "Login",
  },
  { dispatchOnMount: true }
)(connect(null, mapDispatchToProps)(withTranslation()(Login)));
