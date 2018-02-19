'use strict'

const INITIAL_STATE = { sendSucceed: '',
                        sendError: '',
                        updateSucceed: '',
                        updateError: ''
                      }

const resetPassword = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case 'SEND_SUCCESS':
      return { ... state, sendSucceed: action.sendSucceedMsg, updateError: '' } 
    case 'SEND_ERROR':
      return { ... state, sendError: action.sendErrorMsg, updateSucceed: '' }
    case 'UPDATE_SUCCESS':
      return { ... state, updateSucceed: action.updateSucceed, updateError: '' }
    case 'UPDATE_ERROR':
      return { ... state, updateError: action.updateError, updateSucceed: '' }

    default:
      return state
  }
}

export default resetPassword