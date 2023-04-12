import React from "react";
import { Metadatas } from "api-types";
import BaseCard from "../BaseCard";
import { getPrice } from "../functions";
import FreeIcon from "assets/dispositif/metadatas/Free";
import PriceIcon from "assets/dispositif/metadatas/Price";
import styles from "./CardPrice.module.scss";

interface Props {
  data: Metadatas["price"] | null | undefined; // null = not useful / undefined = not set yet
  color: string;
  onClick?: () => void;
}

const CardPrice = ({ data, color, onClick }: Props) => {
  return (
    <BaseCard
      title="Prix"
      items={
        data === null
          ? null
          : [
              {
                content: getPrice(data),
                icon: data?.values?.[0] === 0 ? <FreeIcon color={color} /> : <PriceIcon color={color} />,
              },
            ]
      }
      color={color}
      onClick={onClick}
    />
  );
};

export default CardPrice;
