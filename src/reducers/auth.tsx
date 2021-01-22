import { AuthState, AuthActions, CHANGE_AUTH, USER_LOGOUT } from './../types/auth'

const initialState: AuthState = {
  user: {},
  logged: false,
  token: ''
}

export const authReducer = (state = initialState, action: AuthActions): AuthState => {
  switch (action.type) {
    case CHANGE_AUTH:
      return action.payload
    case USER_LOGOUT:
      return initialState
    default:
      return state
  }
}