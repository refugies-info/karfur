import React from "react";
import { useTranslation } from "next-i18next";
import FInput from "components/UI/FInput/FInput";
import FButton from "components/UI/FButton/FButton";
import styles from "scss/components/login.module.scss";

interface Props {
  value: string;
  pseudoAlreadyTaken: boolean;
  step: number,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const UsernameField = (props: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <div
        key="username-field"
        style={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ marginTop: "10px" }}>
          <FInput
            prepend
            prependName="person-outline"
            id="username"
            type="text"
            placeholder={t("Login.Pseudonyme", "Pseudonyme")}
            autoComplete="username"
            error={props.pseudoAlreadyTaken}
            errorIcon="person"
            newSize
            onChange={props.onChange}
          />
        </div>
        <div style={{ marginLeft: "10px" }}>
          <FButton
            type="validate-light"
            name="arrow-forward-outline"
            disabled={!props.value}
          >
            {t("Suivant", "Suivant")}
          </FButton>
        </div>
      </div>
      <div className={styles.precisions_message}>
        <div>
          {t(
            "Register.Pseudo usage",
            "Ce pseudonyme apparaîtra sur les fiches auxquelles vous allez contribuer."
          )}
        </div>
        <div>
          {t("Register.Exemples", "Exemples : Guillaume Dupont, Nora78")}
        </div>
      </div>

      {props.pseudoAlreadyTaken && (
        <div className={styles.error_message}>
          <b>
            {t(
              "Register.Oups, ce pseudonyme existe déjà.",
              "Oups, ce pseudonyme existe déjà."
            )}
          </b>{" "}
        </div>
      )}
    </>
  );
};

export default UsernameField
