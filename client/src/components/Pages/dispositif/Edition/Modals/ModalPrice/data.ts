import { priceDetails } from "api-types";

export const help = {
  title: "Comment choisir ?",
  content: "Cochez payant si vous avez des frais spécifiques (d'inscription, de dossier, loyers, abonnement, etc.). Vous pouvez cocher gratuit seulement si aucun frais n’est demandé.",
};
export const helpPay = {
  title: "Quels frais faut-il mentionner ?",
  content: [
    "Précisez ici le montant total des frais relatifs à votre action : montant d'une inscription, frais de dossier, loyers, abonnement, etc.",
    "Si le montant dépend du profil des personnes, cochez « Ce n’est pas pertinent pour mon action » et expliquez les détails dans votre fiche."
  ],
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
