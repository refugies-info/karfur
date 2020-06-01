import React from "react";

const steps = [
  {
    content: (
      <div>
        <h3>Bienvenue dans votre espace !</h3>
        <p>Commençons ensemble la visite...</p>
      </div>
    ),
    placement: "center",
    locale: {
      skip: "Passer",
      next: "Suivant",
    },
    target: "body",
  },
  {
    title: "Ma photo",
    content:
      "Ici je peux éditer ma photo de profil et changer l'image que reçoivent de moi les autres traducteurs",
    placement: "bottom",
    target: ".profile-header-container",
    locale: {
      skip: "Passer",
      next: "Suivant",
      back: "Précédant",
    },
  },
  {
    title: "Ma progression",
    content:
      "Je peux me définir mes propres objectifs que j'essaie de tenir tous les jour",
    placement: "left",
    target: ".my-target-widget",
    locale: {
      skip: "Passer",
      next: "Suivant",
      back: "Précédant",
      last: "Terminer",
    },
  },
];

const avancement_langue = {
  title: "Mes traductions",
  headers: [
    "Titre",
    "Statut",
    "Progression",
    "Langue",
    "Ils rédigent avec moi",
    "",
  ],
  hideOnPhone: [false, false, true, false, true, false],
};

const avancement_data = {
  title: "Mes langues",
  headers: ["Langue", "Progression", "Traducteurs mobilisés", ""],
  hideOnPhone: [false, true, true, false],
};

export { steps, avancement_langue, avancement_data };
