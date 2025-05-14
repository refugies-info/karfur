import { Metadatas } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import FreeIcon from "~/assets/dispositif/metadatas/Free";
import PriceIcon from "~/assets/dispositif/metadatas/Price";
import BaseCard from "../BaseCard";
import { getPrice } from "../functions";

interface Props {
  data: Metadatas["price"] | null | undefined; // null = not useful / undefined = not set yet
  onClick?: () => void;
}

const CardPrice = ({ data, onClick }: Props) => {
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
                icon: data?.values?.[0] === 0 ? <FreeIcon /> : <PriceIcon />,
              },
            ]
      }
      onClick={onClick}
    />
  );
};

export default CardPrice;
