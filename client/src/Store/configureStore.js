// Store/configureStore.js

import { createStore, combineReducers } from 'redux';
import toggleLangue from './Reducers/langueReducer';
import ttsReducer from './Reducers/ttsReducer';

const rootReducer = combineReducers({langue: toggleLangue, tts: ttsReducer})

export default createStore(rootReducer)