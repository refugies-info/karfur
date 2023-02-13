import { GetDispositifResponse } from "api-types";
import React from "react";
import { Theme } from "types/interface";

interface Props {
  dispositif: GetDispositifResponse;
  theme: Theme | null;
  secondaryThemes: Theme[];
}

const Accordions = (props: Props) => {
  return (
    <header>
      <h1>
        <span>{props.dispositif.titreInformatif}</span> avec <span>{props.dispositif.titreMarque}</span>
      </h1>
      <p>
        {props.theme?.name.fr}
        {props.secondaryThemes.map((theme) => (
          <span key={theme._id.toString()}> / {theme?.name.fr}</span>
        ))}
      </p>
    </header>
  );
};

export default Accordions;
