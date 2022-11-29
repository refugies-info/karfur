import { RootState } from "services/rootReducer";
import { SearchResultsState } from "services/SearchResults/searchResults.reducer";
import { UserFavoritesState } from "services/UserFavoritesInLocale/UserFavoritesInLocale.reducer";
import { activeThemesMock } from "./activeThemes";

const initialMockUserState = {
  user: null,
  admin: false,
  traducteur: false,
  expertTrad: false,
  contributeur: false,
  membreStruct: false,
  userId: "",
  userFetched: false,
  rolesInStructure: [],
};
const initialMockLangueState = {
  langues: [],
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
  favorites: [],
  showFavoriteModal: false
}

const initialMockSearchReults: SearchResultsState = {
  results: {
    dispositifs: [],
    demarches: [],
    dispositifsSecondaryTheme: []
  },
  query: {
    search: "",
    departments: [],
    themes: [],
    needs: [],
    age: [],
    frenchLevel: [],
    language: [],
    sort: "date",
    type: "all",
  }
}

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
  users: [],
  userFavorites: initialUserFavoritesState,
  userContributions: [],
  needs: [],
  themes: {
    activeThemes: activeThemesMock,
    inactiveThemes: []
  },
  searchResults: initialMockSearchReults
};
