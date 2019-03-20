// Store/configureStore.js

import { createStore } from 'redux';
import toggleLangue from './Reducers/langueReducer'

export default createStore(toggleLangue)