import { GetDispositifResponse } from "api-types";
import React from "react";

interface Props {
  mainSponsor: GetDispositifResponse["mainSponsor"];
  sponsors: GetDispositifResponse["sponsors"];
}

const Sponsors = (props: Props) => {
  return (
    <div>
      <h2>Proposé par</h2>
      <div>{props.mainSponsor?.nom}</div>
    </div>
  );
};

export default Sponsors;
