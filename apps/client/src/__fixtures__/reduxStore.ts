import type { LangueState } from "~/services/Langue/langue.reducer";
import type { SearchResultsState } from "~/services/SearchResults/searchResults.reducer";
import type { UserFavoritesState } from "~/services/UserFavoritesInLocale/UserFavoritesInLocale.reducer";
import { activeThemesMock } from "./activeThemes";

const initialMockUserState = {
  user: null,
  admin: false,
  traducteur: false,
  expertTrad: false,
  contributeur: false,
  caregiver: false,
  hasStructure: false,
  userId: null,
  rolesInStructure: [],
};
const initialMockLangueState: LangueState = {
  langues: [
    {
      _id: "fr",
      langueFr: "Français",
      langueLoc: "Français",
      langueCode: "fr",
      i18nCode: "fr",
      avancement: 1,
      avancementTrad: 1,
    },
    {
      _id: "en",
      langueFr: "Anglais",
      langueLoc: "English",
      langueCode: "en",
      i18nCode: "en",
      avancement: 1,
      avancementTrad: 1,
    },
  ],
  languei18nCode: "fr",
  showLanguageModal: false,
  showLangModal: false,
};

const initialMockTranslationState = {
  translation: {
    initialText: {},
    translatedText: {},
  },
  translations: [],
};

const initialUserFavoritesState: UserFavoritesState = {
  favorites: null,
};

const initialMockSearchReults: SearchResultsState = {
  results: {
    matches: [],
    suggestions: [],
  },
  pagination: {
    page: 1,
    pageCount: 0,
    total: 0,
  },
  loading: false,
  noResults: [],
  query: {
    search: "",
    departments: [],
    themes: [],
    needs: [],
    age: [],
    frenchLevel: [],
    language: [],
    public: [],
    status: [],
    sort: "default",
    type: "all",
  },
};

export const initialMockStore = {
  user: initialMockUserState,
  langue: initialMockLangueState,
  activeDispositifs: [],
  tts: { ttsActive: false, showAudioSpinner: false },
  userStructure: null,
  selectedDispositif: null,
  loadingStatus: {},
  translation: initialMockTranslationState,
  activeStructures: [],
  selectedStructure: null,
  allDispositifs: [],
  allStructures: [],
  dispositifsWithTranslations: [],
  users: [],
  userFavorites: initialUserFavoritesState,
  userContributions: [],
  needs: [],
  themes: {
    activeThemes: activeThemesMock,
    inactiveThemes: [],
    hasLoaded: true,
  },
  searchResults: initialMockSearchReults,
};
