export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION'

enum Variants {
  default,
  error,
  warning,
  info,
  success,
}
type VariantsString = keyof typeof Variants;

export interface NotificationState {
  show: boolean,
  variant: VariantsString,
  content: string,
}

export interface ShowNotificationAction {
  type: typeof SHOW_NOTIFICATION,
  payload: NotificationState
}

export type NotificationActions = ShowNotificationAction // | AnotherAction