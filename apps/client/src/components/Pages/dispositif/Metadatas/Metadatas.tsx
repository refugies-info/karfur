import { ContentType, GetDispositifResponse } from "@refugies-info/api-types";
import isUndefined from "lodash/isUndefined";
import { useTranslation } from "next-i18next";
import CardAvailability from "./CardAvailability";
import CardConditions from "./CardConditions";
import CardLocation from "./CardLocation";
import CardPrice from "./CardPrice";
import CardPublic from "./CardPublic";
import styles from "./Metadatas.module.scss";

interface Props {
  metadatas: GetDispositifResponse["metadatas"] | undefined;
  titreMarque?: GetDispositifResponse["titreMarque"];
  mainSponsor: GetDispositifResponse["mainSponsor"];
  color: string;
  typeContenu: ContentType;
}

/**
 * Shows the metadatas of a dispositif, with Cards, in VIEW mode
 */
const Metadatas = ({ metadatas, titreMarque, mainSponsor, color, typeContenu }: Props) => {
  const { t } = useTranslation();

  if (!metadatas) return <></>;
  return (
    <div id="anchor-who">
      <p className={styles.title} style={{ color }}>
        {t("Dispositif.importantInformations")}
      </p>

      {(!isUndefined(metadatas.publicStatus) ||
        !isUndefined(metadatas.public) ||
        !isUndefined(metadatas.frenchLevel) ||
        !isUndefined(metadatas.age)) && (
        <CardPublic
          dataPublicStatus={metadatas.publicStatus}
          dataPublic={metadatas.public}
          dataFrenchLevel={metadatas.frenchLevel}
          dataAge={metadatas.age}
          color={color}
        />
      )}
      {metadatas.price && <CardPrice data={metadatas.price} color={color} />}
      {(metadatas.commitment || metadatas.frequency || metadatas.timeSlots) && (
        <CardAvailability
          dataCommitment={metadatas.commitment}
          dataFrequency={metadatas.frequency}
          dataTimeSlots={metadatas.timeSlots}
          color={color}
        />
      )}
      {metadatas.conditions && <CardConditions data={metadatas.conditions} color={color} />}
      {metadatas.location && <CardLocation data={metadatas.location} typeContenu={typeContenu} color={color} />}
    </div>
  );
};

export default Metadatas;
