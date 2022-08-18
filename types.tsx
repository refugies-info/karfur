import { ObjectId, Theme } from "./src/types/interface";

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
  Favoris: {
    screen?: string;
  };
  Profil: undefined;
  Search: undefined;
};

export type ExplorerParamList = {
  ExplorerScreen: undefined;
  ContentsScreen: {
    theme: Theme,
    needId: ObjectId;
    backScreen?: string;
  };
  ContentScreen: {
    contentId: ObjectId;
    needId?: ObjectId;
    theme?: Theme,
    backScreen?: string;
  };
  NeedsScreen: {
    theme: Theme,
    backScreen?: string;
  };
  NotificationsScreen: {};
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

export type ProfileParamList = {
  ProfilScreen: undefined;
  LangueProfilScreen: undefined;
  AgeProfilScreen: undefined;
  CityProfilScreen: undefined;
  FrenchLevelProfilScreen: undefined;
  PrivacyPolicyScreen: undefined;
  LegalNoticeScreen: undefined;
  AboutScreen: undefined;
  AccessibilityScreen: undefined;
  NotificationsSettingsScreen: undefined;
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
  key: string;
}
