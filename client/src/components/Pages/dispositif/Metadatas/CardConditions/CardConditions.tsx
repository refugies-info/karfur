import React from "react";
import Image from "next/image";
import { Metadatas } from "api-types";
import BaseCard from "../BaseCard";
import { getConditionImage } from "../functions";
import styles from "./CardConditions.module.scss";

interface Props {
  data: Metadatas["conditions"] | null | undefined; // null = not useful / undefined = not set yet
  color: string;
  onClick?: () => void;
}

const CardConditions = ({ data, color, onClick }: Props) => {
  return (
    <BaseCard
      title="Conditions"
      items={
        data === null
          ? null
          : (data || []).map((item) => ({
              // TODO: translate
              content: item,
              icon: <Image src={getConditionImage(item)} width={32} height={32} alt="" />,
            }))
      }
      color={color}
      onClick={onClick}
    />
  );
};

export default CardConditions;
