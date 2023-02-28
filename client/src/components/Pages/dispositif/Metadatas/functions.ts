import { GetDispositifResponse } from "api-types";

export const getPrice = (price: GetDispositifResponse["metadatas"]["price"] | undefined) => {
  if (!price) return undefined;
  if (price.value === 0) return "Gratuit";
  return `${price.value}€ ${price.details}`;
}

export const getAge = (age: GetDispositifResponse["metadatas"]["age"] | undefined) => {
  if (!age) return undefined;
  switch (age.type) {
    case "lessThan":
      return `Moins de ${age.ages[0]} ans`;
    case "moreThan":
      return `Plus de ${age.ages[0]} ans`;
    case "between":
      return `Entre ${age.ages[0]} et ${age.ages[1]} ans`;
  }
}

export const getPublic = (publicType: GetDispositifResponse["metadatas"]["public"] | undefined) => {
  if (!publicType) return undefined;
  return publicType === "refugee" ? "Réfugiés" : "Tout le monde";
}
