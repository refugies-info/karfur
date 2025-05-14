import { Metadatas } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import DurationIcon from "~/assets/dispositif/metadatas/Durations";
import BaseCard from "../BaseCard";
import { getCommitment, getFrequency, getTimeSlots } from "../functions";

interface Props {
  dataCommitment: Metadatas["commitment"] | undefined;
  dataTimeSlots: Metadatas["timeSlots"] | undefined;
  dataFrequency: Metadatas["frequency"] | undefined;
  onClick?: () => void;
}

const CardAvailability = ({ dataCommitment, dataTimeSlots, dataFrequency, onClick }: Props) => {
  const { t } = useTranslation();

  return (
    <BaseCard
      title={t("Infocards.availability")}
      items={[
        {
          label: t("Infocards.commitment"),
          content: getCommitment(dataCommitment, t),
          icon: <DurationIcon />,
        },
        {
          label: t("Infocards.frequency"),
          content: getFrequency(dataFrequency, t),
          icon: <DurationIcon />,
        },
        {
          label: t("Infocards.weekDays"),
          content: getTimeSlots(dataTimeSlots, t),
          icon: <DurationIcon />,
        },
      ]}
      onClick={onClick}
    />
  );
};

export default CardAvailability;
