/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

// undefined means that the route has no nav param
export type RootStackParamList = {
  Root: undefined;
  OnboardingNavigator: undefined;
  LanguageChoiceNavigator: undefined;
  ProfilScreen: undefined;
  LangueProfilScreen: undefined;
  AgeProfilScreen: undefined;
  FrenchLevelProfilScreen: undefined;
  CityProfilScreen: undefined;
};

export type BottomTabParamList = {
  Explorer: undefined;
  Favoris: undefined;
  Profil: undefined;
  Search: undefined;
};

export type ExplorerParamList = {
  ExplorerScreen: undefined;
  ContentScreen: undefined;
};

export type FavorisParamList = {
  FavorisScreen: undefined;
};

export type SearchParamList = {
  SearchScreen: undefined;
};

export type OnboardingParamList = {
  OnboardingStart: undefined;
  OnboardingSteps: undefined;
  FilterCity: undefined;
  FilterAge: undefined;
  FilterFrenchLevel: undefined;
  FinishOnboarding: undefined;
  LanguageChoice: undefined;
};

export type LanguageChoiceParamList = {
  LanguageChoice: undefined;
};

export interface GoogleAPISuggestion {
  structured_formatting: { main_text: string };
  place_id: string;
  description: string;
}

export interface FrenchLevel {
  name: string;
  cecrCorrespondency?: string[];
}
