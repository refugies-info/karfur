import { GetDispositifsResponse } from "api-types";

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

export const getDispositifInfos = (dispositif: GetDispositifsResponse, info: InfoType) => {
  return dispositif.metadatas[info];
}
