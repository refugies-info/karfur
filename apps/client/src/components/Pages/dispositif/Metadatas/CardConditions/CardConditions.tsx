import { Metadatas } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import BaseCard from "../BaseCard";
import { getConditionImage } from "../functions";

interface Props {
  data: Metadatas["conditions"] | null | undefined; // null = not useful / undefined = not set yet
  color: string;
  onClick?: () => void;
}

const CardConditions = ({ data, color, onClick }: Props) => {
  const { t } = useTranslation();

  return (
    <BaseCard
      title={t("Infocards.conditions")}
      items={
        data === null
          ? null
          : (data || []).map((item) => ({
              content: t(`Infocards.${item}`),
              icon: getConditionImage(item) ? (
                <Image src={getConditionImage(item)} width={32} height={32} alt="" />
              ) : null,
            }))
      }
      color={color}
      onClick={onClick}
    />
  );
};

export default CardConditions;
