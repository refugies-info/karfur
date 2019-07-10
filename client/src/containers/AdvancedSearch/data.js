import {filtres} from "../Dispositif/data";

const initial_data = [
  {
    title:'Je suis',
    value: 'réfugié ou accompagnant',
    query: 'réfugié',
    queryName: 'audience',
    children:[
      {
        name: 'réfugié ou accompagnant',
        query:'réfugié',
      },
      {
        name: 'une organisation',
        query:'associations',
      }
    ]
  },
  {
    title:'et je cherche à',
    value: 'apprendre le français',
    query: 'Apprendre le français',
    queryName: 'tags.name',
    children: filtres.tags
  },
  {
    title:'dans la ville de',
    value: 'Nantes',
    queryName: 'localisation',
    children:[
      {
        name: 'Paris',
      },
      {
        name: 'Paris',
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
      },
      {
        name: "entre 18 et 25 ans",
      },
      {
        name: "entre 25 et 56 ans",
      },
      {
        name: "56 ans et plus",
      }
    ]
  },
  {
    title:'et je parle',
    value: 'un peu',
    title2:'français.',
    queryName: 'niveauFrancais',
    append: 'Quel est mon niveau ?',
    children:[
      {
        name: "pas du tout",
      },
      {
        name: "un peu",
      },
      {
        name: "moyennement",
      },
      {
        name: "bien",
      },
      {
        name: "très bien",
      }
    ]
  }
];

export {initial_data};