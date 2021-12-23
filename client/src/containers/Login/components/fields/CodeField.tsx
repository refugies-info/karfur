import React from "react";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import FInput from "../../../../components/FigmaUI/FInput/FInput";
import * as S from "../../styles";


interface Props {
  value: string
  onChange: void
  t: any
  wrongAdminCodeError: boolean
}

export const CodeField = (props: Props) => (
  <>
    <S.InputContainer key="code-field">
      <div style={{ marginTop: 10 }}>
        <FInput
          prepend
          prependName="lock-outline"
          id="code"
          type="number"
          placeholder={props.t("Login.Entrez votre code", "Entrez votre code")}
          error={props.wrongAdminCodeError}
          errorIcon="lock"
          onChange={props.onChange}
          newSize
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
    {props.wrongAdminCodeError && (
      <S.ErrorMessageContainer>
        <b>
          {props.t(
            "Login.Le code saisi n'est pas le bon.",
            "Le code saisi n'est pas le bon."
          )}
        </b>
      </S.ErrorMessageContainer>
    )}
  </>
);
