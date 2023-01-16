import React from "react";
import { useTranslation } from "next-i18next";
import FInput from "components/UI/FInput/FInput";
import PasswordStrength from "components/User/PasswordStrength";
import { Event } from "types/interface";

interface Props {
  value: string;
  id: string;
  onChange: (arg: Event) => void;
  passwordVisible: boolean;
  onClick: () => void;
}

export const PasswordField = (props: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div style={{ marginTop: "10px", width: "480px" }}>
          <FInput
            prepend
            append
            prependName="lock-outline"
            appendName={props.passwordVisible ? "eye-off-2-outline" : "eye-outline"}
            inputClassName="password-input"
            onAppendClick={props.onClick}
            onChange={props.onChange}
            type={props.passwordVisible ? "text" : "password"}
            id={props.id}
            placeholder={t("UserProfile.Votre nouveau mot de passe", "Votre nouveau mot de passe")}
            autoComplete="new-password"
            newSize
            autoFocus={false}
          />
        </div>
      </div>
      <PasswordStrength password={props.value} />
    </>
  );
};
