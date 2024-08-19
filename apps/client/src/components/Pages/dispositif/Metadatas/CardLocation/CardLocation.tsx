import React, { useContext, useMemo } from "react";
import { ContentType, Metadatas } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { Event } from "lib/tracking";
import PageContext from "utils/pageContext";
import { jsUcfirst } from "lib";
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
  const { mode } = useContext(PageContext);
  const isEditMode = useMemo(() => mode === "edit", [mode]);

  const links = useMemo(() => {
    if (!data) return data;
    if (!Array.isArray(data)) {
      return (
        <FRLink
          href={isEditMode ? "#" : getLocationLink(data)}
          onClick={() => Event("DISPO_VIEW", "click location", "Left sidebar")}
        >
          {data === "france" ? t("Infocards.france") : jsUcfirst(t("Recherche.online"))}
        </FRLink>
      );
    }
    return (
      <>
        {data.map((dep, i) => (
          <span key={i}>
            <FRLink
              href={isEditMode ? "#" : getLocationLink(dep)}
              onClick={() => Event("DISPO_VIEW", "click location", "Left sidebar")}
            >
              {formatDepartment(dep)}
            </FRLink>
            <br />
          </span>
        ))}
      </>
    );
  }, [data, t, isEditMode]);

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
