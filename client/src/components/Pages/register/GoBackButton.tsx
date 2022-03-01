import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import FButton from "components/UI/FButton/FButton";

interface Props {
  step: number
  goBack: () => void
}

const GoBackButton = (props: Props) => {
  const { t } = useTranslation();

  if (props.step === 0) {
    return (
      <Link href="/" passHref>
        <FButton
          type="light-action"
          name="arrow-back-outline"
          className="mr-10"
          tag="a"
        >
          {t("Retour", "Retour")}
        </FButton>
      </Link>
    );
  }

  return (
    <FButton
      type="light-action"
      name="arrow-back-outline"
      className="mr-10"
      onClick={props.goBack}
    >
      {t("Retour", "Retour")}
    </FButton>
  );
};

export default GoBackButton;
