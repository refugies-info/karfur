import React from "react";
import { Metadatas } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import BaseCard from "../BaseCard";
import { getCommitment, getFrequency, getTimeSlots } from "../functions";
import DurationIcon from "assets/dispositif/metadatas/Durations";
import styles from "./CardAvailability.module.scss";

interface Props {
  dataCommitment: Metadatas["commitment"] | undefined;
  dataTimeSlots: Metadatas["timeSlots"] | undefined;
  dataFrequency: Metadatas["frequency"] | undefined;
  color: string;
  onClick?: () => void;
}

const CardAvailability = ({ dataCommitment, dataTimeSlots, dataFrequency, color, onClick }: Props) => {
  const { t } = useTranslation();

  return (
    <BaseCard
      title={t("Infocards.availability")}
      items={[
        {
          label: t("Infocards.commitment"),
          content: getCommitment(dataCommitment, t),
          icon: <DurationIcon color={color} />,
        },
        {
          label: t("Infocards.frequency"),
          content: getFrequency(dataFrequency, t),
          icon: <DurationIcon color={color} />,
        },
        {
          label: t("Infocards.weekDays"),
          content: getTimeSlots(dataTimeSlots, t),
          icon: <DurationIcon color={color} />,
        },
      ]}
      color={color}
      onClick={onClick}
    />
  );
};

export default CardAvailability;
