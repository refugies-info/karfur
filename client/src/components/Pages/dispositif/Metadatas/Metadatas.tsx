import React from "react";
import Image from "next/image";
import { ContentType, GetDispositifResponse } from "api-types";
import {
  getAge,
  getAgeLink,
  getFrenchLevelLink,
  getLocationLink,
  getPrice,
  getPublic,
  getSponsorLink,
} from "./functions";
import Card from "./Card";
import FRLink from "components/UI/FRLink";
import AgeIcon from "assets/dispositif/metadatas/Age";
import DiplomaIcon from "assets/dispositif/metadatas/Diploma";
import DurationIcon from "assets/dispositif/metadatas/Durations";
import FreeIcon from "assets/dispositif/metadatas/Free";
import FrenchLevelIcon from "assets/dispositif/metadatas/FrenchLevel";
import ImportantIcon from "assets/dispositif/metadatas/Important";
import LocationIcon from "assets/dispositif/metadatas/Location";
import PriceIcon from "assets/dispositif/metadatas/Price";
import PublicIcon from "assets/dispositif/metadatas/Public";
import StatusIcon from "assets/dispositif/metadatas/Status";
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
      <Card
        title="Public visé"
        items={[
          { label: "Statut", content: getPublic(metadatas.public), icon: <StatusIcon color={color} /> },
          {
            label: "Français demandé",
            content:
              !metadatas.frenchLevel || metadatas.frenchLevel.length === 0 ? null : (
                <FRLink target="_blank" href={getFrenchLevelLink(metadatas.frenchLevel)}>
                  {metadatas.frenchLevel?.join(", ")}
                </FRLink>
              ),
            icon: <FrenchLevelIcon color={color} />,
          },
          {
            label: "Âge demandé",
            content: (
              <FRLink target="_blank" href={getAgeLink(metadatas.age)}>
                {getAge(metadatas.age)}
              </FRLink>
            ),
            icon: <AgeIcon color={color} />,
          },
        ]}
        color={color}
      />
      <Card
        title="Prix"
        items={[
          {
            content: getPrice(metadatas.price),
            icon: metadatas.price?.value === 0 ? <FreeIcon color={color} /> : <PriceIcon color={color} />,
          },
        ]}
        color={color}
      />
      <Card
        title="Disponibilité demandée"
        items={[{ label: "Durée d'engagement", content: metadatas.duration, icon: <DurationIcon color={color} /> }]}
        color={color}
      />
      <Card
        title="Zone d'action"
        items={[
          {
            content:
              typeContenu === ContentType.DISPOSITIF ? (
                <>
                  {metadatas.location?.map((dep, i) => (
                    <>
                      <FRLink key={i} target="_blank" href={getLocationLink(dep)}>
                        {dep}
                      </FRLink>
                      <br />
                    </>
                  ))}
                </>
              ) : null,
            icon: <LocationIcon color={color} />,
          },
        ]}
        color={color}
      />
    </div>
  );
};

export default Metadatas;
