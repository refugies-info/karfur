import { assetsOnServer } from "assets/assetsOnServer";

export type Partner = {
  name: string
  date: Date
  logo: string
}
export const partners: Partner[] = [
  {
    name: "Coallia",
    date: new Date("09/27/2019"),
    logo: assetsOnServer.partners.Coallia,
  },
  {
    name: "Konexio",
    date: new Date("10/03/2019"),
    logo: assetsOnServer.partners.Konexio,
  },
  {
    name: "Simplon",
    date: new Date("10/07/2019"),
    logo: assetsOnServer.partners.Simplon,
  },
  {
    name: "Causons",
    date: new Date("10/09/2019"),
    logo: assetsOnServer.partners.Causons,
  },
  {
    name: "Aurore",
    date: new Date("10/14/2019"),
    logo: assetsOnServer.partners.Aurore,
  },
  {
    name: "CASP",
    date: new Date("10/15/2019"),
    logo: assetsOnServer.partners.CASP,
  },
  {
    name: "IFRI",
    date: new Date("10/16/2019"),
    logo: assetsOnServer.partners.IFRI,
  },
  {
    name: "Puy de Dome",
    date: new Date("10/17/2019"),
    logo: assetsOnServer.partners.Puy,
  },
  {
    name: "France Terre d'Asile",
    date: new Date("10/24/2019"),
    logo: assetsOnServer.partners.FTDA,
  },
  {
    name: "Each One",
    date: new Date("10/25/2019"),
    logo: assetsOnServer.partners.EachOne,
  },
  {
    name: "WERO",
    date: new Date("10/28/2019"),
    logo: assetsOnServer.partners.WERO,
  },
  {
    name: "Habitat Humanisme",
    date: new Date("10/30/2019"),
    logo: assetsOnServer.partners.Habitat,
  },
  {
    name: "JRS France",
    date: new Date("10/31/2019"),
    logo: assetsOnServer.partners.JRS,
  },
  {
    name: "CESAM",
    date: new Date("11/03/2019"),
    logo: assetsOnServer.partners.CESAM,
  },
  {
    name: "Singa",
    date: new Date("11/04/2019"),
    logo: assetsOnServer.partners.Singa,
  },
  {
    name: "Fondation COS",
    date: new Date("11/14/2019"),
    logo: assetsOnServer.partners.COS,
  },
  {
    name: "Groupe SOS",
    date: new Date("11/18/2019"),
    logo: assetsOnServer.partners.SOS,
  },
  {
    name: "CNAM",
    date: new Date("11/20/2019"),
    logo: assetsOnServer.partners.CNAM,
  },
  {
    name: "INALCO",
    date: new Date("11/22/2019"),
    logo: assetsOnServer.partners.INALCO,
  },
  {
    name: "France Horizon",
    date: new Date("12/11/2019"),
    logo: assetsOnServer.partners.FranceHorizon,
  },
  {
    name: "CroixRouge",
    date: new Date("01/23/2020"),
    logo: assetsOnServer.partners.CRF,
  },
  {
    name: "Duo For a Job",
    date: new Date("01/25/2020"),
    logo: assetsOnServer.partners.Duo,
  },
  {
    name: "Forum Refugiés",
    date: new Date("01/31/2020"),
    logo: assetsOnServer.partners.ForumRefugies,
  },
  {
    name: "Benenova",
    date: new Date("02/06/2020"),
    logo: assetsOnServer.partners.Benenova,
  },
  {
    name: "Action Emploi Réfugiés",
    date: new Date("02/26/2020"),
    logo: assetsOnServer.partners.AER,
  },
  {
    name: "Mission Local",
    date: new Date("08/26/2020"),
    logo: assetsOnServer.partners.MissionLocale,
  },
];

export const former_membres = [
  {
    name: "Simon Karleskind",
    roleName: "Chef de projet",
    linkedin: "https://www.linkedin.com/in/simon-karleskind/",
    color: "#EDEBEB",
    borderColor: "#212121",
    textColor: "#212121",
  },
  {
    name: "Luca Mazzi",
    roleName: "Développeur",
    linkedin: "https://www.linkedin.com/in/lmazzi/",
    color: "#EDEBEB",
    borderColor: "#212121",
    textColor: "#212121",
  },
  {
    name: "Soufiane Lamrissi",
    roleShort: "Développeur",
    roleName: "Développeur",
    linkedin: "https://www.linkedin.com/in/soufiane-lamrissi-15b79261/",
    twitter: "https://twitter.com/Wriri",
    color: "#EDEBEB",
    borderColor: "#212121",
    textColor: "#212121",
  },
  {
    name: "Chloé Vermeulin",
    roleName: "Designer",
    linkedin: "https://www.linkedin.com/in/chlo%C3%A9-vermeulin-a3773069/",
    color: "#EDEBEB",
    borderColor: "#212121",
    textColor: "#212121",
  },
  {
    name: "Ana Mylonas",
    roleName: "Responsable éditoriale",
    linkedin: "https://www.linkedin.com/in/ana-mylonas-scpobx/",
    color: "#EDEBEB",
    borderColor: "#212121",
    textColor: "#212121",
  },
];

export const membres = [
  {
    name: "Alain Régnier",
    roleShort: "Mentor",
    twitter: "https://twitter.com/DIRefugies",
    autre: "https://accueil-integration-refugies.fr/",
    color: "#F7CDD4",
    borderColor: "#B50437",
    textColor: "#212121",
  },
  {
    name: "Nour Allazkani",
    roleName: "Ambassadeur",
    linkedin: "https://www.linkedin.com/in/nour-allazkani-782404140/",
    color: "#F9F1FD",
    borderColor: "#77057A",
    textColor: "#212121",
  },
  {
    name: "Hugo Stéphan",
    roleName: "Designer",
    portfolio: "https://hugostephan.com/",
    twitter: "https://twitter.com/HugoStephan",
    linkedin: "https://linkedin.com/in/hugo-stephan/",
    color: "#FEEBDE",
    borderColor: "#EA6206",
    textColor: "#212121",
  },

  {
    name: "Agathe Kieny",
    roleName: "Développeuse",
    linkedin: "https://www.linkedin.com/in/agathe-kieny-976720ab/",
    color: "#EEF8FF",
    borderColor: "#0A54BF",
    textColor: "#212121",
  },

  {
    name: "Alice Mugnier",
    roleName: "Responsable éditoriale",
    linkedin: "https://www.linkedin.com/in/alice-mugnier-8a7717130",
    twitter: "https://twitter.com/Affy_M",
    portfolio: "https://acemugnier.wordpress.com/",
    color: "#EDFDF9",
    borderColor: "#187F73",
    textColor: "#212121",
  },
  {
    name: "Gaël de Mondragon",
    roleName: "Product owner",
    linkedin: "https://fr.linkedin.com/in/gaeldemondragon",
    color: "#DDF2F9",
    borderColor: "#1174BA",
    textColor: "#212121",
  },
  {
    name: "Margot Gillette",
    roleName: "Designer",
    linkedin:
      "https://www.linkedin.com/in/margot-gillette-349a028a/?originalSubdomain=fr",
    portfolio: "https://www.malt.fr/profile/margotgillette",
    color: "#FFEAF4",
    borderColor: "#A81E63",
    textColor: "#212121",
  },
  {
    name: "Camille Saillard",
    roleName: "Développeuse",
    linkedin: "https://www.linkedin.com/in/camille-saillard-8677a5a6/",
    portfolio: "https://www.malt.fr/profile/camillesaillard",
    color: "#F2F9E5",
    borderColor: "#307205",
    textColor: "#212121",
  },
];
