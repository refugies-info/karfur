import React from "react";
import Image from "next/image";
import { ContentType, GetDispositifResponse } from "api-types";
import FRLink from "components/UI/FRLink";
import { getSponsorLink } from "./functions";
import Card from "./BaseCard";
import CardPrice from "./CardPrice";
import CardAvailability from "./CardAvailability";
import CardPublic from "./CardPublic";
import CardConditions from "./CardConditions";
import CardLocation from "./CardLocation";
import styles from "./Metadatas.module.scss";

interface Props {
  metadatas: GetDispositifResponse["metadatas"] | undefined;
  titreMarque?: GetDispositifResponse["titreMarque"];
  mainSponsor: GetDispositifResponse["mainSponsor"];
  color: string;
  typeContenu: ContentType;
}

const Metadatas = ({ metadatas, titreMarque, mainSponsor, color, typeContenu }: Props) => {
  if (!metadatas) return <></>;
  return (
    <div id="anchor-who">
      <p className={styles.title} style={{ color }}>
        C'est pour qui ?
      </p>
      <Card
        title={
          typeContenu === ContentType.DISPOSITIF ? (
            <>
              Avec{" "}
              <span className={styles.marque} style={{ backgroundColor: color }}>
                {titreMarque}
              </span>
            </>
          ) : (
            "Proposé par"
          )
        }
        items={[
          {
            label: typeContenu === ContentType.DISPOSITIF ? "Proposé par" : undefined,
            content: (
              <FRLink target="_blank" href={getSponsorLink(mainSponsor?._id.toString())}>
                {mainSponsor?.nom}
              </FRLink>
            ),
            icon: (
              <Image
                src={mainSponsor?.picture.secure_url || ""}
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

      {(metadatas.publicStatus || metadatas.public || metadatas.frenchLevel || metadatas.age) && (
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
