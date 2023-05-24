import React from "react";
import { useTranslation } from "next-i18next";
import { useEvent } from "hooks";
import { Metadatas } from "@refugies-info/api-types";
import BaseCard from "../BaseCard";
import {
  getAge,
  getAgeLink,
  getAllFrenchLevel,
  getAllPublicStatus,
  getFrenchLevel,
  getFrenchLevelLink,
  getPublic,
  getPublicStatus,
} from "../functions";
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
  const { t } = useTranslation();
  const { Event } = useEvent();

  return (
    <BaseCard
      title={t("Infocards.publicTitle")}
      items={[
        {
          label: t("Infocards.publicStatus"),
          content: getPublicStatus(dataPublicStatus, t),
          icon: <StatusIcon color={color} />,
          defaultValue: getAllPublicStatus(t),
        },
        {
          label: t("Infocards.frenchLevel"),
          content:
            !dataFrenchLevel || dataFrenchLevel.length === 0 ? (
              dataFrenchLevel
            ) : (
              <FRLink
                href={getFrenchLevelLink(dataFrenchLevel)}
                onClick={() => Event("DISPO_VIEW", "click french level", "Left sidebar")}
              >
                {getFrenchLevel(dataFrenchLevel, t)}
              </FRLink>
            ),
          icon: <FrenchLevelIcon color={color} />,
          defaultValue: (
            <FRLink
              href={getFrenchLevelLink([])}
              onClick={() => Event("DISPO_VIEW", "click french level", "Left sidebar")}
            >
              {getAllFrenchLevel(t)}
            </FRLink>
          ),
        },
        {
          label: t("Infocards.age"),
          content: !dataAge ? dataAge : <FRLink href={getAgeLink(dataAge)}>{getAge(dataAge, t)}</FRLink>,
          icon: <AgeIcon color={color} />,
          defaultValue: (
            <FRLink href={getAgeLink(undefined)} onClick={() => Event("DISPO_VIEW", "click age", "Left sidebar")}>
              Tous les âges
            </FRLink>
          ),
        },
        {
          label: t("Infocards.public"),
          content: getPublic(dataPublic, t),
          icon: <StatusIcon color={color} />,
        },
      ]}
      color={color}
      onClick={onClick}
    />
  );
};

export default CardPublic;
