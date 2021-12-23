import React from "react";
import * as S from "../styles";
import "./Footer.scss";
import { Link } from "react-router-dom";

interface Props {
  step: number
  t: any
  resetPassword: any
  resetPasswordNotPossible: boolean
  resetPasswordPossible: boolean
  login: any
  unexpectedError: boolean
  newAdminWithoutPhoneOrEmail: boolean
  newHasStructureWithoutPhoneOrEmail: boolean
  userDeletedError: boolean
}

export const Footer = (props: Props) => {

  const contactSupportCallback = React.useCallback(() => {
    //@ts-ignore
    window.$crisp.push(["do", "chat:open"]);
  }, [])

  const ContactSupport = () => (
    <button onClick={contactSupportCallback} className="footer-link">
      {props.t("Login.Contactez le support", "Contactez le support")}
    </button>
  );

  // ERRORS
  if (props.unexpectedError) {
    return (
      <S.ErrorMessageContainer>
        {props.t(
          "Login.Une erreur est survenue. Veuillez réessayer.",
          "Une erreur est survenue. Veuillez réessayer."
        )}
      </S.ErrorMessageContainer>
    );
  }
  if (props.userDeletedError) {
    return (
      <S.ErrorMessageContainer>
        {props.t(
          "Login.user supprimé",
          "Ce compte a été supprimé."
        )}
      </S.ErrorMessageContainer>
    );
  }
  if (props.resetPasswordNotPossible) {
    return (
      <>
        <S.ResetPasswordMessage>
          {props.t(
            "Login.Reset password message",
            "Attention, si vous n'avez pas configuré d'email, vous ne pourrez pas réinitialiser votre mot de passe."
          )}
        </S.ResetPasswordMessage>

      </>
    );
  }
  if (props.resetPasswordPossible) {
    return (
      <>
        <div>
          <button onClick={props.resetPassword} className="footer-link">
            {props.t("Login.Renvoyer le lien", "Renvoyer le lien")}
          </button>
        </div>
        <div style={{ marginTop: 16 }}>
          <ContactSupport />
        </div>
      </>
    );
  }

  // STEPS
  if (props.step === 0) {
    return (
      <>
        <S.FooterLinkContainer>
          {props.t("Login.Pas encore de compte ?", "Pas encore de compte ?")}{" "}
          <Link to={{ pathname: "/register"}} className="footer-link">
            {props.t("Login.Créez un compte", "Créez un compte")}
          </Link>
        </S.FooterLinkContainer>
        <S.FooterLinkContainer style={{marginTop: 0, fontWeight: "bold"}}>
          {props.t("Login.Pseudonyme oublié ?", "Pseudonyme oublié ?")}{" "}
          <ContactSupport />
        </S.FooterLinkContainer>
      </>
    )
  }
  if (props.step === 1 && (!props.newAdminWithoutPhoneOrEmail && !props.newHasStructureWithoutPhoneOrEmail)) {
    return (
      <S.FooterLinkContainer>
        <button onClick={props.resetPassword} className="footer-link">
          {props.t("Login.Mot de passe oublié ?", "J'ai oublié mon mot de passe")}
        </button>
      </S.FooterLinkContainer>
    )
  }
  if (props.step === 2) {
    return (
      <>
        <S.FooterLinkContainer style={{ marginBottom: 8 }}>
          Vous n'avez pas reçu le code à ce numéro ?
          <button onClick={props.login} className="footer-link">
            {props.t("Login.Renvoyer le code", "Renvoyer le code")}
          </button>
        </S.FooterLinkContainer>
        <S.FooterLinkContainer style={{ marginTop: 0 }}>
          Le numéro n’est plus valable ?
          <button onClick={contactSupportCallback} className="footer-link">
            Contactez un administrateur pour le modifier.
          </button>
        </S.FooterLinkContainer>
      </>
    );
  }
  return false;
};
