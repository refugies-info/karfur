import React, { useMemo } from "react";
import { ContentType, Metadatas } from "api-types";
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
  const links = useMemo(() => {
    if (!data) return data;
    if (!Array.isArray(data)) {
      return (
        <FRLink target="_blank" href={getLocationLink(data)}>
          {data === "france" ? "France entière" : "En ligne"}
        </FRLink>
      );
    }
    return (
      <>
        {data.map((dep, i) => (
          <span key={i}>
            <FRLink target="_blank" href={getLocationLink(dep)}>
              {dep}
            </FRLink>
            <br />
          </span>
        ))}
      </>
    );
  }, [data]);

  return (
    <BaseCard
      title="Zone d'action"
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
