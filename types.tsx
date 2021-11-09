import { ObjectId } from "./src/types/interface";

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
  Favoris: {
    screen?: string
  }
  Profil: undefined;
  Search: undefined;
};

export type ExplorerParamList = {
  ExplorerScreen: undefined;
  ContentsScreen: {
    tagName: string;
    tagDarkColor: string;
    tagVeryLightColor: string;
    tagLightColor: string;
    needId: ObjectId;
    iconName: string;
    backScreen?: string
  };
  ContentScreen: {
    contentId: ObjectId;
    tagDarkColor: string;
    tagVeryLightColor: string;
    tagName: string;
    tagLightColor: string;
    iconName: string;
    backScreen?: string
  };
  NeedsScreen: {
    tagDarkColor: string;
    tagVeryLightColor: string;
    tagName: string;
    tagLightColor: string;
    iconName: string;
    backScreen?: string
  };
};

export type FavorisParamList = {
  FavorisScreen: undefined;
};

export type SearchParamList = {
  SearchScreen: undefined;
  SearchResultsScreen: undefined;
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
