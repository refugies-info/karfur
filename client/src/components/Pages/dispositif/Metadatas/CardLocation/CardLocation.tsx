import React, { useMemo } from "react";
import { ContentType, Metadatas } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useEvent } from "hooks";
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
  const { Event } = useEvent();

  const links = useMemo(() => {
    if (!data) return data;
    if (!Array.isArray(data)) {
      return (
        <FRLink href={getLocationLink(data)} onClick={() => Event("DISPO_VIEW", "click location", "Left sidebar")}>
          {data === "france" ? t("Infocards.france") : t("Recherche.online")}
        </FRLink>
      );
    }
    return (
      <>
        {data.map((dep, i) => (
          <span key={i}>
            <FRLink href={getLocationLink(dep)} onClick={() => Event("DISPO_VIEW", "click location", "Left sidebar")}>
              {formatDepartment(dep)}
            </FRLink>
            <br />
          </span>
        ))}
      </>
    );
  }, [data, t, Event]);

  return (
    <BaseCard
      title={t("Infocards.location")}
      items={
        data === null
          ? null
          : [
              {
                content: links,
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
