import React from 'react';

const contenu={
  titreInformatif:'Titre informatif',
  titreMarque:'Le nom du dispositif',
  abstract:'Ceci est le résumé du dispositif',
  contact:'contact@lab-r.fr',
  externalLink:""
};

const lorems = {
  paragraphe:'Sint tempor enim exercitation elit duis ad irure enim incididunt incididunt laboris non. Aliquip non ut quis commodo nulla nulla minim elit. Enim reprehenderit duis adipisicing mollit ad incididunt laboris fugiat officia duis do pariatur. Quis quis aliqua ipsum labore ea sunt commodo sint dolor minim aliquip veniam magna commodo.',
  sousParagraphe:'Sint aute sunt nulla excepteur sunt amet ullamco in sint id ad amet. Est incididunt ut et proident in sint laborum occaecat reprehenderit. Id culpa ea esse do sit excepteur esse. Commodo reprehenderit consequat eu elit Lorem sunt qui est esse. Minim tempor labore labore eiusmod labore.'
}

const menu = [
  {title:'C\'est quoi ?', tutoriel:{titre:'« C’est quoi ? » : Résumé de votre dispositif', contenu:'Il s\'agit d\'une synthèse en deux paragraphes maximum de l’ensemble de la fiche du dispositif. La lecture de cette section doit être auto-suffisante. Il est conseillé de rédiger cette section en dernier après les sections ultérieures.'}},
  {title:'C\'est pour qui ?', type:'cards', tutoriel:{titre:'« C’est pour qui ? » :  les pré-requis pour rejoindre', contenu:'Cette section précise les caractéristiques du public cible et les pré-requis éventuels pour s’engager dans le dispositif. Vous pouvez mobiliser les catégories suivantes à votre guise : \n> Le statut demandé ? Réfugié, demandeurs d’asiles, primo-arrivants… \n> L’âge ; \n> Le niveau de français \n> La durée sur laquelle engage le dispositif ; \n> Des alertes spécifiques (par exemple : avoir un compte bancaire).'}, children:[
    {type:'card', isFakeContent: true,title:'Public visé',titleIcon:'papiers',contentTitle: 'réfugiés', contentBody: 'ou bénéficiaire de la protection subsidiaire', footer:'En savoir plus',footerIcon:'info-outline'},
    {type:'card', isFakeContent: true,title:'Âge requis',titleIcon:'calendar-outline', typeIcon: "eva",contentTitle: 'De ** à ** ans', bottomValue: 18, topValue:56, contentBody: '30 ans pour les personnes en situations de handicap', footer: 'Ajouter un message complémentaire', footerType:"text"},
    {type:'card', isFakeContent: true,title:'Durée',titleIcon:'clock-outline', typeIcon: "eva",contentTitle: '6 à 12 mois', contentBody: 'en fonction de ce qui est convenu sur votre contrat', footer: 'Ajouter un message complémentaire', footerType:"text", tooltipHeader: "Durée du dispositif", tooltipContent: "Indiquez un intervalle ou une durée fixe ou supprimez la carte si elle n’est pas pertinente."},
    {type:'card', isFakeContent: true,title:'Niveau de français',titleIcon:'frBubble',contentTitle: 'Débutant', niveaux:[], footer:'Évaluer mon niveau',footerIcon:'bar-chart-outline', footerHref:"https://savoirs.rfi.fr/fr/testez-votre-niveau-de-fran%C3%87ais", tooltipHeader: "Niveau de français requis", tooltipContent: "Indiquez un niveau généraliste et précisez si besoin le niveau CECR demandé (A1,A2, etc.).", tooltipFooter: "En savoir plus"},
    {type:'card', isFakeContent: true,title:'Combien ça coûte ?',titleIcon:'money',free: true, price: 0, contentTitle: 'une seule fois', footer:'Ajouter un message complémentaire', footerType:"text", tooltipHeader: "Combien ça coûte ?", tooltipContent: "Précisez si l’accès à votre dispositif est gratuit ou s’il existe des frais d’inscription, ou des coûts récurrent.\nPensez à expliquer la raison du coût en message complémentaire."},
    {type:'card', isFakeContent: true,title:'Justificatif demandé',titleIcon:'papiers',contentTitle: 'Titre de séjour', footer:'Voir un exemple',footerIcon:'eye-outline'},
    {type:'card', isFakeContent: true,title:'Important !',titleIcon:'alert-triangle-outline', typeIcon: "eva",contentTitle: 'Compte bancaire', contentBody: 'nécessaire pour recevoir l’indemnité', footer:'Ajouter un message complémentaire', footerType:"text", tooltipHeader: "Critère spécifique", tooltipContent: "Vous avez la possibilité d’ajouter jusqu’à 3 critères supplémentaires pour prévenir les utilisateurs. Choisissez un titre court puis ajoutez une brève description."},
  ]},
  {title:'Pourquoi c\'est intéressant ?', tutoriel:{titre:'Les arguments principaux pour votre dispositif', contenu:'Cette section contient la présentation à proprement parler du dispositif. Il s’agit ici d’aider l’utilisateur à identifier très vite si le dispositif peut lui convenir (aide au choix). Cette section doit contenir 4 arguments maximum. Ceux-ci sont formulées par un titre informatif qui doit pouvoir se lire seul, sans ouvrir l’accordéon. Néanmoins, chaque argument peut être précisé par une ou deux phrases, obtenues en déroulant « l’accordéon » correspondant. Des liens extérieurs, pour compléter cette information, peuvent être fournis.'}, children:[
    {isFakeContent: true, title:'Un exemple d\'accordéon',type:'accordion', placeholder: lorems.sousParagraphe,content: ''}
  ]},
  {title:'Comment je m\'engage ?', tutoriel:{titre:'Les arguments principaux pour votre dispositif', contenu:'Cette section contient la présentation à proprement parler du dispositif. Il s’agit ici d’aider l’utilisateur à identifier très vite si le dispositif peut lui convenir (aide au choix). Cette section doit contenir 4 arguments maximum. Ceux-ci sont formulées par un titre informatif qui doit pouvoir se lire seul, sans ouvrir l’accordéon. Néanmoins, chaque argument peut être précisé par une ou deux phrases, obtenues en déroulant « l’accordéon » correspondant. Des liens extérieurs, pour compléter cette information, peuvent être fournis.'}, children:[
    {type:'accordion', isFakeContent: true, title:'Contacter l’association partenaire la plus proche de chez vous', placeholder: lorems.sousParagraphe,content: ''}, 
    {type:'map', isFakeContent: true, isMapLoaded:true, markers: []},
  ]},

  // {title:'À quoi ça me sert ?', children:[{title:'Travailler dans une association ou une organisation publique',type:'accordion',content: lorems.sousParagraphe}]},
  // {title:'Pourquoi ça m\'intéresse', children:[{title:'Vous êtes plutôt...',content: lorems.sousParagraphe}, {title:'Vous n\'êtes pas du tout',content: lorems.sousParagraphe}]},
  // {title:'Comment y accéder', children:[{title:'Procédures',content: lorems.sousParagraphe}, {title:'Interlocuteurs experts',content: lorems.sousParagraphe}, {title:'Interlocuteurs concernés',content: lorems.sousParagraphe}]},
  // {title:'Dispositifs connexes', children:[{title:'Dispositifs similaires',content: lorems.sousParagraphe}, {title:'Dispositifs complémentaires',content: lorems.sousParagraphe}]},
  // {title:'Retours d\'expérience', children:[{title:'Questions réponses',content: lorems.sousParagraphe}, {title:'Avis',content: lorems.sousParagraphe}]},
];

