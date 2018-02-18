import { combineReducers } from 'redux'

import registering from './Auth/registering'
import loginUser from './Auth/loginUser'
import resetPassword from './Auth/resetPassword'
import userInfos from './User/userInfos'
import editAccount from './User/editAccount'
import editProfile from './User/editProfile'
import messaging from './User/messaging'
import tagsPool from './Tags/tagsPool'

const reducers = combineReducers({
  registering,
  loginUser,
  resetPassword,
  userInfos,
  editAccount,
  editProfile,
  tagsPool,
  messaging
})

export default reducers