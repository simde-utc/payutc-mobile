const initialState = {
  login: '',
  mdp: ''
}

function changeLogin(state = initialState, action) {
  let nextState

  switch(action.type) {

    case 'NEW_LOGIN':
      nextState = {...state, login: action.value}
      return nextState || state

    case 'NEW_MDP':
      nextState = {...state, mdp: action.value}
      return nextState || state

    default:
      return state

  }
}
 export default changeLogin