const filtres = {
  "audience": ['réfugié', 'tout public'],
  "audienceAge": ["De ** à ** ans","Moins de ** ans","Plus de ** ans"],
  "niveauFrancais": ["Débutant","Intermédiaire","Avancé", "Tous les niveaux"],
  "justificatifs": ["Titre de séjour", "Justificatif de domicile", "Diplôme", "Permis de conduire"],
  "tags": [
    {short: "Français", name: "apprendre le français", darkColor: "#583F93", lightColor: "#F0E8F5", hoverColor: "#ADA8D4", illustrationColor: "#F9AA38"}, 
    {short: "Logement", name: "me loger", darkColor: "#1174BA", lightColor: "#DDF3FA", hoverColor: "#55A6CE", illustrationColor: "#F77B0B"}, 
    {short: "Insertion pro", name: "trouver un travail", darkColor: "#149295", lightColor: "#D6EFF4", hoverColor: "#4FD3BD", illustrationColor: "#DD0539"}, 
    {short: "Formation pro", name: "apprendre un métier", darkColor: "#095411", lightColor: "#E8F4E9", hoverColor: "#7DC690", illustrationColor: "#FC1E73"}, 
    {short: "Études", name: "faire des études", darkColor: "#378E04", lightColor: "#E8F7CD", hoverColor: "#ADEA5C", illustrationColor: "#E561D8"}, 
    {short: "Mobilité", name: "me déplacer", darkColor: "#EA6206", lightColor: "#FFF0E7", hoverColor: "#F9D1B7", illustrationColor: "#5435D6"}, 
    {short: "Bénévolat", name: "aider une association", darkColor: "#FC0E3B", lightColor: "#FFEEEE", hoverColor: "#FDA8AD", illustrationColor: "#1FC2C1"}, 
    {short: "Rencontre", name: "rencontrer des gens", darkColor: "#A50455", lightColor: "#FFEBF5", hoverColor: "#FDA5C4", illustrationColor: "#76D327"}, 
    {short: "Loisir", name: "occuper mon temps libre", darkColor: "#AB2DC1", lightColor: "#F6E6FC", hoverColor: "#E595F9", illustrationColor: "#FCBF35"}, 
    {short: "Culture", name: "découvrir la culture", darkColor: "#CE310D", lightColor: "#FFF0E7", hoverColor: "#FEC396", illustrationColor: "#1898FC"}, 
    {short: "Santé", name: "me soigner", darkColor: "#", lightColor: "#", hoverColor: "#", illustrationColor: "#"}
  ],
  // "audience": ['associations','travailleurs sociaux','institutions d\'état','réfugiés','citoyens'],
  // "audienceAge": ["0 à 18 ans","18 à 25 ans","25 à 56 ans","56 à 120 ans"],
  // "niveauFrancais": ["Débutant (A1)","Débutant + (A2)","Intermédiaire (B1)","Intermédiaire + (B2)","Avancé (C1)","Avancé + (C2)", "Tous niveaux"],
  // "tags": [{
  //   name: 'Emploi',
  //   color: 'primary'
  // }, {
  //   name: 'Jeune',
  //   color: 'secondary'
  // }, {
  //   name: 'Mobilité',
  //   color: 'success'
  // }, {
  //   name: 'Logement',
  //   color: 'danger',
  //   short: 'Se loger'
  // }, {
  //   name: 'Culture',
  //   color: 'warning'
  // }, {
  //   name: 'Apprendre le français',
  //   color: 'info',
  //   short: 'Français'
  // }, {
  //   name: 'Etudes',
  //   color: 'light'
  // }, {
  //   name: 'Formation professionnelle',
  //   color: 'dark',
  //   short: 'Se former'
  // }, {
  //   name: 'Accompagnement',
  //   color: 'muted'
  // }, {
  //   name: 'Autre',
  //   color: 'white'
  // }]
};

