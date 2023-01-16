import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { getPasswordStrength } from "lib/validatePassword";
import FInput from "components/UI/FInput/FInput";
import FButton from "components/UI/FButton/FButton";
import PasswordStrength from "components/User/PasswordStrength";
import styles from "./PasswordField.module.scss";
import commonStyles from "scss/components/login.module.scss";

interface Props {
  value: string;
  id: string;
  passwordVisible: boolean;
  weakPasswordError: any;
  onShowPassword: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextButtonText: string;
}

const PasswordField = (props: Props) => {
  const { t } = useTranslation();
  const passwordStrength = useMemo(() => getPasswordStrength(props.value), [props.value]);

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
          <FButton type="validate-light" name="checkmark-outline" disabled={!passwordStrength.isOk}>
            {props.nextButtonText}
          </FButton>
        </div>
      </div>
      <PasswordStrength password={props.value} />
      {props.weakPasswordError && (
        <div className={commonStyles.error_message}>
          <b>{t("Register.Mot de passe trop faible", "Oups, votre mot de passe est trop faible.")}</b>
        </div>
      )}
    </>
  );
};

export default PasswordField;
