import React from "react";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import FInput from "../../../../components/FigmaUI/FInput/FInput";
import * as S from "../../styles";

interface Props {
  value: string
  onChange: void
  t: any
  noUserError: boolean
}

export const UsernameField = (props: Props) => (
  <>
    <S.InputContainer key="username-field">
      <div style={{ marginTop: 10 }}>
        <FInput
          prepend
          prependName="person-outline"
          id="username"
          type="username"
          placeholder={props.t("Login.Pseudonyme", "Pseudonyme")}
          autoComplete="username"
          error={props.noUserError}
          onChange={props.onChange}
          errorIcon="person"
          newSize
        />
      </div>
      <div style={{ marginLeft: 10 }}>
        <FButton
          type="validate-light"
          name="arrow-forward-outline"
          disabled={!props.value}
        >
          {props.t("Suivant", "Suivant")}
        </FButton>
      </div>
    </S.InputContainer>
    {props.noUserError && (
      <S.ErrorMessageContainer>
        <b>{props.t("Login.Oups,", "Oups,")}</b>{" "}
        {props.t(
          "Login.Pas de compte",
          "il n'existe pas de compte à ce nom."
        )}
      </S.ErrorMessageContainer>
    )}
  </>
);
