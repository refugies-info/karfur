import React from "react";
import { useTranslation } from "next-i18next";
import FInput from "components/FigmaUI/FInput/FInput";

interface Props {
  value: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  notEmailError: any;
}
const EmailField = (props: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <FInput
        prepend
        prependName="at-outline"
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        type="email"
        placeholder={t("Register.Votre email", "Votre email")}
        error={props.notEmailError}
        errorIcon="at"
        newSize
      />
    </>
  );
};

export default EmailField;
