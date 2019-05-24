const contenu={
  titreInformatif:'Le titre baseline',
  titreMarque:'Le nom du dispositif',
  abstract:'Est est veniam sint officia elit fugiat aliqua. Esse esse laboris cupidatat enim nulla Lorem in sit nulla id nostrud enim est. Amet incididunt amet velit pariatur labore magna aliquip ad fugiat aliquip do dolore. Exercitation aute culpa reprehenderit ipsum ex veniam reprehenderit nisi enim.',
  contact:'contact@volont-r.fr',
};

const lorems = {
  paragraphe:'Sint tempor enim exercitation elit duis ad irure enim incididunt incididunt laboris non. Aliquip non ut quis commodo nulla nulla minim elit. Enim reprehenderit duis adipisicing mollit ad incididunt laboris fugiat officia duis do pariatur. Quis quis aliqua ipsum labore ea sunt commodo sint dolor minim aliquip veniam magna commodo.',
  sousParagraphe:'Sint aute sunt nulla excepteur sunt amet ullamco in sint id ad amet. Est incididunt ut et proident in sint laborum occaecat reprehenderit. Id culpa ea esse do sit excepteur esse. Commodo reprehenderit consequat eu elit Lorem sunt qui est esse. Minim tempor labore labore eiusmod labore.'
}

const menu = [
  {title:'C\'est quoi ?', tutoriel:{titre:'« C’est quoi ? » : Résumé de votre dispositif', contenu:'Il s\'agit d\'une synthèse en deux paragraphes maximum de l’ensemble de la fiche du dispositif. La lecture de cette section doit être auto-suffisante. Il est conseillé de rédiger cette section en dernier après les sections ultérieures.'}},
  {title:'C\'est pour qui ?', type:'cards', tutoriel:{titre:'« C’est pour qui ? » :  les pré-requis pour rejoindre', contenu:'Cette section précise les caractéristiques du public cible et les pré-requis éventuels pour s’engager dans le dispositif. Vous pouvez mobiliser les catégories suivantes à votre guise : \n> Le statut demandé ? Réfugié, demandeurs d’asiles, primo-arrivants… \n> L’âge ; \n> Le niveau de français \n> La durée sur laquelle engage le dispositif ; \n> Des alertes spécifiques (par exemple : avoir un compte bancaire).'}, children:[
    {type:'card', isFakeContent: true,title:'Public visé',titleIcon:'papiers',contentTitle: 'réfugiés', contentBody: 'ou bénéficiaire de la protection subsidiaire', footer:'Pièces demandées',footerIcon:'file-text-outline'},
    {type:'card', isFakeContent: true,title:'Tranche d\'âge',titleIcon:'calendar',contentTitle: '18 à 25 ans', contentBody: '30 ans pour les personnes en situations de handicap', footer:'En savoir plus',footerIcon:'question-mark-circle-outline'},
    {type:'card', isFakeContent: true,title:'Durée',titleIcon:'horloge',contentTitle: '6 à 12 mois', contentBody: 'en fonction de ce qui est convenu sur votre contrat', footer:'En savoir plus',footerIcon:'plus-circle-outline'},
    {type:'card', isFakeContent: true,title:'Niveau de français',titleIcon:'frBubble',contentTitle: 'Débutant (A1)', contentBody: 'Je peux poser et répondre à des questions simples', footer:'En savoir plus',footerIcon:'file-text-outline'},
    {type:'card', isFakeContent: true,title:'Important !',titleIcon:'warning',contentTitle: 'Compte bancaire', contentBody: 'nécessaire pour recevoir l’indemnité', footer:'En savoir plus',footerIcon:'question-mark-circle-outline'},
  ]},
  {title:'Pourquoi c\'est intéressant ?', tutoriel:{titre:'Les arguments principaux pour votre dispositif', contenu:'Cette section contient la présentation à proprement parler du dispositif.  Il s’agit ici d’aider l’utilisateur à identifier très vite si le dispositif peut lui convenir (aide au choix). Cette section doit contenir 4 arguments maximum. Ceux-ci sont formulées par un titre informatif qui doit pouvoir se lire seul, sans ouvrir l’accordéon. Néanmoins, chaque argument peut être précisé par une ou deux phrases, obtenues en déroulant « l’accordéon » correspondant. Des liens extérieurs, pour compléter cette information, peuvent être fournis.'}, children:[
    {isFakeContent: true, title:'Un exemple d\'accordéon',type:'accordion',content: lorems.sousParagraphe}
  ]},
  {title:'Comment je m\'engage ?', tutoriel:{titre:'Les arguments principaux pour votre dispositif', contenu:'Cette section contient la présentation à proprement parler du dispositif.  Il s’agit ici d’aider l’utilisateur à identifier très vite si le dispositif peut lui convenir (aide au choix). Cette section doit contenir 4 arguments maximum. Ceux-ci sont formulées par un titre informatif qui doit pouvoir se lire seul, sans ouvrir l’accordéon. Néanmoins, chaque argument peut être précisé par une ou deux phrases, obtenues en déroulant « l’accordéon » correspondant. Des liens extérieurs, pour compléter cette information, peuvent être fournis.'}, children:[
    {type:'accordion', isFakeContent: true, title:'Contacter l’association partenaire la plus proche de chez vous',content: lorems.sousParagraphe}, 
    {type:'map', isFakeContent: true, isMapLoaded:true, markers: [{nom: "Test Paris", ville: "Paris", description: "Antenne locale de Test", latitude: "48.856614", longitude: "2.3522219"}]},
  ]},

  // {title:'À quoi ça me sert ?', children:[{title:'Travailler dans une association ou une organisation publique',type:'accordion',content: lorems.sousParagraphe}]},
  // {title:'Pourquoi ça m\'intéresse', children:[{title:'Vous êtes plutôt...',content: lorems.sousParagraphe}, {title:'Vous n\'êtes pas du tout',content: lorems.sousParagraphe}]},
  // {title:'Comment y accéder', children:[{title:'Procédures',content: lorems.sousParagraphe}, {title:'Interlocuteurs experts',content: lorems.sousParagraphe}, {title:'Interlocuteurs concernés',content: lorems.sousParagraphe}]},
  // {title:'Dispositifs connexes', children:[{title:'Dispositifs similaires',content: lorems.sousParagraphe}, {title:'Dispositifs complémentaires',content: lorems.sousParagraphe}]},
  // {title:'Retours d\'expérience', children:[{title:'Questions réponses',content: lorems.sousParagraphe}, {title:'Avis',content: lorems.sousParagraphe}]},
];

export {contenu, lorems, menu};