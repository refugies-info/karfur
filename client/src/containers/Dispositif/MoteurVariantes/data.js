const customCriteres = [
  {texte: "Personnalisé", displayText: "Choisissez parmi plusieurs autres critères disponibles.", options: []},
  {texte: "Sexe", query: "sexe", displayText: "Votre public concerne :", options: [
    {texte: "Les femmes"},
    {texte: "Les hommes"},
    {texte: "Les deux"},
  ]},
  {texte: "Public visé", query: "public", displayText: "Votre public concerne :", options: [
    {texte: "Les réfugiés statutaires"},
    {texte: "Les accompagnants"},
    {texte: "Tout public"},
  ]},
  {texte: "Situation d’hébergement", query: "hebergement", displayText: "Votre public doit être :", options: [
    {texte: "Logé"},
    {texte: "Hébergé"},
    {texte: "Sans-abri"},
  ]},
  {texte: "Situation familiale", query: "famille", displayText: "Votre public doit être :", options: [
    {texte: "Célibataire"},
    {texte: "En concubinage"},
    {texte: "Marié"},
    {texte: "Sans enfants"},
    {texte: "Avec enfants"},
  ]},
];

export {customCriteres};