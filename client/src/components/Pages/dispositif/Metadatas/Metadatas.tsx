import { GetDispositifResponse } from "api-types";
import React from "react";
import Image from "next/image";
import { getAge, getPrice, getPublic } from "./functions";
import Card from "./Card";
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
import { Link as DSFRLink } from "@dataesr/react-dsfr";
import Link from "next/link";
import { getPath } from "routes";

interface Props {
  metadatas: GetDispositifResponse["metadatas"] | undefined;
  titreMarque?: GetDispositifResponse["titreMarque"];
  mainSponsor: GetDispositifResponse["mainSponsor"];
  color: string;
}

const Metadatas = ({ metadatas, titreMarque, mainSponsor, color }: Props) => {
  if (!metadatas) return <></>;
  return (
    <div>
      <Card
        title={
          <>
            Avec{" "}
            <span className={styles.marque} style={{ backgroundColor: color }}>
              {titreMarque}
            </span>
          </>
        }
        items={[
          {
            label: "Proposé par",
            content: mainSponsor?.nom,
            icon: (
              <Image
                src={mainSponsor?.picture.secure_url || ""}
                width={32}
                height={32}
                style={{ objectFit: "contain" }}
                alt={mainSponsor?.nom || ""}
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
            content: (
              <>
                <DSFRLink
                  as={
                    <Link href={getPath("/recherche", "fr", `?frenchLevel=${"a"}`)}>
                      {metadatas.frenchLevel?.join(", ")}
                    </Link>
                  }
                  className={styles.link}
                />
              </>
            ),
            icon: <FrenchLevelIcon color={color} />,
          },
          {
            label: "Âge demandé",
            content: (
              <>
                <>
                  <DSFRLink
                    as={<Link href={getPath("/recherche", "fr", `?age=${"a"}`)}>{getAge(metadatas.age)}</Link>}
                    className={styles.link}
                  />
                </>
              </>
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
            content: (
              <>
                {metadatas.location?.map((dep, i) => (
                  <>
                    <DSFRLink
                      as={<Link href={getPath("/recherche", "fr", `?departments=${dep.split(" - ")[1]}`)}>{dep}</Link>}
                      key={i}
                      className={styles.link}
                    />
                    <br />
                  </>
                ))}
              </>
            ),
            icon: <LocationIcon color={color} />,
          },
        ]}
        color={color}
      />
    </div>
  );
};

export default Metadatas;
