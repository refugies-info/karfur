import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import FButton from "components/UI/FButton/FButton";

interface Props {
  goBack: () => void;
  step: number;
}
const GoBackButton = (props: Props) => {
  const { t } = useTranslation();

  if (props.step === 0) {
    return (
      <Link legacyBehavior href="/" passHref>
        <FButton type="light-action" name="arrow-back-outline" className="me-2" tag="a">
          {t("Retour", "Retour")}
        </FButton>
      </Link>
    );
  }

  return (
    <FButton type="light-action" name="arrow-back-outline" className="me-2" onClick={props.goBack}>
      {t("Retour", "Retour")}
    </FButton>
  );
};

export default GoBackButton;
