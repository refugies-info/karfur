import React from "react";
import Houssam from "assets/dispositif/translation/houssam.jpg";
import Kim from "assets/dispositif/translation/kim.jpg";
import Marianne from "assets/dispositif/translation/marianne.jpg";
import Noor from "assets/dispositif/translation/noor.jpg";
import Olga from "assets/dispositif/translation/olga.jpg";
import Rohullah from "assets/dispositif/translation/rohullah.jpg";
import Saba from "assets/dispositif/translation/saba.jpg";

export const modalContent: { title: string; text: React.ReactNode }[] = [
  {
    title: "Bienvenue dans l’espace de traduction des fiches !",
    text: <>Vous allez traduire une fiche. Prenez une minute pour lire ces quelques conseils.</>,
  },
  {
    title: "Retravaillez bien la traduction automatique proposée par Google Translate",
    text: (
      <>
        Quand vous arrivez sur une fiche, vous voyez une première traduction. Attention, elle est automatique : il faut{" "}
        <strong>la retravailler et la corriger</strong> ! Évitez la traduction mot à mot.
      </>
    ),
  },
  {
    title: "Faites des phrases simples et sans utiliser de dialecte",
    text: (
      <>
        La traduction doit être comprise par le plus grand nombre de personnes. Choisissez la version la plus
        universelle possible.
      </>
    ),
  },
  {
    title: "Expliquez les idées spécifiques à la culture française",
    text: (
      <>
        Certains mots ou concepts sont propres à la culture ou à l’administration française. Pensez bien à compléter le
        texte pour expliquer ces mots. Par exemple, les mots « attestation » ou « renouvellement ».
      </>
    ),
  },
  {
    title: "Un expert relit et valide votre traduction",
    text: (
      <>
        Vous recevrez un email lorsque l’expert aura publié la fiche. Elle devient alors visible par les utilisateurs,
        pas avant !
      </>
    ),
  },
];

export const expertImages: Record<string, any> = {
  ar: Houssam,
  en: Kim,
  fa: Rohullah,
  ps: Noor,
  ru: Olga,
  ti: Saba,
  uk: Marianne,
};
