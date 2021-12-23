import React from "react";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import FInput from "../../../../components/FigmaUI/FInput/FInput";
import * as S from "../../styles";

interface Props {
  id: string
  value: string
  onChange: void
  passwordVisible: boolean
  wrongPasswordError: boolean
  onClick: any
  t: any
}

export const PasswordField = (props: Props) => (
  <>
    <S.InputContainer>
      <div style={{ marginTop: 10 }}>
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
          type={props.passwordVisible ? "text" : "password"}
          placeholder={props.t("Login.Mot de passe", "Mot de passe")}
          autoComplete="new-password"
          error={props.wrongPasswordError}
          errorIcon="lock"
          errorType="wrongPassword"
          newSize
          onChange={props.onChange}
          id={props.id}
        />
      </div>
      <div style={{ marginLeft: 10 }}>
        <FButton
          type="validate-light"
          name="checkmark-outline"
          disabled={!props.value}
        >
          {props.t("Valider", "Valider")}
        </FButton>
      </div>
    </S.InputContainer>
    {props.wrongPasswordError && (
      <S.ErrorMessageContainer>
        {props.t(
          "Login.Mauvais mot de passe",
          "Erreur, mauvais mot de passe : "
        )}
        <b>{props.t("Login.Reessayez", "réessayez !")}</b>
      </S.ErrorMessageContainer>
    )}
  </>
);
