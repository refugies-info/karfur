import React from "react";
import { ContentType, Metadatas } from "api-types";
import FRLink from "components/UI/FRLink";
import BaseCard from "../BaseCard";
import { BaseCardStatus } from "../BaseCard/BaseCard";
import { getLocationLink } from "../functions";
import LocationIcon from "assets/dispositif/metadatas/Location";
import styles from "./CardLocation.module.scss";

interface Props {
  data: Metadatas["location"] | undefined;
  typeContenu: ContentType;
  color: string;
  status?: BaseCardStatus;
  onClick?: () => void;
}

const CardLocation = ({ data, typeContenu, color, status, onClick }: Props) => {
  return (
    <BaseCard
      title="Zone d'action"
      items={[
        {
          content:
            typeContenu === ContentType.DISPOSITIF ? (
              <>
                {data?.map((dep, i) => (
                  <span key={i}>
                    <FRLink target="_blank" href={getLocationLink(dep)}>
                      {dep === "All" ? "France entière" : dep}
                    </FRLink>
                    <br />
                  </span>
                ))}
              </>
            ) : null,
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
