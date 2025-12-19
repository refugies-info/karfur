import { useTranslation } from "next-i18next";
import TeamAlice from "~/assets/staticPages/mission-et-impact/team-alice.png";
import TeamAndressa from "~/assets/staticPages/mission-et-impact/team-andressa.png";
import TeamClaudia from "~/assets/staticPages/mission-et-impact/team-claudia.png";
import TeamFatma from "~/assets/staticPages/mission-et-impact/team-fatma.png";
import TeamJeremie from "~/assets/staticPages/mission-et-impact/team-jeremie.png";
import TeamLuis from "~/assets/staticPages/mission-et-impact/team-luis.png";
import TeamMargot from "~/assets/staticPages/mission-et-impact/team-margot.png";
import TeamMarianne from "~/assets/staticPages/mission-et-impact/team-marianne.png";
import TeamMatthieu from "~/assets/staticPages/mission-et-impact/team-matthieu.png";
import TeamNour from "~/assets/staticPages/mission-et-impact/team-nour.png";
import TeamXavier from "~/assets/staticPages/mission-et-impact/team-xavier.png";

export const useTeamData = () => {
  const { t } = useTranslation();
  return [
    {
      name: "Alice Mugnier",
      position: t("MissionImpact.team_position_resp_edito"),
      tag: t("MissionImpact.team_pole_edito"),
      link: "https://www.linkedin.com/in/alice-mugnier-8a7717130/",
      image: TeamAlice,
    },
    {
      name: "Andressa Bittencourt",
      position: t("MissionImpact.team_position_resp_com"),
      tag: t("MissionImpact.team_pole_deploiement"),
      link: "https://www.linkedin.com/in/andressa-bittencourt-09030098/",
      image: TeamAndressa,
    },
    {
      name: "Claudia Meleghi",
      position: t("MissionImpact.team_position_chargee_edito"),
      tag: t("MissionImpact.team_pole_edito"),
      link: "https://www.linkedin.com/in/claudia-meleghi/",
      image: TeamClaudia,
    },
    {
      name: "Fatma Bouhejba",
      position: t("MissionImpact.team_position_resp_partenariats"),
      tag: t("MissionImpact.team_pole_partenariat"),
      link: "https://www.linkedin.com/in/fatma-bouhejba-046165142/",
      image: TeamFatma,
    },
    {
      name: "Jérémie Gisserot",
      position: t("MissionImpact.team_position_dev"),
      tag: t("MissionImpact.team_pole_produit"),
      link: "https://jeremie-gisserot.net",
      image: TeamJeremie,
    },
    {
      name: "Luis Arias",
      position: t("MissionImpact.team_position_cto"),
      tag: t("MissionImpact.team_pole_produit"),
      link: "https://www.linkedin.com/in/luisarias/",
      image: TeamLuis,
    },
    {
      name: "Margot Gillette",
      position: t("MissionImpact.team_position_designer"),
      tag: t("MissionImpact.team_pole_produit"),
      link: "https://www.linkedin.com/in/margot-gillette-349a028a/",
      image: TeamMargot,
    },
    {
      name: "Marianne Georges",
      position: t("MissionImpact.team_position_product_manager"),
      tag: t("MissionImpact.team_pole_produit"),
      link: "https://www.linkedin.com/in/mariannegeorges/",
      image: TeamMarianne,
    },
    {
      name: "Matthieu Fesselier",
      position: t("MissionImpact.team_position_dev"),
      tag: t("MissionImpact.team_pole_produit"),
      link: "https://www.linkedin.com/in/matthieu-fesselier/",
      image: TeamMatthieu,
    },
    {
      name: "Nour Allazkani",
      position: t("MissionImpact.team_position_project_manager"),
      tag: t("MissionImpact.team_pole_pilotage"),
      link: "https://www.linkedin.com/in/luc-nour-allazkani/",
      image: TeamNour,
    },
    {
      name: "Xavier Dumas",
      position: t("MissionImpact.team_position_resp_support"),
      tag: t("MissionImpact.team_pole_edito"),
      link: "https://www.linkedin.com/in/xavier-dumas/",
      image: TeamXavier,
    },
  ];
};
