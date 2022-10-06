import { SearchDispositif } from "types/interface";

type InfoType = "duration" | "location" | "price";

const getItemTitle = (info: InfoType) => {
  switch (info) {
    case "duration":
      return "Durée"
    case "location":
      return "Zone d'action"
    case "price":
      return "Combien ça coûte ?"
    default:
      return ""
  }
}

export const getDispositifInfos = (dispositif: SearchDispositif, info: InfoType) => {
  const itemTitle = getItemTitle(info);
  return (dispositif.contenu[1].children || []).find(
    (infocard) => infocard.title === itemTitle
  );
}
