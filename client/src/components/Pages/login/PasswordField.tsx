import React, { ChangeEventHandler } from "react";
import { useTranslation } from "next-i18next";
import FButton from "components/FigmaUI/FButton/FButton";
import FInput from "components/FigmaUI/FInput/FInput";
import styles from "scss/components/login.module.scss";

interface Props {
  id: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onClick: any
  passwordVisible: boolean
  wrongPasswordError: boolean
}

const PasswordField = (props: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.input_container}>
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
            placeholder={t("Login.Mot de passe", "Mot de passe")}
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
            {t("Valider", "Valider")}
          </FButton>
        </div>
      </div>
      {props.wrongPasswordError && (
        <div className={styles.error_message}>
          {t(
            "Login.Mauvais mot de passe",
            "Erreur, mauvais mot de passe : "
          )}
          <b>{t("Login.Reessayez", "réessayez !")}</b>
        </div>
      )}
    </>
  )
}

export default PasswordField;
