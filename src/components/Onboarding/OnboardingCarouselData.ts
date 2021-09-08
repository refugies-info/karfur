import { theme } from "../../theme";

export const onboardingCarouselData = [
  {
    stepNumber: 0,
    lightColor: theme.colors.sante40,
    darkColor: theme.colors.sante80,
    text: "Ici, tu trouves des fiches d’information pour faire tes démarches.",
  },

  {
    stepNumber: 1,
    lightColor: theme.colors.français40,
    darkColor: theme.colors.français80,
    text: "Découvre les associations et les activités de ta ville.",
  },
  {
    stepNumber: 2,
    lightColor: theme.colors.logement40,
    darkColor: theme.colors.logement80,
    text: "Les fiches sont écrites par les associations et relues par l’État.",
  },
  {
    stepNumber: 3,
    lightColor: theme.colors.admin40,
    darkColor: theme.colors.admin80,
    text: "Toute l'application est gratuite ! Pas besoin de payer.",
  },
];
