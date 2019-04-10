// Store/configureStore.js

import { createStore, combineReducers } from 'redux';
import toggleLangue from './Reducers/langueReducer';
import chatReducer from './Reducers/chatReducer';

const rootReducer = combineReducers({langue: toggleLangue, chat: chatReducer})

export default createStore(rootReducer)