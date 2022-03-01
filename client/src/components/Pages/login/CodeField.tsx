import React, { ChangeEventHandler } from "react";
import { useTranslation } from "next-i18next";
import FButton from "components/UI/FButton/FButton";
import FInput from "components/UI/FInput/FInput";
import styles from "scss/components/login.module.scss";

interface Props {
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  wrongAdminCodeError: boolean
}

const CodeField = (props: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.input_container}>
        <div style={{ marginTop: 10 }}>
          <FInput
            prepend
            prependName="lock-outline"
            id="code"
            type="number"
            placeholder={t("Login.Entrez votre code", "Entrez votre code")}
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
            {t("Valider", "Valider")}
          </FButton>
        </div>
      </div>
      {props.wrongAdminCodeError && (
        <div className={styles.error_message}>
          <b>
            {t(
              "Login.Le code saisi n'est pas le bon.",
              "Le code saisi n'est pas le bon."
            )}
          </b>
        </div>
      )}
    </>
  )
}

export default CodeField;
