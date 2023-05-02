import { Sponsor } from "api-types";
import { ContactInfos } from "./ModalMainSponsor";

export const help = {
  title: "À quoi sert cette information ?",
  content: "Pour assurer la mise à jour des informations, nous devons relier votre fiche à la structure responsable de l’action.",
};

export const hasStructureTitles = [
  "Quelle est la structure responsable de cette action ?",
  "",
  "Cherchez si la structure existe déjà dans notre base",
  "Merci pour votre participation !",
  "Créer une nouvelle structure",
  "Connaissez-vous quelqu’un qui travaille dans cette structure ?",
  "Merci pour votre participation !",
  "Laissez-nous vos coordonnées",
  "Merci pour votre participation !",
];

export const noStructureTitles = [
  "Cherchez si la structure existe déjà dans notre base",
  "Faites-vous partie de cette structure ?",
  "Laissez-nous vos coordonnées",
  "Votre structure a bien été créée !",
  "Merci pour votre participation !",
  "Créer une nouvelle structure",
  "Faites-vous partie de cette structure ?",
  "Laissez-nous vos coordonnées",
  "Votre structure a bien été créée !",
  "Connaissez-vous quelqu’un qui travaille dans cette structure ?",
  "Merci pour votre participation !",
  "Laissez-nous vos coordonnées",
  "Merci pour votre participation !",
];

export const defaultContact: ContactInfos = {
  name: "",
  email: "",
  phone: "",
  comments: "",
};

export const defaultSponsor: Sponsor = {
  name: "",
  link: "",
  logo: {
    imgId: "",
    public_id: "",
    secure_url: "",
  },
};
