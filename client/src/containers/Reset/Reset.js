import React, { Component } from "react";
import track from "react-tracking";
import { Card, CardBody, Form, Progress } from "reactstrap";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import passwdCheck from "zxcvbn";

import API from "../../utils/API";
import setAuthToken from "../../utils/setAuthToken";
import FButton from "../../components/FigmaUI/FButton/FButton";
import FInput from "../../components/FigmaUI/FInput/FInput";
import { fetch_user } from "../../services/actions";
import { colorAvancement } from "../../components/Functions/ColorFunctions";

import "./Reset.scss";
import variables from "scss/colors.scss";

class Reset extends Component {
  state = {
    newPassword: "",
    cpassword: "",
    isLoading: true,
    isError: false,
    reset_password_token: "",
  };

  componentDidMount() {
    const reset_password_token = _.get(this.props, "match.params.id");
    if (!reset_password_token) {
      return this.setState({ isLoading: false, isError: true });
    }
    API.get_users({
      query: {
        reset_password_token,
        reset_password_expires: { $gt: Date.now() },
      },
    })
      .then((data) => {
        const users = data.data.data;
        if (users && users.length === 1) {
          this.setState({ isLoading: false, reset_password_token });
        } else {
          this.setState({ isLoading: false, isError: true });
        }
      })
      .catch((e) => {
        console.log(e);
        this.setState({ isLoading: false, isError: true });
      });
  }

  togglePasswordVisibility = () =>
    this.setState((pS) => ({ passwordVisible: !pS.passwordVisible }));

  send = (e) => {
    e.preventDefault();
    if (this.state.newPassword.length === 0) {
      return Swal.fire({
        title: "Oops...",
        text: "Aucun mot de passe n'est renseigné !",
        type: "error",
        timer: 1500,
      });
    }
    if (this.state.newPassword !== this.state.cpassword) {
      return Swal.fire({
        title: "Oops...",
        text: "Les mots de passes ne correspondent pas !",
        type: "error",
        timer: 1500,
      });
    }
    if ((passwdCheck(this.state.newPassword) || {}).score < 1) {
      return Swal.fire({
        title: "Oops...",
        text: "Le mot de passe est trop faible",
        type: "error",
        timer: 1500,
      });
    }
    const user = {
      newPassword: this.state.newPassword,
      cpassword: this.state.cpassword,
      reset_password_token: this.state.reset_password_token,
    };
    API.set_new_password(user)
      .then((data) => {
        Swal.fire({
          title: "Yay...",
          text: "Modification du mot de passe réussie !",
          type: "success",
          timer: 1500,
        }).then(() => {
          this.props.history.push("/");
        });
        localStorage.setItem("token", data.data.token);
        setAuthToken(data.data.token);
        this.props.fetch_user();
      })
      .catch((e) => console.log(e.response));
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
      newPassword,
      cpassword,
      isLoading,
      isError,
    } = this.state;
    const { t } = this.props;
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
          <FButton
            tag={NavLink}
            to="/login"
            fill={variables.noir}
            name="arrow-back-outline"
          >
            {t(
              "Login.Revenir à la page de connexion",
              "Revenir à la page de connexion"
            )}
          </FButton>
        </div>
      );
    } else {
      const password_check = newPassword && passwdCheck(newPassword);
      return (
        <div className="app flex-row align-items-center reset">
          <div className="login-wrapper">
            <Card className="card-login main-card">
              <CardBody>
                <Form onSubmit={this.send}>
                  <h5>
                    {t(
                      "Login.Réinitialisez votre mot de passe",
                      "Réinitialisez votre mot de passe"
                    )}
                  </h5>
                  <div className="texte-small mb-12">
                    {t(
                      "Login.Renseignez ici le nouveau mot de passe souhaité",
                      "Renseignez ici le nouveau mot de passe souhaité"
                    )}
                  </div>
                  <FInput
                    prepend
                    append
                    autoFocus
                    prependName="lock-outline"
                    appendName={
                      passwordVisible ? "eye-off-2-outline" : "eye-outline"
                    }
                    type={passwordVisible ? "text" : "password"}
                    inputClassName="password-input"
                    onAppendClick={this.togglePasswordVisibility}
                    id="newPassword"
                    placeholder={t(
                      "Login.Nouveau mot de passe",
                      "Nouveau mot de passe"
                    )}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={this.handleChange}
                  />
                  {newPassword && password_check && (
                    <div className="score-wrapper mb-10">
                      <span className="mr-10">
                        {t("Login.Force", "Force")} :
                      </span>
                      <Progress
                        color={colorAvancement(password_check.score / 4)}
                        value={((0.1 + password_check.score / 4) * 100) / 1.1}
                      />
                    </div>
                  )}
                  <FInput
                    prepend
                    append
                    prependName="lock-outline"
                    appendName={
                      passwordVisible ? "eye-off-2-outline" : "eye-outline"
                    }
                    inputClassName="password-input"
                    type={passwordVisible ? "text" : "password"}
                    onAppendClick={this.togglePasswordVisibility}
                    id="cpassword"
                    placeholder={t(
                      "Login.Confirmez le nouveau mot de passe",
                      "Confirmez le nouveau mot de passe"
                    )}
                    autoComplete="cpassword"
                    value={cpassword}
                    onChange={this.handleChange}
                  />
                  <div className="footer-buttons">
                    <FButton
                      type="dark"
                      name="log-in"
                      color="dark"
                      className="connect-btn"
                      disabled={!newPassword}
                    >
                      {t("Valider", "Valider")}
                    </FButton>
                  </div>
                </Form>
              </CardBody>
            </Card>
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
        </div>
      );
    }
  }
}

const mapDispatchToProps = { fetch_user };

export default track(
  {
    page: "Reset",
  },
  { dispatchOnMount: true }
)(connect(null, mapDispatchToProps)(withTranslation()(Reset)));
