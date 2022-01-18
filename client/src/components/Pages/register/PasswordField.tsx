import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Progress } from "reactstrap";
import { computePasswordStrengthScore } from "lib/index";
import FInput from "components/FigmaUI/FInput/FInput";
import FButton from "components/FigmaUI/FButton/FButton";
import { colorAvancement } from "components/Functions/ColorFunctions";
import styles from "scss/components/errors.module.scss";

const ProgressContainer = styled.div`
  width: 30%;
  margin-right: 16px;
`;
const StrenghText = styled.div`
font-weight: bold;
font-size: 12px;
line-height: 15px;
`;

interface Props {
  value: string
  id: string
  passwordVisible: boolean
  weakPasswordError: any
  onShowPassword: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const getStrength = (score: number) => {
  if (score > 0.75) return "Fort";
  else if (score > 0.25) return "Moyen";
  return "Faible";
};

const PasswordField = (props: Props) => {
  const passwordScore = computePasswordStrengthScore(props.value).score;
  const { t } = useTranslation();

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
            onAppendClick={props.onShowPassword}
            onChange={props.onChange}
            type={props.passwordVisible ? "text" : "password"}
            id={props.id}
            placeholder={t("Login.Mot de passe", "Mot de passe")}
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
            {t("Suivant", "Suivant")}
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
              {t(
                "Register." + getStrength(passwordScore / 4),
                getStrength(passwordScore / 4)
              )}
            </StrenghText>
          </div>
        </>
      )}
      {((props.value && passwordScore < 1) || props.weakPasswordError) && (
        <div className={styles.error_message}>
          <b>
            {t(
              "Register.Mot de passe trop faible",
              "Oups, votre mot de passe est trop faible."
            )}
          </b>
        </div>
      )}
    </>
  );
};

export default PasswordField;
