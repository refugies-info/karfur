import React from "react";
import { Metadatas } from "api-types";
import BaseCard from "../BaseCard";
import { getAge, getAgeLink, getFrenchLevelLink } from "../functions";
import FRLink from "components/UI/FRLink";
import AgeIcon from "assets/dispositif/metadatas/Age";
import FrenchLevelIcon from "assets/dispositif/metadatas/FrenchLevel";
import StatusIcon from "assets/dispositif/metadatas/Status";
import styles from "./CardPublic.module.scss";

interface Props {
  dataPublicStatus: Metadatas["publicStatus"] | undefined;
  dataPublic: Metadatas["public"] | undefined;
  dataFrenchLevel: Metadatas["frenchLevel"] | undefined;
  dataAge: Metadatas["age"] | undefined;
  color: string;
  onClick?: () => void;
}

const CardPublic = ({ dataPublicStatus, dataPublic, dataFrenchLevel, dataAge, color, onClick }: Props) => {
  return (
    <BaseCard
      title="Public visé"
      items={[
        // TODO: translate
        { label: "Statut", content: dataPublicStatus?.join(", "), icon: <StatusIcon color={color} /> },
        // TODO: translate
        { label: "Public spécifique", content: dataPublic?.join(", "), icon: <StatusIcon color={color} /> },
        {
          label: "Français demandé",
          content:
            !dataFrenchLevel || dataFrenchLevel.length === 0 ? null : (
              <FRLink target="_blank" href={getFrenchLevelLink(dataFrenchLevel)}>
                {dataFrenchLevel?.join(", ")}
              </FRLink>
            ),
          icon: <FrenchLevelIcon color={color} />,
        },
        {
          label: "Âge demandé",
          content: !dataAge ? null : (
            <FRLink target="_blank" href={getAgeLink(dataAge)}>
              {getAge(dataAge)}
            </FRLink>
          ),
          icon: <AgeIcon color={color} />,
        },
      ]}
      color={color}
      onClick={onClick}
    />
  );
};

export default CardPublic;