const steps = [
  {
    content: <div><h3>Modifiez le texte directement</h3><p>Cliquez sur les éléments surlignés en jaune pour saisir votre texte.</p></div>,
    placement: 'bottom',
    locale: { 
      skip: 'Passer',
      next: 'Suivant'
    },
    target: '.bloc-titre',
    disableBeacon: true
  },
  {
    content: <div><h3>Suivez le guide</h3><p>Des consignes vous sont proposées pour chaque élément modifiable.</p></div>,
    placement: 'bottom',
    target: '#titreMarque',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédent'
    },
  },
  {
    content: <div><h3>Revenez plus tard</h3><p>Vous pouvez désactiver l’aide et sauvegarder à tout moment.</p></div>,
    placement: 'left',
    target: '.top-right .card',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédent',
      last : 'Terminer'
    },
  }
]

const tutoSteps = [
  {
    title: 'Titre',
    content: "rédigez une courte phrase qui décrit l’action principale de votre dispositif. Nous vous conseillons de commencer la phrase par un verbe d’action à l’infinitif - rencontrer, apprendre, se former, trouver de l’aide, être accompagne, etc.",
    locale: { 
      skip: 'Passer',
      next: 'Suivant'
    },
    target: '#titreInformatif',
    disableBeacon: true
  },
  {
    title: 'Nom du dispositif',
    content: "ce nom est également affiché dans les choix de recherche. Préférez la syntaxe la plus courte possible. Le champ est limité à 25 caractères.",
    target: '#titreMarque',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédent'
    },
  },
  {
    title: 'Thème',
    content: "choisissez le thème principal qui caractérise le mieux votre dispositif. Puis ajoutez si besoin deux thèmes secondaires qui viennent améliorer le référencement de votre dispositif et préciser sa nature.",
    target: '.tags',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédent'
    },
  },
  {
    title: 'Lien vers le site du dispositif',
    content: "ajouter un lien direct vers la page la plus adéquate pour vous : inscription, présentation détaillée, page facebook, etc.",
    target: '.link-wrapper',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédent'
    },
  },
  {
    title: 'C’est quoi ?',
    content: "Brève synthèse de la fiche récapitulant les points les plus importants. Deux paragraphes maximum. Nous vous conseillons de rédiger cette section en dernier.",
    target: '#contenu-0 .contenu',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédent'
    },
  },
  {
    title: 'C’est pour qui ?',
    content: "Ajoutez autant de carte que nécessaire pour expliciter les conditions d’accès au dispositif. Passez la souris sur chaque carte pour avoir des consignes détaillées.",
    target: '#contenu-1 .contenu',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédent'
    },
  },
  {
    title: 'Pourquoi ?',
    content: "ajoutez jusqu’à 5 arguments principaux pour convaincre l’utilisateur de vous rejoindre. Chaque titre d’accordéon doit être compréhensible sans avoir à lire son contenu. N’hésitez pas à faire des sous-arguments à l’aide des listes à puce.",
    target: '#contenu-2 .contenu',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédent'
    },
  },
  {
    title: 'Comment ?',
    content: "détaillez les différentes étapes pour accéder à votre dispositif : annuaire, prise de contact, premiers rendez-vous, formulaires d’inscriptions, etc. Vous pouvez ajouter une carte interactive pour cartographier vos points de contacts.",
    target: '#contenu-3 .contenu',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédent'
    },
  },
  {
    title: 'Carte interactive',
    content: "ajoutez des points de contacts géolocalisés en recherchant une adresse dans la barre de recherche Google Maps. Puis saisissez les informations du point de contact. Vous pouvez également importer massivement des contacts.",
    target: '.map-paragraphe',
    placement: 'bottom',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédent'
    },
  },
  // {
  //   title: 'Auteur',
  //   content: "ajoutez les personnes qui vont ont aidées à rédiger le dispositif. Vous pouvez leur envoyer une invitation à se créer un compte pour participer à l’effort de mise à jour et d’échange avec la communauté.",
  //   target: '.bottom-wrapper',
  //   locale: { 
  //     skip: 'Passer',
  //     next: 'Suivant',
  //     back : 'Précédent'
  //   },
  // },
  {
    title: 'Structures partenaires',
    content: "ajoutez le logo de votre/vos structures. Attention : seul les fichiers .png, .jpg et .svg sont compatibles. Un lien vers le site de la structure et un texte alternatif à l’image vous est également demandé.",
    target: '.sponsor-footer',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédent',
      last : 'Terminer'
    },
    placement: 'top',
  },
]

export {contenu, lorems, menu, filtres, steps, tutoSteps};