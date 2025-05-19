import { Metadatas } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useContext, useMemo } from "react";
import FRLink from "~/components/UI/FRLink";
import { Event } from "~/lib/tracking";
import PageContext from "~/utils/pageContext";
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

interface Props {
  dataPublicStatus: Metadatas["publicStatus"] | undefined;
  dataPublic: Metadatas["public"] | undefined;
  dataFrenchLevel: Metadatas["frenchLevel"] | undefined;
  dataAge: Metadatas["age"] | undefined;
  onClick?: () => void;
}

const CardPublic = ({ dataPublicStatus, dataPublic, dataFrenchLevel, dataAge, onClick }: Props) => {
  const { t } = useTranslation();
  const { mode } = useContext(PageContext);
  const isEditMode = useMemo(() => mode === "edit", [mode]);

  return (
    <BaseCard
      title={t("Infocards.publicTitle")}
      items={[
        {
          label: t("Infocards.publicStatus"),
          content: getPublicStatus(dataPublicStatus, t),
          icon: <i className="ri-id-card-line [&::before]:![--icon-size:1.36rem]" />,
          defaultValue: getAllPublicStatus(t),
        },
        {
          label: t("Infocards.public"),
          content: getPublic(dataPublic, t),
          icon: <i className="fr-icon-group-line [&::before]:![--icon-size:1.36rem]" />,
        },
        {
          label: t("Infocards.frenchLevel"),
          content:
            !dataFrenchLevel || dataFrenchLevel.length === 0 ? (
              dataFrenchLevel
            ) : (
              <FRLink
                href={isEditMode ? "#" : getFrenchLevelLink(dataFrenchLevel)}
                onClick={() => Event("DISPO_VIEW", "click french level", "Left sidebar")}
              >
                {getFrenchLevel(dataFrenchLevel, t)}
              </FRLink>
            ),
          icon: <i className="fr-icon-discuss-line [&::before]:![--icon-size:1.36rem]" />,
          defaultValue: (
            <FRLink
              href={isEditMode ? "#" : getFrenchLevelLink([])}
              onClick={() => Event("DISPO_VIEW", "click french level", "Left sidebar")}
            >
              {getAllFrenchLevel(t)}
            </FRLink>
          ),
        },
        {
          label: t("Infocards.age"),
          content: !dataAge ? (
            dataAge
          ) : (
            <FRLink href={isEditMode ? "#" : getAgeLink(dataAge)}>{getAge(dataAge, t)}</FRLink>
          ),
          icon: <i className="fr-icon-parent-line [&::before]:![--icon-size:1.36rem]" />,
          defaultValue: (
            <FRLink
              href={isEditMode ? "#" : getAgeLink(undefined)}
              onClick={() => Event("DISPO_VIEW", "click age", "Left sidebar")}
            >
              Tous les âges
            </FRLink>
          ),
        },
      ]}
      onClick={onClick}
    />
  );
};

export default CardPublic;
