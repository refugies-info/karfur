import React from "react";
import { Metadatas } from "api-types";
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
  return (
    <BaseCard
      title="Disponibilité demandée"
      items={[
        { label: "Durée d'engagement", content: getCommitment(dataCommitment), icon: <DurationIcon color={color} /> },
        {
          label: "Fréquence de participation",
          content: getFrequency(dataFrequency),
          icon: <DurationIcon color={color} />,
        },
        // TODO: translate
        { label: "Jours de présence", content: getTimeSlots(dataTimeSlots), icon: <DurationIcon color={color} /> },
      ]}
      color={color}
      onClick={onClick}
    />
  );
};

export default CardAvailability;
