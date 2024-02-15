import LogoAdoma from "assets/auth/structure-logos/structure-adoma.jpg";
import LogoCoallia from "assets/auth/structure-logos/structure-coallia.png";
import LogoPierreValdo from "assets/auth/structure-logos/structure-pierre-valdo.png";
import LogoFAS from "assets/auth/structure-logos/structure-fas.jpg";
import LogoCOS from "assets/auth/structure-logos/structure-cos.jpg";
import LogoForumRefugies from "assets/auth/structure-logos/structure-forum-refugies.jpg";
import LogoFranceHorizon from "assets/auth/structure-logos/structure-france-horizon.png";
import LogoFtda from "assets/auth/structure-logos/structure-ftda.png";
import LogoGipHis from "assets/auth/structure-logos/structure-gip-his.png";
import LogoGroupeSos from "assets/auth/structure-logos/structure-groupe-sos.png";
import LogoMens from "assets/auth/structure-logos/structure-mens.png";
import LogoViltais from "assets/auth/structure-logos/structure-viltais.png";

type Partner = {
  image: any;
  width: number;
  height: number;
  name: string;
}

export const partners: Partner[] = [
  { image: LogoAdoma, width: 56, height: 56, name: "Adoma" },
  { image: LogoCoallia, width: 56, height: 18, name: "Coallia" },
  { image: LogoPierreValdo, width: 56, height: 56, name: "Entraide Pierre Valdo" },
  { image: LogoFAS, width: 56, height: 56, name: "FAS" },
  { image: LogoCOS, width: 56, height: 56, name: "Fondation COS" },
  { image: LogoForumRefugies, width: 56, height: 56, name: "Forum Réfugiés" },
  { image: LogoFranceHorizon, width: 56, height: 46, name: "France Horizon" },
  { image: LogoFtda, width: 56, height: 34, name: "France Terre d'Asile" },
  { image: LogoGipHis, width: 56, height: 27, name: "GIP HIS" },
  { image: LogoGroupeSos, width: 56, height: 19, name: "Groupe SOS" },
  { image: LogoMens, width: 56, height: 21, name: "Mens" },
  { image: LogoViltais, width: 56, height: 19, name: "Viltaïs" }
]
