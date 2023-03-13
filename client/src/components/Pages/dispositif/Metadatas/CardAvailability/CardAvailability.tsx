import React from "react";
import { Metadatas } from "api-types";
import BaseCard from "../BaseCard";
import { BaseCardStatus } from "../BaseCard/BaseCard";
import DurationIcon from "assets/dispositif/metadatas/Durations";
import styles from "./CardAvailability.module.scss";

interface Props {
  data: Metadatas["duration"] | undefined;
  color: string;
  status?: BaseCardStatus;
  onClick?: () => void;
}

const CardAvailability = ({ data, color, status, onClick }: Props) => {
  return (
    <BaseCard
      title="Disponibilité demandée"
      items={[{ label: "Durée d'engagement", content: data, icon: <DurationIcon color={color} /> }]}
      color={color}
      status={status}
      onClick={onClick}
    />
  );
};

export default CardAvailability;
