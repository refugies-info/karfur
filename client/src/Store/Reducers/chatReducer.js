// Store/Reducers/favoriteReducer.js
import * as actions from '../actions'

const initialState = { 
  messages: new Array(6).fill({
    text : 'Ad fugiat amet mollit quis do eiusmod duis cillum velit.',
    from : {username: 'Soufiane'},
    created_at: "2019-03-15T11:50:37.877Z"
    }), 
  message: '' 
}

function chatReducer(state = initialState, action) {
  let nextState
  switch (action.type) {
    case actions.GET_MSGS:
      console.log(action)
      nextState = {
        ...state,
        initialState
      }
      return nextState || state
    case actions.PUSH_MSG:
      console.log(action)
      nextState = {
        ...state,
        messages : [...state.messages, {
          text: action.value, 
          from : {username: 'Soufiane'},
          created_at: new Date()
        }],
        message:''
      }
      return nextState || state
  default:
    return state
  }
}

export default chatReducer;