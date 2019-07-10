const initial_data = [
  {
    title:'Je suis',
    value: 'réfugié ou accompagnant',
    query: 'réfugiés',
    queryName: 'audience',
    children:[
      {
        name: 'réfugié ou accompagnant',
        query:'réfugiés',
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
    children: [
      {
        name: 'trouver un emploi',
        query: 'Emploi',
      },
      {
        name: 'trouver un dispositif jeune',
        query: 'Jeune',
      },
      {
        name: "être mobile",
        query: 'Mobilité',
      },
      {
        name: "être logé",
        query: 'Logement',
      },
      {
        name: "devenir cultivé",
        query: 'Culture',
      },
      {
        name: "apprendre le français",
        query: 'Apprendre le français',
      },
      {
        name: "faire des études",
        query: 'Etudes',
      },
      {
        name: "faire une formation professionnelle",
        query: 'Formation professionnelle',
      },
      {
        name: "être accompagné",
        query: 'Accompagnement',
      },
      {
        name: "trouver autre chose",
        query: 'Autre',
      }
    ]
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