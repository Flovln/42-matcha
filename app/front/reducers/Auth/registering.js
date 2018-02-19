'use strict'

const INITIAL_STATE = { registerLoading: false,
                        registerError: '',
                        registerSucceed: '',
                        activateSucceed: '',
                        activateError: ''
                      }

const registering = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'REGISTER_LOADING':
      return { ...state, registerLoading: action.isLoading }
    case 'REGISTER_SUCCESS':
      return { ...state, registerSucceed: action.registerSucceed, registerError: '' }
    case 'REGISTER_ERROR':
      return { ...state, registerError: action.hasErrored, registerSucceed: '' }
    case 'ACTIVATE_ACCOUNT_SUCCESS':
      return { ...state, activateSucceed: action.activateSucceed }
    case 'ACTIVATE_ACCOUNT_ERROR':
      return { ...state, activateError: action.hasErrored }

    default:
      return state
  }
}

export default registering