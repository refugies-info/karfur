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
    value: 'apprendre le français',
    query: 'Apprendre le français',
    queryName: 'tags.name',
    children: filtres.tags
  },
  {
    title:'J\'habite à',
    value: 'Nantes',
    queryName: 'localisation',
    children:[
      {
        name: 'Paris',
      },
      {
        name: 'Lyon',
      },
      {
        name: 'Besançon',
      },
      {
        name: 'Nîmes',
      },
      {
        name: 'Arles'
      }
    ]
  },
  {
    title:'J\'ai',
    value: 'entre 18 et 25 ans',
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
    value: 'un peu',
    title2:'français.',
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

export {initial_data};