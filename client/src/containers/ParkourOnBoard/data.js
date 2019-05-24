// Gradients taken from: https://webgradients.com/
export default [
  {
    title:'Je suis',
    value: 'réfugié',
    query: 'réfugiés',
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
    title:'Je cherche à',
    value: 'Trouver un emploi',
    query: 'Emploi',
    queryName: 'tags',
    color:'secondary',
    children: [
      {
        name: 'Trouver un emploi',
        query: 'Emploi',
      },
      {
        name: 'Trouver un dispositif jeune',
        query: 'Jeune',
      },
      {
        name: "Être mobile",
        query: 'Mobilité',
      },
      {
        name: "Être logé",
        query: 'Logement',
      },
      {
        name: "Devenir cultivé",
        query: 'Culture',
      },
      {
        name: "Apprendre le français",
        query: 'Apprendre le français',
      },
      {
        name: "Faire des études",
        query: 'Etudes',
      },
      {
        name: "Faire une formation professionnelle",
        query: 'Formation professionnelle',
      },
      {
        name: "Être accompagné",
        query: 'Accompagnement',
      },
      {
        name: "Trouver autre chose",
        query: 'Autre',
      }
    ]
  },
  {
    title:'Aux alentours de',
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
        description: '#f093fb → #f5576c',
        css: 'linear-gradient(137.67deg, #979797 -12.31%, #3D3D3D 95.23%)',
        height: 400
      },
      {
        name: "peu",
        description: '#5ee7df → #b490ca',
        css: 'linear-gradient(137.67deg, #979797 -12.31%, #3D3D3D 95.23%)',
        height: 400
      },
      {
        name: "moyennement",
        description: '#f6d365 → #fda085',
        css: 'linear-gradient(137.67deg, #979797 -12.31%, #3D3D3D 95.23%)',
        height: 400
      },
      {
        name: "bien",
        description: ' #ddd6f3 → #faaca8',
        css: 'linear-gradient(137.67deg, #979797 -12.31%, #3D3D3D 95.23%)',
        height: 400
      },
      {
        name: "parfaitement",
        description: ' #ddd6f3 → #faaca8',
        css: 'linear-gradient(137.67deg, #979797 -12.31%, #3D3D3D 95.23%)',
        height: 400
      }
    ]
  }
]