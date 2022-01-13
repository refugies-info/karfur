import React, { Component } from "react";
import { Form, Progress } from "reactstrap";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import { computePasswordStrengthScore } from "../../lib/index";

import API from "../../utils/API";
import setAuthToken from "../../utils/setAuthToken";
import FButton from "../../components/FigmaUI/FButton/FButton";
import FInput from "../../components/FigmaUI/FInput/FInput";
import { fetchUserActionCreator } from "../../services/User/user.actions";
import { colorAvancement } from "../../components/Functions/ColorFunctions";
import LanguageModal from "../../components/Modals/LanguageModal/LanguageModal";
import i18n from "../../i18n";

import LanguageBtn from "../../components/FigmaUI/LanguageBtn/LanguageBtn";

import "./Reset.scss";
import { colors } from "colors";
import styled from "styled-components";
import img from "../../assets/login_background.svg";
import {
  fetchLanguesActionCreator,
  toggleLangueActionCreator,
  toggleLangueModalActionCreator,
} from "../../services/Langue/langue.actions";
import { LoadingStatusKey } from "../../services/LoadingStatus/loadingStatus.actions";

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

const ErrorMessageContainer = styled.div`
  color: #e8140f;
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
`;

class Reset extends Component {
  state = {
    newPassword: "",
    isLoading: true,
    isError: false,
    reset_password_token: "",
  };

  componentDidMount() {
    this.props.fetchLangues();

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
      .catch(() => {
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

    if (
      (computePasswordStrengthScore(this.state.newPassword) || {}).score < 1
    ) {
      return Swal.fire({
        title: "Oops...",
        text: "Le mot de passe est trop faible",
        type: "error",
        timer: 1500,
      });
    }
    const user = {
      newPassword: this.state.newPassword,
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
        this.props.fetchUser();
      })
      .catch(() => {});
  };

  handleChange = (event) =>
    this.setState({ [event.target.id]: event.target.value });

  changeLanguage = (lng) => {
    this.props.toggleLangue(lng);
    if (this.props.i18n.getResourceBundle(lng, "translation")) {
      this.props.i18n.changeLanguage(lng);
    }
    if (this.props.showLangModal) {
      this.props.toggleLangueModal();
    }
  };

  render() {
    const { passwordVisible, newPassword, isLoading, isError } = this.state;
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
            fill={colors.noir}
            name="arrow-back-outline"
          >
            {t(
              "Login.Revenir à la page de connexion",
              "Revenir à la page de connexion"
            )}
          </FButton>
        </div>
      );
    }

    return (
      <div className="app">
        <MainContainer>
          <ContentContainer>
            {/* <GoBackButton step={step} goBack={this.goBack} t={t} /> */}
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
            <StyledHeader>
              {this.props.t(
                "Reset.Réinitialisation du mot de passe",
                "Réinitialisation du mot de passe"
              )}
            </StyledHeader>
            <StyledEnterValue>
              {this.props.t(
                "Reset.Entrez votre nouveau mot de passe",
                "Entrez votre nouveau mot de passe"
              )}
            </StyledEnterValue>
            <Form onSubmit={this.send}>
              <PasswordField
                id="newPassword"
                value={newPassword}
                onChange={this.handleChange}
                passwordVisible={passwordVisible}
                onClick={this.togglePasswordVisibility}
                t={t}
                weakPasswordError={null}
              />
            </Form>
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
            {props.t("Valider", "Valider")}
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
)(withTranslation()(Reset));
