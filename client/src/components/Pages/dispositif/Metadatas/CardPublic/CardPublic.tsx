import React from "react";
import { Metadatas } from "api-types";
import BaseCard from "../BaseCard";
import { BaseCardStatus } from "../BaseCard/BaseCard";
import { getAge, getAgeLink, getFrenchLevelLink, getPublic } from "../functions";
import FRLink from "components/UI/FRLink";
import AgeIcon from "assets/dispositif/metadatas/Age";
import FrenchLevelIcon from "assets/dispositif/metadatas/FrenchLevel";
import StatusIcon from "assets/dispositif/metadatas/Status";
import styles from "./CardPublic.module.scss";

interface Props {
  dataPublic: Metadatas["public"] | undefined;
  dataFrenchLevel: Metadatas["frenchLevel"] | undefined;
  dataAge: Metadatas["age"] | undefined;
  color: string;
  status?: BaseCardStatus;
  onClick?: () => void;
}

const CardPublic = ({ dataPublic, dataFrenchLevel, dataAge, color, status, onClick }: Props) => {
  return (
    <BaseCard
      title="Public visé"
      items={[
        { label: "Statut", content: getPublic(dataPublic), icon: <StatusIcon color={color} /> },
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
      status={status}
      onClick={onClick}
    />
  );
};

export default CardPublic;
