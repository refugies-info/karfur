/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

// undefined means that the route has no nav param
export type RootStackParamList = {
  Root: undefined;
  OnboardingNavigator: undefined;
  LanguageChoiceNavigator: undefined;
};

export type BottomTabParamList = {
  Explorer: undefined;
  Favoris: undefined;
  Profil: undefined;
  Search: undefined;
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

export type SearchParamList = {
  SearchScreen: undefined;
};

export type OnboardingParamList = {
  OnboardingStart: undefined;
  OnboardingStep1: undefined;
  OnboardingStep2: undefined;
  OnboardingStep3: undefined;
  OnboardingStep4: undefined;
};

export type LanguageChoiceParamList = {
  LanguageChoice: undefined;
};
