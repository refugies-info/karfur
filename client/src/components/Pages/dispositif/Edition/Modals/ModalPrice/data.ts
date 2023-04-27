import { priceDetails } from "api-types";

export const help = {
  title: "À quoi sert cette information ?",
  content: "Ajoutez les éventuels frais d’inscription, les souscriptions ou les abonnements relatifs à votre action.",
};

export const dropdownOptions: priceDetails[] = [
  "once",
  "eachTime",
  "hour",
  "day",
  "week",
  "month",
  "trimester",
  "semester",
  "year",
]
