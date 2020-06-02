import React from "react";

import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";

import variables from "scss/colors.scss";

const data = [
  {
    name: "Anglais",
    code: "gb",
    avancement: 0.8,
    nbParticipants: 4,
    premiere_image: Math.floor(Math.random() * Math.floor(15)),
    role: "Contributeur",
  },
  {
    name: "Espagnol",
    code: "es",
    avancement: 0.7,
    nbParticipants: 3,
    premiere_image: Math.floor(Math.random() * Math.floor(15)),
    role: "Propriétaire",
  },
  {
    name: "Arabe",
    code: "ma",
    avancement: 0.55,
    nbParticipants: 1,
    premiere_image: Math.floor(Math.random() * Math.floor(15)),
    role: "Contributeur",
  },
];

const fakeTraduction = {
  _id: "unidentifiantquelconque",
  langueCible: "en",
  initialText: { title: "Un exemple de traduction" },
  avancement: 0.35,
  status: "En attente",
  userId: "unidentifiantquelconque",
};

const fakeFavori = {
  _id: "unidentifiantquelconque",
  titreInformatif: "Un exemple de dispositif",
  titreMarque: "Le nom du dispositif",
};

const fakeNotifs = {
  _id: "unidentifiantquelconque",
  titre: "Faire son service civique en France",
  owner: true,
  action: "questions",
};

const fakeContribution = {
  _id: "unidentifiantquelconque",
  titreInformatif: "Un exemple de dispositif",
  titreMarque: "Le nom du dispositif",
  avancement: 1,
  status: "Brouillon",
  creatorId: "unidentifiantquelconque",
};

const avancement_langue = {
  title: "Traductions",
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

const avancement_contrib = {
  title: "Rédactions",
  headers: ["Titre", "Statut", "Ils rédigent avec moi", "", ""],
  hideOnPhone: [false, false, true, false, false],
};

const avancement_actions = {
  title: "Notifications",
  headers: [
    // eslint-disable-next-line react/jsx-key
    <EVAIcon name="bell-outline" fill={variables.noir} />,
    "Titre",
    "Mon rôle",
    "Type",
    "Depuis",
    "",
    "",
  ],
  hideOnPhone: [false, false, true, false, true, false, false],
};

const avancement_favoris = {
  title: "Favoris",
  headers: [
    // eslint-disable-next-line react/jsx-key
    <EVAIcon name="bookmark" fill={variables.noir} />,
    "Titre",
    "Thèmes",
    "Ajouté le",
    "",
    "",
  ],
};

const data_structure = {
  title: "Ma structure",
};

export {
  data,
  fakeTraduction,
  fakeContribution,
  fakeFavori,
  fakeNotifs,
  avancement_langue,
  avancement_contrib,
  avancement_actions,
  avancement_favoris,
  data_structure,
};
