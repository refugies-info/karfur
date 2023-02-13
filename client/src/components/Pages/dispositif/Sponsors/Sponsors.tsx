import { GetDispositifResponse } from "api-types";
import Image from "next/image";
import React from "react";

interface Props {
  mainSponsor: GetDispositifResponse["mainSponsor"];
  sponsors: GetDispositifResponse["sponsors"];
}

const Sponsors = (props: Props) => {
  return (
    <div>
      {props.mainSponsor && (
        <>
          <h2>Proposé par</h2>
          <Image
            src={props.mainSponsor.picture?.secure_url || ""}
            alt={props.mainSponsor.nom}
            width={160}
            height={110}
            style={{ objectFit: "contain" }}
          />
          <div>{props.mainSponsor?.nom}</div>
        </>
      )}
      {/* TODO: show secondary sponsors */}
    </div>
  );
};

export default Sponsors;
