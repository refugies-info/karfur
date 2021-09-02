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
  userFavorites: [],
  userContributions: [],
  needs: [],
};
