import React from "react";
import Image from "next/image";
import { Metadatas } from "api-types";
import BaseCard from "../BaseCard";
import { BaseCardStatus } from "../BaseCard/BaseCard";
import { getConditionImage } from "../functions";
import styles from "./CardConditions.module.scss";

interface Props {
  data: Metadatas["conditions"] | undefined;
  color: string;
  status?: BaseCardStatus;
  onClick?: () => void;
}

const CardConditions = ({ data, color, status, onClick }: Props) => {
  return (
    <BaseCard
      title="Conditions"
      items={
        data?.map((item) => ({
          // TODO: translate
          content: item,
          icon: <Image src={getConditionImage(item)} width={32} height={32} alt="" />,
        })) || []
      }
      color={color}
      status={status}
      onClick={onClick}
    />
  );
};

export default CardConditions;
