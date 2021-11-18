import { theme } from "../../theme";

export const onboardingCarouselData = [
  {
    stepNumber: 0,
    lightColor: theme.colors.sante80,
    darkColor: theme.colors.sante100,
    text: "Ici, tu trouves des fiches d’information pour faire tes démarches.",
  },

  {
    stepNumber: 1,
    lightColor: theme.colors.français80,
    darkColor: theme.colors.français100,
    text: "Découvre les associations et les activités de ta ville.",
  },
  {
    stepNumber: 2,
    lightColor: theme.colors.logement80,
    darkColor: theme.colors.logement100,
    text: "Les fiches sont écrites par les associations et relues par l’État.",
  },
  {
    stepNumber: 3,
    lightColor: theme.colors.travail80,
    darkColor: theme.colors.travail100,
    text: "Toute l'application est gratuite ! Pas besoin de payer.",
  },
];
