import React from "react";
import Admin from "../../theme/images/tags-illus/admin.svg";
import Francais from "../../theme/images/tags-illus/francais.svg";
import Travail from "../../theme/images/tags-illus/travail.svg";
import Metier from "../../theme/images/tags-illus/metier.svg";
import Logement from "../../theme/images/tags-illus/logement.svg";
import Mobilite from "../../theme/images/tags-illus/transport.svg";
import Soin from "../../theme/images/tags-illus/sante.svg";
import Etudes from "../../theme/images/tags-illus/etudes.svg";
import Culture from "../../theme/images/tags-illus/culture.svg";
import Rencontre from "../../theme/images/tags-illus/rencontres.svg";
import Benevolat from "../../theme/images/tags-illus/benevolat.svg";
import Soccer from "../../theme/images/tags-illus/loisirs.svg";
import { theme } from "../../theme";

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
      return <Soin style={{ marginBottom: theme.margin * 2 }} />;
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
