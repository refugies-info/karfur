/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

// undefined means that the route has no nav param
export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  OnboardingNavigator: undefined;
  LanguageChoiceNavigator: undefined;
};

export type BottomTabParamList = {
  Explorer: undefined;
  Favoris: undefined;
  Profil: undefined;
};

export type ExplorerParamList = {
  ExplorerScreen: undefined;
};

export type FavorisParamList = {
  FavorisScreen: undefined;
};

export type ProfilParamList = {
  ProfilScreen: undefined;
};

export type OnboardingParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
};

export type LanguageChoiceParamList = {
  LanguageChoice: undefined;
};
