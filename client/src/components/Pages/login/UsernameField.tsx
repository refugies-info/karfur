import React, { ChangeEventHandler } from "react";
import { useTranslation } from "next-i18next";
import FButton from "components/FigmaUI/FButton/FButton";
import FInput from "components/FigmaUI/FInput/FInput";
import styles from "scss/components/login.module.scss";

interface Props {
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  noUserError: boolean
}

const UsernameField = (props: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.input_container}>
        <div style={{ marginTop: 10 }}>
          <FInput
            prepend
            prependName="person-outline"
            id="username"
            type="text"
            placeholder={t("Login.Pseudonyme", "Pseudonyme")}
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
            {t("Suivant", "Suivant")}
          </FButton>
        </div>
      </div>
      {props.noUserError && (
        <div className={styles.error_message}>
          <b>{t("Login.Oups,", "Oups,")}</b>{" "}
          {t(
            "Login.Pas de compte",
            "il n'existe pas de compte à ce nom."
          )}
        </div>
      )}
    </>
  )
}

export default UsernameField;
