// Store/Reducers/favoriteReducer.js

//A changer, c'est juste pour l'exemple
const initialState = { languei18nCode: 'fr' }

function toggleLangue(state = initialState, action) {
  let nextState
  switch (action.type) {
    case 'TOGGLE_LANGUE':
      nextState = {
        ...state,
        languei18nCode: action.value
      }
      return nextState || state
  default:
    return state
  }
}

export default toggleLangue;