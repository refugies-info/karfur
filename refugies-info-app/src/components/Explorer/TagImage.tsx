import Admin from "../../theme/images/Tags/admin.svg";
import Francais from "../../theme/images/Tags/francais.svg";
import Travail from "../../theme/images/Tags/travail.svg";
import Metier from "../../theme/images/Tags/metier.svg";
import Logement from "../../theme/images/Tags/logement.svg";
import Mobilite from "../../theme/images/Tags/deplacer.svg";
import Soin from "../../theme/images/Tags/soin.svg";
import Etudes from "../../theme/images/Tags/etudes.svg";
import Culture from "../../theme/images/Tags/culture.svg";
import Rencontre from "../../theme/images/Tags/rencontre.svg";
import Benevolat from "../../theme/images/Tags/benevolat.svg";
import Soccer from "../../theme/images/Tags/loisirs.svg";

import React from "react";

interface Props {
  name: string;
}
export const TagImage = ({ name }: Props) => {
  switch (name) {
    case "house":
      return <Logement />;
    case "elearning":
      return <Francais />;
    case "briefcase":
      return <Travail />;
    case "measure":
      return <Metier />;
    case "glasses":
      return <Etudes />;
    case "bus":
      return <Mobilite />;
    case "triumph":
      return <Culture />;
    case "heartBeat":
      return <Soin />;
    case "couple":
      return <Rencontre />;
    case "soccer":
      return <Soccer />;
    case "flag":
      return <Benevolat />;
    case "office":
      return <Admin />;

    default:
      return <Admin />;
  }
};
