import React from "react";
import { useTranslation } from "next-i18next";
import { Progress } from "reactstrap";
import { computePasswordStrengthScore } from "lib/index";
import FInput from "components/UI/FInput/FInput";
import FButton from "components/UI/FButton/FButton";
import { colorAvancement } from "lib/colors";
import styles from "./PasswordField.module.scss";
import commonStyles from "scss/components/login.module.scss";
import { cls } from "lib/classname";

interface Props {
  value: string;
  id: string;
  passwordVisible: boolean;
  weakPasswordError: any;
  onShowPassword: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextButtonText: string;
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
      <div className={styles.container}>
        <div className="mt-2">
          <FInput
            prepend
            append
            autoFocus={props.id === "password"}
            prependName="lock-outline"
            appendName={props.passwordVisible ? "eye-off-2-outline" : "eye-outline"}
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
        <div className="ms-2">
          <FButton type="validate-light" name="checkmark-outline" disabled={passwordScore < 1}>
            {props.nextButtonText}
          </FButton>
        </div>
      </div>
      {props.value && (
        <>
          <div className={cls(styles.container, "mt-4")}>
            <div className={styles.progress}>
              <Progress color={colorAvancement(passwordScore / 4)} value={((0.1 + passwordScore / 4) * 100) / 1.1} />
            </div>
            <div className={styles.score}>
              {/* @ts-ignore */}
              {t("Register." + getStrength(passwordScore / 4), getStrength(passwordScore / 4))}
            </div>
          </div>
        </>
      )}
      {((props.value && passwordScore < 1) || props.weakPasswordError) && (
        <div className={commonStyles.error_message}>
          <b>{t("Register.Mot de passe trop faible", "Oups, votre mot de passe est trop faible.")}</b>
        </div>
      )}
    </>
  );
};

export default PasswordField;
