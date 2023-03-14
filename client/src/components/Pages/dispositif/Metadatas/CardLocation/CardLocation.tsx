import React, { useMemo } from "react";
import { ContentType, Metadatas } from "api-types";
import FRLink from "components/UI/FRLink";
import BaseCard from "../BaseCard";
import { BaseCardStatus } from "../BaseCard/BaseCard";
import { getLocationLink } from "../functions";
import LocationIcon from "assets/dispositif/metadatas/Location";
import styles from "./CardLocation.module.scss";

interface Props {
  data: Metadatas["location"];
  typeContenu: ContentType;
  color: string;
  status?: BaseCardStatus;
  onClick?: () => void;
}

const CardLocation = ({ data, typeContenu, color, status, onClick }: Props) => {
  const links = useMemo(() => {
    if (!data) return null;
    if (!Array.isArray(data)) {
      return (
        <FRLink target="_blank" href={getLocationLink(data)}>
          {data === "france" ? "France entière" : "En ligne"}
        </FRLink>
      );
    }
    return data?.map((dep, i) => (
      <span key={i}>
        <FRLink target="_blank" href={getLocationLink(dep)}>
          {dep}
        </FRLink>
        <br />
      </span>
    ));
  }, [data]);

  return (
    <BaseCard
      title="Zone d'action"
      items={[
        {
          content: typeContenu === ContentType.DISPOSITIF ? <>{links}</> : null,
          icon: <LocationIcon color={color} />,
        },
      ]}
      color={color}
      status={status}
      onClick={onClick}
    />
  );
};

export default CardLocation;
