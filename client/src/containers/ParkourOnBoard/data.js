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
        description: '#f093fb → #f5576c',
        css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        height: 400
      },
      {
        name: 'un travailleur social',
        query:'travailleurs sociaux',
        description: '#5ee7df → #b490ca',
        css: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
        height: 400
      },
      {
        name: 'une institution d\'état',
        query:'institutions d\'état',
        description: '#f6d365 → #fda085',
        css: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        height: 400
      },
      {
        name: 'un réfugié',
        query:'réfugiés',
        description: ' #ddd6f3 → #faaca8',
        css: 'linear-gradient(135deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%)',
        height: 400
      },
      {
        name: 'un citoyen',
        query:'citoyens',
        description: ' #ddd6f3 → #faaca8',
        css: 'linear-gradient(135deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%)',
        height: 400
      }
    ]
  },
  {
    title:'Je cherche à',
    value: 'Trouver un emploi',
    queryName: 'tags',
    color:'secondary',
    children:[
      {
        name: 'Trouver un logement',
        description: '#f093fb → #f5576c',
        css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        height: 400
      },
      {
        name: 'Faire une demande d\'asile',
        description: '#5ee7df → #b490ca',
        css: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
        height: 400
      },
      {
        name: 'Faire garder mes enfants',
        description: '#f6d365 → #fda085',
        css: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        height: 400
      },
      {
        name: 'Trouver un emploi',
        description: ' #ddd6f3 → #faaca8',
        css: 'linear-gradient(135deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%)',
        height: 400
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
        description: '#f093fb → #f5576c',
        css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        height: 400
      },
      {
        name: 'Aubervilliers',
        description: '#5ee7df → #b490ca',
        css: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
        height: 400
      },
      {
        name: 'Paris',
        description: '#f6d365 → #fda085',
        css: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        height: 400
      },
      {
        name: 'Calais',
        description: ' #ddd6f3 → #faaca8',
        css: 'linear-gradient(135deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%)',
        height: 400
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
        description: '#f093fb → #f5576c',
        css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        height: 400
      },
      {
        name: "18-25",
        description: '#5ee7df → #b490ca',
        css: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
        height: 400
      },
      {
        name: "25-56",
        description: '#f6d365 → #fda085',
        css: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        height: 400
      },
      {
        name: "56-120",
        description: ' #ddd6f3 → #faaca8',
        css: 'linear-gradient(135deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%)',
        height: 400
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
        css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        height: 400
      },
      {
        name: "peu",
        description: '#5ee7df → #b490ca',
        css: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
        height: 400
      },
      {
        name: "moyennement",
        description: '#f6d365 → #fda085',
        css: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        height: 400
      },
      {
        name: "bien",
        description: ' #ddd6f3 → #faaca8',
        css: 'linear-gradient(135deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%)',
        height: 400
      },
      {
        name: "parfaitement",
        description: ' #ddd6f3 → #faaca8',
        css: 'linear-gradient(135deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%)',
        height: 400
      }
    ]
  }
]