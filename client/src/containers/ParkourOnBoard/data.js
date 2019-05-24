// Gradients taken from: https://webgradients.com/
export default [
  {
    title:'Je suis',
    value: 'réfugié',
    query: 'réfugiés',
    title2:', ',
    queryName: 'audience',
    color:'success',
    children:[
      {
        name: 'une association',
        query:'associations',
      },
      {
        name: 'un travailleur social',
        query:'travailleurs sociaux',
      },
      {
        name: 'une institution d\'état',
        query:'institutions d\'état',
      },
      {
        name: 'un réfugié',
        query:'réfugiés',
      },
      {
        name: 'un citoyen',
        query:'citoyens',
      }
    ]
  },
  {
    title:'je cherche à',
    value: 'trouver un emploi',
    query: 'Emploi',
    queryName: 'tags',
    title2:', ',
    color:'secondary',
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
    title:'aux alentours de',
    value: 'Paris',
    queryName: 'localisation',
    color:'primary',
    children:[
      {
        name: 'Seine Saint-Denis',
      },
      {
        name: 'Aubervilliers',
      },
      {
        name: 'Paris',
      },
      {
        name: 'Calais',
      }
    ]
  },
  {
    title:'J\'ai entre',
    value: '18-24',
    title2:'ans',
    queryName: 'audienceAge',
    color:'warning',
    children:[
      {
        name: "0-18",
      },
      {
        name: "18-25",
      },
      {
        name: "25-56",
      },
      {
        name: "56-120",
      }
    ]
  },
  {
    title:'Je parle',
    value: 'pas',
    title2:'français',
    queryName: 'niveauFrancais',
    color:'danger',
    children:[
      {
        name: "pas",
      },
      {
        name: "peu",
      },
      {
        name: "moyennement",
      },
      {
        name: "bien",
      },
      {
        name: "parfaitement",
      }
    ]
  }
]