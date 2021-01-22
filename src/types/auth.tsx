export const CHANGE_AUTH = 'CHANGE_AUTH'
export const USER_LOGOUT = 'USER_LOGOUT'

export interface AuthState {
  user: object,
  logged: boolean,
  token: string
}

export interface AuthAction {
  type: typeof CHANGE_AUTH,
  payload: AuthState
}

export interface UserLogoutAction {
  type: typeof USER_LOGOUT
}

export type AuthActions = AuthAction | UserLogoutAction