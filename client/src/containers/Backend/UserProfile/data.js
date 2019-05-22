const data = [
  {
    name: 'Anglais',
    code: 'gb',
    avancement: .8,
    nbParticipants:4,
    premiere_image: Math.floor(Math.random() * Math.floor(15)),
    role:'Contributeur'
  },
  {
    name: 'Espagnol',
    code: 'es',
    avancement: .7,
    nbParticipants:3,
    premiere_image: Math.floor(Math.random() * Math.floor(15)),
    role:'Propriétaire'
  },
  {
    name: 'Arabe',
    code: 'ma',
    avancement: .55,
    nbParticipants:1,
    premiere_image: Math.floor(Math.random() * Math.floor(15)),
    role:'Contributeur'
  }
]

const fakeTraduction = {
  "_id" : "unidentifiantquelconque",
  "langueCible" : "en",
  "initialText" : { "title" : "Un exemple de traduction" },
  "avancement" : 0.35,
  "status" : "En attente",
  "userId" : "unidentifiantquelconque"
};

const fakeContribution = {
  "_id" : "unidentifiantquelconque",
  "titreInformatif" : "Un exemple de dispositif",
  "titreMarque" : "Le nom du dispositif",
  "avancement" : 1,
  "status" : "Brouillon",
  "creatorId" : "unidentifiantquelconque",
}

const avancement_langue={
  title: 'Mes traductions',
  headers: ['Titre', 'Statut', 'Progression', 'Langue', 'Ils rédigent avec moi','']
}

const avancement_contrib={
  title: 'Mes articles',
  headers: ['Titre', 'Statut', 'Progression', 'Mon rôle', 'Ils rédigent avec moi','']
}

const avancement_actions={
  title: 'Action requise',
  headers: ['Titre', 'Mon rôle', 'Actions', 'Depuis', '', '']
}

const avancement_favoris={
  title: 'Mes favoris',
  headers: ['Titre', 'Thématique', '','']
}

export {data, 
  fakeTraduction, 
  fakeContribution, 
  avancement_langue, 
  avancement_contrib, 
  avancement_actions, 
  avancement_favoris, 
}