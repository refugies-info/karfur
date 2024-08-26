import FreeIcon from "@/assets/dispositif/metadatas/Free";
import PriceIcon from "@/assets/dispositif/metadatas/Price";
import { Metadatas } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import BaseCard from "../BaseCard";
import { getPrice } from "../functions";

interface Props {
  data: Metadatas["price"] | null | undefined; // null = not useful / undefined = not set yet
  color: string;
  onClick?: () => void;
}

const CardPrice = ({ data, color, onClick }: Props) => {
  const { t } = useTranslation();

  return (
    <BaseCard
      title={t("Infocards.price")}
      items={
        data === null
          ? null
          : [
              {
                content: getPrice(data, t),
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
