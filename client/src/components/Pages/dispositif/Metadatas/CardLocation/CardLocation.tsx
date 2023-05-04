import React, { useMemo } from "react";
import { ContentType, Metadatas } from "api-types";
import { useTranslation } from "next-i18next";
import { formatDepartment } from "lib/departments";
import FRLink from "components/UI/FRLink";
import BaseCard from "../BaseCard";
import { getLocationLink } from "../functions";
import LocationIcon from "assets/dispositif/metadatas/Location";
import styles from "./CardLocation.module.scss";

interface Props {
  data: Metadatas["location"] | null | undefined; // null = not useful / undefined = not set yet
  typeContenu: ContentType;
  color: string;
  onClick?: () => void;
}

const CardLocation = ({ data, typeContenu, color, onClick }: Props) => {
  const { t } = useTranslation();

  const links = useMemo(() => {
    if (!data) return data;
    if (!Array.isArray(data)) {
      return (
        <FRLink href={getLocationLink(data)}>
          {data === "france" ? t("Infocards.france") : t("Recherche.online")}
        </FRLink>
      );
    }
    return (
      <>
        {data.map((dep, i) => (
          <span key={i}>
            <FRLink href={getLocationLink(dep)}>{formatDepartment(dep)}</FRLink>
            <br />
          </span>
        ))}
      </>
    );
  }, [data, t]);

  return (
    <BaseCard
      title={t("Infocards.location")}
      items={
        data === null
          ? null
          : [
              {
                content: typeContenu === ContentType.DISPOSITIF ? links : undefined,
                icon: <LocationIcon color={color} />,
              },
            ]
      }
      color={color}
      onClick={onClick}
    />
  );
};

export default CardLocation;
