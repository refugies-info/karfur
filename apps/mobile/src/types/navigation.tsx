import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { GetThemeResponse } from "@refugies-info/api-types";
import { ValidScreen } from "~/libs/backButton";

/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

// undefined means that the route has no nav param
export type RootStackParamList = {
  Root: undefined;
  OnboardingNavigator: undefined;
  LanguageChoiceNavigator: undefined;
  SearchScreen: undefined;
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
    theme: GetThemeResponse;
    needId: string;
    backScreen?: ValidScreen;
  };
  ContentScreen: {
    contentId: string;
    needId?: string;
    theme?: GetThemeResponse;
    backScreen?: ValidScreen;
  };
  NeedsScreen: {
    theme: GetThemeResponse;
    backScreen?: ValidScreen;
  };
  NotificationsScreen: object;
  NearMeCardsScreen: undefined;
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
  ActivateNotificationsScreen: undefined;
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
  ShareScreen: undefined;
};

export type LanguageChoiceParamList = {
  LanguageChoice: undefined;
};

export interface GoogleAPISuggestion {
  structured_formatting: { main_text: string };
  place_id: string;
  description: string;
}

export interface GeoAPISuggestion {
  properties: {
    city: string;
    context: string;
    label: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

export type ExplorerScreenProps<T extends keyof ExplorerParamList> = CompositeScreenProps<
  StackScreenProps<ExplorerParamList, T>,
  BottomTabScreenProps<BottomTabParamList>
>;
