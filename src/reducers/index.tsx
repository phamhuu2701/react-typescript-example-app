import { combineReducers } from "redux"
import { authReducer } from './auth'

export const rootReducer = combineReducers({
  auth: authReducer,
  //AnotherReducer
})

export type RootState = ReturnType<typeof rootReducer>