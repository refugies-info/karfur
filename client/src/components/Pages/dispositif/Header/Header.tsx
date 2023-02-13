import React from "react";
import { GetDispositifResponse } from "api-types";
import { Theme } from "types/interface";
import TextInput from "../TextInput";

interface Props {
  dispositif: GetDispositifResponse;
  theme: Theme | null;
  secondaryThemes: Theme[];
}

const Accordions = (props: Props) => {
  return (
    <header>
      <h1>
        <TextInput id="titreInformatif" value={props.dispositif.titreInformatif} />
        {props.dispositif.typeContenu === "dispositif" && (
          <>
            avec <TextInput id="titreMarque" value={props.dispositif.titreMarque} />
          </>
        )}
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
