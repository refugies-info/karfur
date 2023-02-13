import { GetDispositifResponse } from "api-types";
import React from "react";

interface Props {
  markers: GetDispositifResponse["map"];
}

const Map = ({ markers }: Props) => {
  return (
    <div>
      {markers.map((poi, i) => (
        <div key={i}>
          {poi.lat}, {poi.lng}
        </div>
      ))}
    </div>
  );
};

export default Map;
