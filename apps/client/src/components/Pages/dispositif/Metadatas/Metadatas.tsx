import { ContentType, GetDispositifResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import CardInfo from "~/components/Pages/dispositif/Metadatas/CardInfo";
import { cn } from "~/lib/classname";
import CardAvailability from "./CardAvailability";
import CardConditions from "./CardConditions";
import CardLocation from "./CardLocation";
import CardPublic from "./CardPublic";

interface Props {
  metadatas: GetDispositifResponse["metadatas"] | undefined;
  typeContenu: ContentType;
  className?: string;
}

/**
 * Shows the metadatas of a dispositif, with Cards, in VIEW mode
 */
const Metadatas = ({ metadatas, typeContenu, className }: Props) => {
  const { t } = useTranslation();

  if (!metadatas) return <></>;
  return (
    <div id="anchor-who" className={cn(className)}>
      <h2 className="text-title-lg font-bold md:hidden">{t("Dispositif.importantInformations")}</h2>

      <CardPublic />
      <CardInfo />
      {(metadatas.commitment || metadatas.frequency || metadatas.timeSlots) && (
        <CardAvailability
          dataCommitment={metadatas.commitment}
          dataFrequency={metadatas.frequency}
          dataTimeSlots={metadatas.timeSlots}
        />
      )}
      {metadatas.conditions && <CardConditions data={metadatas.conditions} />}
      {metadatas.location && <CardLocation data={metadatas.location} typeContenu={typeContenu} />}
    </div>
  );
};

export default Metadatas;
