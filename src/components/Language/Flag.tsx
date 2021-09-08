import * as React from "react";
import FranceFlag from "../../theme/images/Flags/France.svg";
import AfghanistanFlag from "../../theme/images/Flags/Afghanistan.svg";
import ArabeFlag from "../../theme/images/Flags/Arabe.svg";
import GBFlag from "../../theme/images/Flags/GB.svg";
import PersanFlag from "../../theme/images/Flags/Persan.svg";
import RussieFlag from "../../theme/images/Flags/Russie.svg";
import ErythreeFlag from "../../theme/images/Flags/Erythree.svg";

const FLAG_HEIGHT = 15;
const FLAG_WIDTH = 20;

interface Props {
  langueFr: string;
}
export const Flag = (props: Props) => {
  if (props.langueFr === "Français")
    return <FranceFlag width={FLAG_WIDTH} height={FLAG_HEIGHT} />;
  if (props.langueFr === "Anglais")
    return <GBFlag width={FLAG_WIDTH} height={FLAG_HEIGHT} />;
  if (props.langueFr === "Pachto")
    return <AfghanistanFlag width={FLAG_WIDTH} height={FLAG_HEIGHT} />;
  if (props.langueFr === "Persan/Dari")
    return <PersanFlag width={FLAG_WIDTH} height={FLAG_HEIGHT} />;
  if (props.langueFr === "Tigrinya")
    return <ErythreeFlag width={FLAG_WIDTH} height={FLAG_HEIGHT} />;
  if (props.langueFr === "Russe")
    return <RussieFlag width={FLAG_WIDTH} height={FLAG_HEIGHT} />;
  if (props.langueFr === "Arabe")
    return <ArabeFlag width={FLAG_WIDTH} height={FLAG_HEIGHT} />;
  return <FranceFlag width={FLAG_WIDTH} height={FLAG_HEIGHT} />;
};
