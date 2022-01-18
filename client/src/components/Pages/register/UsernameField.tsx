import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import FInput from "components/FigmaUI/FInput/FInput";
import FButton from "components/FigmaUI/FButton/FButton";
import styles from "scss/components/errors.module.scss";

const PseudoPrecisions = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: #828282;
  margin-top: 16px;
`;
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
            type="username"
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
      <PseudoPrecisions>
        <div>
          {t(
            "Register.Pseudo usage",
            "Ce pseudonyme apparaîtra sur les fiches auxquelles vous allez contribuer."
          )}
        </div>
        <div>
          {t("Register.Exemples", "Exemples : Guillaume Dupont, Nora78")}
        </div>
      </PseudoPrecisions>

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
