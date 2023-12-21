import { MainSponsor } from "@refugies-info/api-types";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import React from "react";
import { ContactInfos } from "./ModalMainSponsor";
import styles from "./ModalMainSponsor.module.scss";

// Help
type Help = { title: string; content: string | React.ReactNode | (string | React.ReactNode)[] };

export const help: Help = {
  title: "À quoi sert cette information ?",
  content: [
    "Pour assurer la mise à jour des informations, nous devons relier votre fiche à la structure responsable de l’action.",
    "Interrogez notre base de données et ajoutez votre structure si elle n’existe pas encore.",
  ],
};

export const helpSearch: Help = {
  title: "Comment faire ?",
  content: [
    "Pour assurer la mise à jour des informations, nous devons relier votre fiche à la structure responsable de l’action.",
    "Interrogez notre base de données et ajoutez votre structure si elle n’existe pas encore.",
  ],
};
export const helpCreate: Help = {
  title: "À quoi sert cette information ?",
  content: [
    "Ces informations permettent de créer la fiche annuaire de la structure sur Réfugiés.info.",
    "Elles seront validées par le responsable de la structure.",
  ],
};
export const helpContact: Help = {
  title: "À quoi sert cette information ?",
  content: [
    "Renseignez les coordonnées d’un membre de cette structure afin de faciliter le travail de notre équipe.",
    "Si vous ne connaissez personne, vous pouvez cocher la case correspondante. Nous vous demanderons alors vos propres coordonnées.",
  ],
};
export const helpAuthorStructure: Help = {
  title: "À quoi sert cette information ?",
  content: [
    "Vos coordonnées seront uniquement utilisées pour sécuriser votre compte et pour permettre à notre équipe de vous contacter.",
    "Elles ne seront pas visibles en l'état sur la fiche.",
  ],
};
export const helpAuthor: Help = {
  title: "À quoi sert cette information ?",
  content: [
    "Notre équipe vous sollicitera si la prise de contact avec la structure s'avère difficile.",
    "Vos coordonnées ne seront pas visibles sur la fiche.",
  ],
};
export const helpMember: Help = {
  title: "Qu’est-ce que ça change ?",
  content: [
    <>
      <strong>Oui</strong> : Vous vous engagez à mettre à jour votre fiche au fil du temps et à prendre en compte les
      réactions des internautes.
    </>,
    <>
      <strong>Non</strong> : Vous acceptez de transmettre la fiche à la structure responsable pour qu’elle valide et
      mette à jour les informations.
    </>,
  ],
};

// Thanks message
type ThanksMessage = {
  title: string;
  items: string[];
};

const thanksTransferTo: ThanksMessage = {
  title: "Votre fiche va désormais être transférée à la structure",
  items: [
    "Une fois que le responsable de la structure aura repris la main sur votre fiche, vous n'y aurez plus accès.",
    "Le responsable de la structure va relire et valider la fiche.",
    "Vous serez notifié par mail lorsque la fiche sera publiée.",
  ],
};
const thanksTransferToNew: ThanksMessage = {
  title: "Notre équipe éditoriale va contacter cette structure afin qu’elle reprenne la main sur la fiche.",
  items: [
    "Une fois que la structure aura repris la main sur la fiche, vous n'y aurez plus accès.",
    "Le responsable de la structure va relire et valider la fiche.",
    "Vous serez notifié par mail lorsque la fiche sera publiée.",
  ],
};
const thanksCreated: ThanksMessage = {
  title: "Les informations sur votre structure vont être transférées à notre équipe éditoriale pour validation.",
  items: [
    "Vous allez être rattaché comme premier responsable de cette structure.",
    "Si votre action évolue un jour, pensez bien à faire les modifications nécessaires sur votre fiche.",
    "Vous pourrez ajouter vos collègues à votre structure pour qu’ils participent également à la mise à jour de votre fiche.",
  ],
};
const thanksToContact: ThanksMessage = {
  title: "Notre équipe éditoriale va contacter cette structure afin qu’elle reprenne la main sur la fiche.",
  items: [
    "Une fois que la structure aura repris la main sur la fiche, vous n'y aurez plus accès.",
    "Le responsable de la structure va relire et valider la fiche.",
    "Vous serez notifié par mail lorsque la fiche sera publiée.",
  ],
};
const thanksAttachUser: ThanksMessage = {
  title: "L'équipe éditoriale est désormais en charge de vous rattacher à votre structure et de valider votre fiche.",
  items: [
    "Vous serez notifié par mail lorsque notre équipe éditoriale vous aura rattaché à votre structure. En attendant, vous n’aurez plus accès temporairement à la fiche.",
    "Si votre action évolue un jour, pensez bien à faire les modifications nécessaires sur votre fiche.",
  ],
};

// Modal content
const titleIcon = (
  <EVAIcon name="checkmark-circle-2" size={32} fill={styles.lightTextDefaultSuccess} className="me-2" />
);

type ModalContent = {
  title: string | React.ReactNode;
  help?: Help;
  content?: ThanksMessage;
}[];

export const hasStructureTitles: ModalContent = [
  { title: "Quelle est la structure responsable de cette action ?", help: help },
  { title: "", help: undefined },
  { title: "Cherchez si la structure existe déjà dans notre base", help: helpSearch },
  { title: <>{titleIcon} Merci pour votre participation !</>, content: thanksTransferTo },
  { title: "Créer une nouvelle structure", help: helpCreate },
  { title: "Connaissez-vous quelqu’un qui travaille dans cette structure ?", help: helpContact },
  { title: <>{titleIcon} Merci pour votre participation !</>, content: thanksTransferToNew },
  { title: "Laissez-nous vos coordonnées", help: helpAuthor },
  { title: <>{titleIcon} Merci pour votre participation !</>, content: thanksTransferToNew },
];

export const noStructureTitles: ModalContent = [
  { title: "Cherchez si la structure existe déjà dans notre base", help: help },
  { title: "Faites-vous partie de cette structure ?", help: helpMember },
  { title: "Laissez-nous vos coordonnées", help: helpAuthorStructure },
  { title: <>{titleIcon} Merci pour votre participation !</>, content: thanksAttachUser },
  { title: <>{titleIcon} Merci pour votre participation !</>, content: thanksToContact },
  { title: "Créer une nouvelle structure", help: helpCreate },
  { title: "Faites-vous partie de cette structure ?", help: helpMember },
  { title: "Laissez-nous vos coordonnées", help: helpAuthorStructure },
  { title: <>{titleIcon} Votre structure a bien été créée !</>, content: thanksCreated },
  { title: "Connaissez-vous quelqu’un qui travaille dans cette structure ?", help: helpContact },
  { title: <>{titleIcon} Merci pour votre participation !</>, content: thanksTransferToNew },
  { title: "Laissez-nous vos coordonnées", help: helpAuthor },
  { title: <>{titleIcon} Merci pour votre participation !</>, content: thanksTransferToNew },
];

// Form data
export const defaultContact: ContactInfos = {
  name: "",
  email: "",
  phone: "",
  comments: "",
};

export const defaultSponsor: MainSponsor = {
  name: "",
  link: "",
  logo: {
    imgId: "",
    public_id: "",
    secure_url: "",
  },
};
