import React from "react";
import { Metadatas } from "api-types";
import BaseCard from "../BaseCard";
import { BaseCardStatus } from "../BaseCard/BaseCard";
import { getPrice } from "../functions";
import FreeIcon from "assets/dispositif/metadatas/Free";
import PriceIcon from "assets/dispositif/metadatas/Price";
import styles from "./CardPrice.module.scss";

interface Props {
  data: Metadatas["price"] | null | undefined;
  color: string;
  status?: BaseCardStatus;
  onClick?: () => void;
}

const CardPrice = ({ data, color, status, onClick }: Props) => {
  return (
    <BaseCard
      title="Prix"
      items={[
        {
          content: getPrice(data),
          icon: data?.value === 0 ? <FreeIcon color={color} /> : <PriceIcon color={color} />,
        },
      ]}
      color={color}
      status={status}
      onClick={onClick}
    />
  );
};

export default CardPrice;
