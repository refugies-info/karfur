import _ from "lodash";

type Operator = {
  dispositifId?: string;
  department: string;
  operator?: string;
  email?: string;
  phone?: string;
};

export const operators: Operator[] = [
  {
    "dispositifId": "660d1f34de63124662360640",
    "department": "01 - Ain",
    "operator": "Alfa3a",
  },
  {
    "dispositifId": "660d1f34de63124662360641",
    "department": "03 - Allier",
    "operator": "Coallia",
    "email": "agir.allier@coallia.org",
    "phone": "04 70 35 00 10"
  },
  {
    "dispositifId": "660d1f36de6312466236065e",
    "department": "06 - Alpes-Maritimes",
    "operator": "SOS Solidarités",
    "email": "agir06@groupe-sos.org",
    "phone": "01 58 30 55 62"
  },
  {
    "dispositifId": "660d1f34de63124662360642",
    "department": "07 - Ardèche",
    "operator": "Forum Réfugiés",
    "email": "direction@forumrefugies.org ",
    "phone": "04 78 03 74 45"
  },
  {
    "dispositifId": "660d1f36de63124662360667",
    "department": "09 - Ariège",
    "operator": "Association Hérisson Bello, Forum",
    "email": "agir.hb@orange.fr",
    "phone": "05 32 65 96 10"
  },
  {
    "dispositifId": "660d1f35de6312466236064f",
    "department": "10 - Aube",
    "operator": "Association Foyer Notre Dame",
    "email": "siege@foyernotredame.org",
    "phone": "03 88 22 70 90"
  },
  {
    "dispositifId": "660d1f37de63124662360669",
    "department": "11 - Aude",
    "operator": "SOS Solidarités",
  },
  {
    "department": "12 - Aveyron",
    "operator": "Habitat et Humanisme",
    "email": "urgence@habitat-humanisme.org",
    "phone": "01 40 19 15 15"
  },
  {
    "dispositifId": "660d1f36de6312466236065d",
    "department": "13 - Bouches-du-Rhône",
    "operator": "Envergure",
    "email": "agir13@envergure.eu",
    "phone": "01 86 26 63 90"
  },
  {
    "dispositifId": "660d1f38de6312466236067d",
    "department": "14 - Calvados",
    "operator": "FTDA",
    "email": "cfossey@france-terre-asile.org",
    "phone": "06 03 67 48 50"
  },
  {
    "dispositifId": "660d1f35de63124662360643",
    "department": "15 - Cantal",
    "operator": "Forum Réfugiés",
    "email": "direction@forumrefugies.org ",
    "phone": "04 78 03 74 45"
  },
  {
    "dispositifId": "660d1f35de63124662360653",
    "department": "16 - Charente",
    "operator": "Viltaïs",
    "email": "agir.16@viltais.eu",
    "phone": "04 70 48 25 00"
  },
  {
    "dispositifId": "660d1f35de63124662360651",
    "department": "17 - Charente-Maritime",
    "operator": "Diaconesses de Reuilly",
    "email": "programme.agir@fondationdiaconesses.org",
    "phone": "05 17 26 15 28"
  },
  {
    "dispositifId": "660d1f36de63124662360657",
    "department": "19 - Corrèze",
    "operator": "Viltaïs",
    "email": "agir.19@viltais.eu",
    "phone": "04 70 48 25 00"
  },
  {
    "dispositifId": "660d1f36de63124662360661",
    "department": "21 - Côte-d'Or",
    "operator": "Coallia",
    "email": "agir21@coallia.org",
  },
  {
    "dispositifId": "660d1d704672fd6af8c456dc",
    "department": "22 - Côtes-d'Armor",
    "operator": "Envergure",
    "email": "sandra.gicquere@envergure.eu",
    "phone": "01 86 26 63 90"
  },
  {
    "dispositifId": "660d1f35de63124662360652",
    "department": "23 - Creuse",
    "operator": "Viltaïs",
    "email": "agir.23@viltais.eu",
    "phone": "04 70 48 25 00"
  },
  {
    "department": "24 - Dordogne",
    "operator": "ARSL",
  },
  {
    "department": "25 - Doubs",
    "operator": "Coallia",
  },
  {
    "dispositifId": "660d1f35de63124662360644",
    "department": "26 - Drôme",
    "operator": "Entraide Pierre Valdo",
  },
  {
    "dispositifId": "660d1f37de63124662360679",
    "department": "27 - Eure",
    "operator": "YSOS, SOS Solidarités",
    "email": "siege@ysos.fr",
    "phone": "02 32 62 35 38"
  },
  {
    "dispositifId": "660d1f37de63124662360672",
    "department": "29 - Finistère",
    "operator": "Coallia",
    "email": "anne-laure.lesvenan@coallia.org",
  },
  {
    "department": "30 - Gard",
    "operator": "Entraide Pierre Valdo",
    "email": "idc@epvaldo.org",
    "phone": "04 77 30 32 95"
  },
  {
    "dispositifId": "660d1f37de63124662360670",
    "department": "31 - Haute-Garonne",
    "operator": "Forum Réfugiés",
    "email": "agir31@forumrefugies.org",
  },
  {
    "dispositifId": "660d1f37de6312466236066b",
    "department": "32 - Gers",
    "operator": "REGAR",
    "email": "contact@regar.fr",
    "phone": "05 62 63 38 22"
  },
  {
    "dispositifId": "660d1f35de63124662360654",
    "department": "33 - Gironde",
    "operator": "COS",
    "email": "quancard@fondationcos.org",
    "phone": "05 56 87 23 62"
  },
  {
    "dispositifId": "660d1f3ade63124662360686",
    "department": "34 - Hérault",
    "operator": "Forum Réfugiés",
    "email": "agir34@forumrefugies.org",
  },
  {
    "dispositifId": "660d1d704672fd6af8c456dd",
    "department": "35 - Ille-et-Vilaine",
    "operator": "Coallia",
    "email": "agir35@coallia.org",
    "phone": "07 77 37 38 27"
  },
  {
    "dispositifId": "660d1f34de6312466236063d",
    "department": "36 - Indre",
    "operator": "Coallia",
    "email": "aline.brecheliere-morel@coallia.org",
    "phone": "05,49,92,29,23"
  },
  {
    "dispositifId": "660d1f35de63124662360645",
    "department": "38 - Isère",
    "operator": "Alfa3a",
    "email": "agir38@alfa3a.org",
    "phone": "04 81 51 05 62"
  },
  {
    "dispositifId": "660d1f35de63124662360650",
    "department": "39 - Jura",
    "operator": "COOP-AGIR",
    "email": "agir39@coop-agir.fr",
    "phone": "03 84 82 45 18"
  },
  {
    "dispositifId": "660d1f36de63124662360656",
    "department": "40 - Landes",
    "operator": "COS",
    "email": "cphdeslandes@fondationcos.org",
    "phone": "05 58 93 09 65"
  },
  {
    "dispositifId": "660d1f34de6312466236063e",
    "department": "41 - Loir-et-Cher",
    "operator": "Viltaïs - Soliha 41",
    "email": "agir.41@soliha.fr",
    "phone": "04 70 48 25 00"
  },
  {
    "dispositifId": "660d1f35de63124662360646",
    "department": "42 - Loire",
    "operator": "Entraide Pierre Valdo",
  },
  {
    "dispositifId": "660d1f35de63124662360647",
    "department": "43 - Haute-Loire",
    "operator": "Entraide Pierre Valdo",
  },
  {
    "dispositifId": "660d1f36de6312466236065b",
    "department": "44 - Loire-Atlantique",
    "operator": "SOS Solidarités",
    "email": "agirensemble44@groupe-sos.org",
    "phone": "02 40 35 74 76"
  },
  {
    "dispositifId": "660d1f34de6312466236063f",
    "department": "45 - Loiret",
    "operator": "Viltaïs - Soliha 45 - Aurore",
    "email": "agir.45@viltais.eu",
    "phone": "04 70 48 25 00"
  },
  {
    "dispositifId": "660d1f38de6312466236067c",
    "department": "46 - Lot",
    "operator": "Lot pour Toits (REGAR)",
    "email": "coordinationagir@lotpourtoits.fr",
  },
  {
    "dispositifId": "660d1f3ade63124662360684",
    "department": "47 - Lot-et-Garonne",
    "operator": "Viltaïs",
    "email": "agir.47@viltais.eu",
    "phone": "04 70 48 25 00"
  },
  {
    "dispositifId": "660d1f36de63124662360666",
    "department": "48 - Lozère",
    "operator": "Habitat et Humanisme",
    "email": "urgence@habitat-humanisme.org",
    "phone": "01 40 19 15 15"
  },
  {
    "dispositifId": "660d1f37de6312466236066a",
    "department": "49 - Maine-et-Loire",
    "operator": "INALTA Formation",
    "email": "maine.et.loire@agir495372.fr",
  },
  {
    "dispositifId": "660d1f37de63124662360678",
    "department": "50 - Manche",
    "operator": "FTDA",
    "email": "mvallee@france-terre-asile.org",
    "phone": "06 99 42 92 40"
  },
  {
    "dispositifId": "660d1f37de63124662360676",
    "department": "51 - Marne",
    "operator": "AFND",
    "email": "siege@foyernotredame.org",
  },
  {
    "dispositifId": "660d1f36de63124662360665",
    "department": "53 - Mayenne",
    "operator": "INALTA Formation",
    "email": "mayenne@agir495372.fr",
  },
  {
    "dispositifId": "660d1f38de6312466236067e",
    "department": "54 - Meurthe-et-Moselle",
    "operator": "ARELIA",
    "email": "agir@arelia-asso.fr",
    "phone": "06 73 67 52 87"
  },
  {
    "dispositifId": "660d1f37de6312466236066c",
    "department": "56 - Morbihan",
    "operator": "Coallia",
    "email": "laurent.denouel@collia.org",
  },
  {
    "dispositifId": "660d1f35de6312466236064c",
    "department": "57 - Moselle",
    "operator": "AMLI",
    "email": "amli.agir@batigere.fr ",
    "phone": "03 87 16 33 00"
  },
  {
    "dispositifId": "660d18ea684cbc7e836f00d7",
    "department": "58 - Nièvre",
    "operator": "Fédération d'Œuvres Laïques",
    "email": "fol58@fol58.org",
    "phone": "03 86 71 97 50"
  },
  {
    "dispositifId": "660d1f37de6312466236066e",
    "department": "59 - Nord",
    "operator": "France Horizon",
    "email": "hautsdefrance@france-horizon.fr",
    "phone": "03 20 94 78 20"
  },
  {
    "dispositifId": "660d1f3ade63124662360685",
    "department": "60 - Oise",
    "operator": "Coallia",
    "email": "agir.60@coallia.org",
  },
  {
    "dispositifId": "660d18e9684cbc7e836f00d5",
    "department": "63 - Puy-de-Dôme",
    "operator": "Cécler",
    "phone": "04 77 30 32 95"
  },
  {
    "dispositifId": "660d1f36de6312466236065c",
    "department": "64 - Pyrénées-Atlantiques",
    "operator": "France Horizon",
    "email": "pessac@france-horizon.fr",
    "phone": "05 57 89 09 09"
  },
  {
    "dispositifId": "660d1f37de63124662360668",
    "department": "65 - Hautes-Pyrénées",
    "operator": "Atrium",
    "email": "g.pellerin@fjt-tarbes.fr",
    "phone": "05 62 38 91 20"
  },
  {
    "dispositifId": "660d1f36de63124662360660",
    "department": "66 - Pyrénées-Orientales",
    "operator": "ACAL, Forum Réfugiés",
    "email": "agir.66@acal.asso.fr",
    "phone": "04 48 22 15 12"
  },
  {
    "dispositifId": "660d1f35de6312466236064e",
    "department": "68 - Haut-Rhin",
    "operator": "APPUIS",
    "email": "agir-68@association-appuis.fr",
    "phone": "03 89 66 14 40"
  },
  {
    "dispositifId": "660d18ea684cbc7e836f00d6",
    "department": "69 - Rhône",
    "operator": "Forum Réfugiés",
    "email": "direction@forumrefugies.org ",
    "phone": "04 78 03 74 45"
  },
  {
    "dispositifId": "660d1f37de63124662360671",
    "department": "70 - Haute-Saône",
    "operator": "Viltaïs",
    "email": "agir.70@viltais.eu",
    "phone": "04 70 48 25 00"
  },
  {
    "department": "71 - Saône-et-Loire",
    "operator": "Coallia",
    "email": "pas encore communiqué",
  },
  {
    "dispositifId": "660d1f36de63124662360663",
    "department": "72 - Sarthe",
    "operator": "INALTA Formation",
    "email": "sarthe@agir495372.fr",
  },
  {
    "dispositifId": "660d1f35de63124662360648",
    "department": "73 - Savoie",
    "operator": "Fédération d'Œuvres Laïques",
    "email": "agir73@fol74.org",
    "phone": "04 50 52 70 84"
  },
  {
    "dispositifId": "660d1f35de63124662360649",
    "department": "74 - Haute-Savoie",
    "operator": "Fédération d'Œuvres Laïques",
  },
  {
    "dispositifId": "660d1f3ade63124662360683",
    "department": "75 - Paris",
    "operator": "FTDA",
    "email": "votchoumou@france-terre-asile.org",
    "phone": "01 40 40 27 20"
  },
  {
    "dispositifId": "660d1f38de63124662360682",
    "department": "79 - Deux-Sèvres",
    "operator": "L'Escale",
    "email": "escale@escale-larochelle.com",
    "phone": "05 17 83 46 57"
  },
  {
    "dispositifId": "660d1f36de6312466236065f",
    "department": "81 - Tarn",
    "operator": "Atrium",
    "email": "accueil@solidac81.fr",
    "phone": "05 63 72 99 39"
  },
  {
    "dispositifId": "660d1f37de63124662360675",
    "department": "82 - Tarn-et-Garonne",
    "operator": "Forum Réfugiés",
    "email": "agir82@forumrefugies.org",
  },
  {
    "department": "83 - Var",
    "operator": "Entraide Pierre Valdo",
    "email": "contact@epvaldo.org",
  },
  {
    "dispositifId": "660d1f37de6312466236066f",
    "department": "84 - Vaucluse",
    "operator": "Entraide Pierre Valdo",
    "email": "contact@epvaldo.org",
  },
  {
    "dispositifId": "660d1f36de63124662360658",
    "department": "85 - Vendée",
    "operator": "SOS Solidarités",
    "email": "agirensemble85@groupe-sos.org",
    "phone": "02 40 35 74 76"
  },
  {
    "dispositifId": "660d1f38de6312466236067b",
    "department": "86 - Vienne",
    "operator": "Coallia",
    "email": "aline.brecheliere-morel@coallia.org",
    "phone": "05 49 92 29 23"
  },
  {
    "dispositifId": "660d1f36de6312466236065a",
    "department": "87 - Haute-Vienne",
    "operator": "ARSL",
    "email": "contact@arsl.eu",
    "phone": "05 55 77 57 77"
  },
  {
    "department": "88 - Vosges",
    "operator": "Coallia",
    "email": "contact-vosges@coallia.org",
    "phone": "03 55 19 03 14"
  },
  {
    "dispositifId": "64ecbea9dc235bc9c431587b",
    "department": "89 - Yonne",
    "operator": "Fédération d'Œuvres Laïques",
    "email": "fol58@fol58.org",
    "phone": "03 86 71 97 50"
  },
  {
    "dispositifId": "660d1d704672fd6af8c456db",
    "department": "90 - Territoire de Belfort",
    "operator": "Association Hygiène Sociale",
    "email": "benjamin.juste@addsea.fr",
    "phone": "03 81 51 97 10"
  },
  {
    "dispositifId": "660d1f35de63124662360655",
    "department": "91 - Essonne",
    "operator": "Coallia",
    "email": "agir91@coallia.org",
  },
  {
    "dispositifId": "660d1f37de63124662360674",
    "department": "94 - Val-de-Marne",
    "operator": "SOS Solidarités",
    "email": "agir94@groupe-sos.org",
  },
  {
    "dispositifId": "660d1f38de6312466236067a",
    "department": "95 - Val-d'Oise",
    "operator": "Coallia",
    "email": "contact@coallia.org",
  }
]


export const operatorsPerDepartment: Record<string, Operator> = _.keyBy(operators.map(d => ({ ...d, depNumber: d.department.split(" - ")[0] })), "depNumber");
