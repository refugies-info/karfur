import React from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import isUndefined from "lodash/isUndefined";
import { ContentType, GetDispositifResponse } from "api-types";
import FRLink from "components/UI/FRLink";
import { getSponsorLink } from "./functions";
import Card from "./BaseCard";
import CardPrice from "./CardPrice";
import CardAvailability from "./CardAvailability";
import CardPublic from "./CardPublic";
import CardConditions from "./CardConditions";
import CardLocation from "./CardLocation";
import defaultStructureImage from "assets/recherche/default-structure-image.svg";
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
      <Card
        title={
          typeContenu === ContentType.DISPOSITIF ? (
            <>
              {t("Dispositif.with")}{" "}
              <span className={styles.marque} style={{ backgroundColor: color }}>
                {titreMarque}
              </span>
            </>
          ) : (
            t("Dispositif.proposedBy")
          )
        }
        items={[
          {
            label: typeContenu === ContentType.DISPOSITIF ? t("Dispositif.proposedBy") : undefined,
            content: <FRLink href={getSponsorLink(mainSponsor?._id.toString())}>{mainSponsor?.nom}</FRLink>,
            icon: (
              <Image
                src={mainSponsor?.picture?.secure_url || defaultStructureImage}
                width={32}
                height={32}
                style={{ objectFit: "contain" }}
                alt={mainSponsor?.nom || ""}
                className={styles.img}
              />
            ),
          },
        ]}
        color={color}
      />

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
