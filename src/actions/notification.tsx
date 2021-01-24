import { NotificationState, NotificationActions, SHOW_NOTIFICATION } from '../types/notifycation'

export function showNotificationAction(payload: NotificationState): NotificationActions {
  return {
    type: SHOW_NOTIFICATION,
    payload
  }
}