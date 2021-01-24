import { NotificationState, NotificationActions, SHOW_NOTIFICATION } from '../types/notifycation'

const initialState: NotificationState = {
  show: false,
  variant: 'default',
  content: ''
}

export const notificationReducer = (state = initialState, action: NotificationActions): NotificationState => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return action.payload
    default:
      return state
  }
}