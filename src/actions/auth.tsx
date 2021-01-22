import { AuthState, AuthActions, CHANGE_AUTH, USER_LOGOUT } from './../types/auth'

export function changeAuthAction(payload: AuthState): AuthActions {
  return {
    type: CHANGE_AUTH,
    payload
  }
}

export function userLogoutAction(): AuthActions {
  return {
    type: USER_LOGOUT,
  }
}