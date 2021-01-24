import { combineReducers } from "redux"
import { authReducer } from './auth'
import { notificationReducer } from './notification'

export const rootReducer = combineReducers({
  auth: authReducer,
  notification: notificationReducer,
  //AnotherReducer
})

export type RootState = ReturnType<typeof rootReducer>