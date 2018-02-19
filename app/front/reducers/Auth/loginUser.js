'use strict'

const INITIAL_STATE = { loginLoading: false,
                        loginError: '',
                        loginSucceed: '',
                        logoutError: false,
                        logoutSucceed: false,
                        session: !!localStorage.jwtToken
                      }

const loginUser = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOGIN_LOADING':
      return { ...state, loginLoading: action.isLoading }
    case 'LOGIN_SUCCESS':
      return { ... state, loginSucceed: action.loginSucceed, session: !!localStorage.jwtToken, loginError: '' }
    case 'LOGIN_ERROR':
      return { ... state, loginError: action.loginError, loginSucceed: '' }
    case 'LOGOUT_SUCCESS':
      return { ... state, logoutSucceed: action.logoutSucceed, session: false }
    case 'LOGOUT_ERROR':
      return { ... state, logoutError: action.logoutError }

    default:
      return state
  }
}

export default loginUser