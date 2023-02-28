import { ContentStructure, GetDispositifResponse, Sponsor } from "api-types";
import Image from "next/image";
import React from "react";

interface Props {
  sponsors: GetDispositifResponse["sponsors"];
}

const Sponsors = (props: Props) => {
  /* TODO: design */
  return props.sponsors && props.sponsors.length > 0 ? (
    <div>
      <span>En partenariat avec</span>
      {props.sponsors?.map((sponsor, i) => {
        const image = (sponsor as Sponsor).logo?.secure_url || (sponsor as ContentStructure).picture?.secure_url || "";
        const name = (sponsor as Sponsor).name || (sponsor as ContentStructure).nom || "";
        return (
          <div key={i}>
            <Image src={image} alt={name} width={40} height={40} style={{ objectFit: "contain" }} />
            <div>{name}</div>
          </div>
        );
      })}
    </div>
  ) : null;
};

export default Sponsors;
