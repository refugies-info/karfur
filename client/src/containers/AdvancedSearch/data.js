import {filtres} from "../Dispositif/data";

const initial_data = [
  // {
  //   title:'Je suis',
  //   value: 'réfugié ou accompagnant',
  //   query: 'réfugié',
  //   queryName: 'audience',
  //   children:[
  //     {
  //       name: 'réfugié ou accompagnant',
  //       query:'réfugié',
  //     },
  //     {
  //       name: 'une organisation',
  //       query:'associations',
  //     }
  //   ]
  // },
  {
    title:'Je cherche à',
    value: null,
    placeholder: 'choisir un thème',
    query: 'Apprendre le français',
    queryName: 'tags.name',
    children: filtres.tags
  },
  {
    title:'J\'habite à',
    value: null,
    placeholder: 'ma ville',
    queryName: 'localisation'
  },
  {
    title:'J\'ai',
    value: null,
    placeholder: 'âge',
    queryName: 'audienceAge',
    children:[
      {
        name: "moins de 18 ans",
        bottomValue:0,
        topValue:18
      },
      {
        name: "entre 18 et 25 ans",
        bottomValue:18,
        topValue:25
      },
      {
        name: "entre 25 et 56 ans",
        bottomValue:25,
        topValue:56
      },
      {
        name: "56 ans et plus",
        bottomValue:56,
        topValue:120
      }
    ]
  },
  {
    title:'Je parle',
    value: null,
    placeholder: 'mon niveau',
    title2:'français',
    queryName: 'niveauFrancais',
    append: 'Quel est mon niveau ?',
    children:[
      {
        name: "pas du tout",
        query: "Débutant",
      },
      {
        name: "un peu",
        query: "Débutant",
      },
      {
        name: "moyennement",
        query: "Intermédiaire",
      },
      {
        name: "bien",
        query: "Intermédiaire",
      },
      {
        name: "très bien",
        query: "Avancé",
      }
    ]
  }
];

const filtres_contenu = [
  {name: "Dispositifs", query: {$or: [{typeContenu: {$exists: false}}, {typeContenu: "dispositif"}] }},
  {name: "Démarches", query: {typeContenu: "demarche"} },
]

const tris = [{name: "A > Z", value: "titreInformatif"}, {name:"Derniers ajouts", value: "created_at"}, {name: "Les plus visités", value:"nbVues"}];

export {initial_data, filtres_contenu, tris};