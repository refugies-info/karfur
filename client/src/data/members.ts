import Alain from "assets/qui-sommes-nous/Alain.png";
import Nour from "assets/qui-sommes-nous/Nour.png";
import Hugo from "assets/qui-sommes-nous/Hugo.png";
import Alice from "assets/qui-sommes-nous/Alice.png";
import Margot from "assets/qui-sommes-nous/Margot.png";

export type Member = {
  name: string
  roleShort?: string
  roleName?: string
  twitter?: string
  linkedin?: string
  autre?: string
  portfolio?: string
  color: string
  borderColor: string
  textColor: string
  image: any
}

export const members: Member[] = [
  {
    name: "Alain Régnier",
    roleShort: "Mentor",
    twitter: "https://twitter.com/DIRefugies",
    autre: "https://accueil-integration-refugies.fr/",
    color: "#F7CDD4",
    borderColor: "#B50437",
    textColor: "#212121",
    image: Alain,
  },
  {
    name: "Nour Allazkani",
    roleName: "Ambassadeur",
    linkedin: "https://www.linkedin.com/in/nour-allazkani-782404140/",
    color: "#F9F1FD",
    borderColor: "#77057A",
    textColor: "#212121",
    image: Nour,
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
    image: Hugo,
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
    image: Alice,
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
    image: Margot,
  },
];
