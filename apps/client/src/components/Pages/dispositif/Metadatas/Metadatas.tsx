import { ContentType, GetDispositifResponse } from "@refugies-info/api-types";
import isUndefined from "lodash/isUndefined";
import { useTranslation } from "next-i18next";
import CardAvailability from "./CardAvailability";
import CardConditions from "./CardConditions";
import CardLocation from "./CardLocation";
import CardPrice from "./CardPrice";
import CardPublic from "./CardPublic";

interface Props {
  metadatas: GetDispositifResponse["metadatas"] | undefined;
  typeContenu: ContentType;
}

/**
 * Shows the metadatas of a dispositif, with Cards, in VIEW mode
 */
const Metadatas = ({ metadatas, typeContenu }: Props) => {
  const { t } = useTranslation();

  if (!metadatas) return <></>;
  return (
    <div id="anchor-who">
      <p>{t("Dispositif.importantInformations")}</p>

      {(!isUndefined(metadatas.publicStatus) ||
        !isUndefined(metadatas.public) ||
        !isUndefined(metadatas.frenchLevel) ||
        !isUndefined(metadatas.age)) && (
        <CardPublic
          dataPublicStatus={metadatas.publicStatus}
          dataPublic={metadatas.public}
          dataFrenchLevel={metadatas.frenchLevel}
          dataAge={metadatas.age}
        />
      )}
      {metadatas.price && <CardPrice data={metadatas.price} />}
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
