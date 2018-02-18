'use strict'

const INITIAL_STATE = { sendSucceed: false,
                        sendError: false }

const messaging = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SEND_MESSAGE_SUCCESS':
      return { ...state, sendSucceed: action.sendSucceed }
    case 'SEND_MESSAGE_ERROR':
      return { ...state, hasErrored: action.hasErrored }

    default:
      return state
  }
}

export default messaging