import React from 'react';
import moment from 'moment/min/moment-with-locales';

import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";

import variables from 'scss/colors.scss';

export const languages = [
  {
    name: 'Anglais',
    code: 'gb',
    avancement: .8,
    nbParticipants:4,
    premiere_image: Math.floor(Math.random() * Math.floor(15))
  },
  {
    name: 'Espagnol',
    code: 'es',
    avancement: .7,
    nbParticipants:3,
    premiere_image: Math.floor(Math.random() * Math.floor(15))
  },
  {
    name: 'Arabe',
    code: 'ma',
    avancement: .55,
    nbParticipants:1,
    premiere_image: Math.floor(Math.random() * Math.floor(15))
  }
]

export const past_translation = [
  {
    name: 'Anglais',
    code: 'gb',
    titre: 'Les 3 petits cochons',
    statut: 'Validée'
  },
  {
    name: 'Anglais',
    code: 'gb',
    titre: 'Blanche neige et les 7 nains',
    statut: 'En attente'
  },
  {
    name: 'Espagnol',
    code: 'es',
    titre: 'Les 3 petits cochons',
    statut: 'En cours'
  },
  {
    name: 'Espagnol',
    code: 'es',
    titre: 'Les chiens aboient quand la caravane passe',
    statut: 'Annulée'
  }
]

export const steps = [
  {
    content: <div><h3>Bienvenue dans votre espace !</h3><p>Commençons ensemble la visite...</p></div>,
    placement: 'center',
    locale: { 
      skip: 'Passer',
      next: 'Suivant'
    },
    target: 'body',
  },
  {
    title: 'Ma photo',
    content: 'Ici je peux éditer ma photo de profil et changer l\'image que reçoivent de moi les autres traducteurs',
    placement: 'bottom',
    target: '.profile-header-container',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédant'
    },
  },
  {
    title: 'Ma progression',
    content: 'Je peux me définir mes propres objectifs que j\'essaie de tenir tous les jour',
    placement: 'left',
    target: '.my-target-widget',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédant',
      last : 'Terminer'
    },
  }
]

export const avancement_actions={
  title: 'Notifications',
  headers: [<EVAIcon name="bell-outline" fill={variables.noir} />, 'Titre', 'Mon rôle', 'Type', 'Depuis', '', ''],
  hideOnPhone: [false, false, true, false, true, false, false]
}

export const fakeNotifs = {
  "_id" : "unidentifiantquelconque",
  "titre" : "Faire son service civique en France",
  "owner": true,
  "action": "questions",
}

export const avancement_contributions={
  title: 'Contributions',
  headers: ['Titre', 'Statut', 'Ils rédigent avec moi',''],
  hideOnPhone: [false, false, true, false]
};

export const avancement_members={
  title: 'Membres',
  headers: ['Nom', 'Rôle', 'Dernière connexion', 'Ajouté le', '', '', ''],
  hideOnPhone: [false, false, true, true, true, true, true]
}

export const fakeContribution = {
  "_id" : "unidentifiantquelconque",
  "titreInformatif" : "Un exemple de dispositif",
  "titreMarque" : "Le nom du dispositif",
  "avancement" : 1,
  "status" : "Brouillon",
  "creatorId" : "unidentifiantquelconque",
}

export const fakeMembre = {
  "_id" : "unidentifiantquelconque",
  "username" : "Simon Karleskind",
  "picture": {
    "imgId" : "5ced0172d97ab7f4c6714879",
    "public_id" : "pictures/zgjpujxzk9kxoqylt93n",
    "secure_url" : "https://res.cloudinary.com/dlmqnnhp6/image/upload/v1559036274/pictures/zgjpujxzk9kxoqylt93n.jpg"
  },
  "role": "Contributeur",
  "last_connected": moment().add(-1, 'month'),
  "created_at": moment().add(-3, 'month'),
  "nb_contenu": 3,
}