import { GetDispositifResponse } from "api-types";
import React from "react";
import Card from "./Card";
import { getAge, getPrice, getPublic } from "./functions";

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

interface Props {
  metadatas: GetDispositifResponse["metadatas"] | undefined;
  color: string;
}

const Metadatas = ({ metadatas, color }: Props) => {
  if (!metadatas) return <></>;
  return (
    <div>
      <Card
        title="Public visé"
        items={[
          { label: "Statut", content: getPublic(metadatas.public), icon: <StatusIcon color={color} /> },
          {
            label: "Français demandé",
            content: metadatas.frenchLevel?.join(", "),
            icon: <FrenchLevelIcon color={color} />,
          },
          { label: "Âge demandé", content: getAge(metadatas.age), icon: <AgeIcon color={color} /> },
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
                  <a key={i}>{dep}</a>
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
