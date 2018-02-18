'use strict'

const INITIAL_STATE = { updateEmailError: false,
                        updateEmailSucceed: false
                      }

const updateAccount = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_EMAIL_SUCCESS':
      return { ...state, updateEmailSucceed: action.updateSucceed, session: !!localStorage.jwtToken }
    case 'UPDATE_EMAIL_ERROR':
      return { ...state, updateEmailError: action.hasErrored }

    default:
      return state
  }
}

export default updateAccount