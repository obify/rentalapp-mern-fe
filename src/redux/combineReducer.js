import { combineReducers } from 'redux'
import { userReducer } from './user/userReducer'

export const combineReducer = combineReducers({
    user: userReducer
})