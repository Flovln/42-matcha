'use strict'

export const LOGIN_LOADING = 'LOGIN_LOADING'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_ERROR = 'LOGOUT_ERROR'

export const loginIsLoading = bool => {
  return {
    type: LOGIN_LOADING,
    isLoading: bool
  }
}

export const loginSuccess = content => {
  return {
    type: LOGIN_SUCCESS,
    loginSucceed: content
  }
}

export const loginError = content => {
  return {
    type: LOGIN_ERROR,
    loginError: content
  }
}

export const loginFetchData = (data, history) => {
  return dispatch => {
    const url = 'http://localhost:3000/api/login'

    dispatch(loginIsLoading(true))

    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)      
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.error){
        dispatch(loginError(res.error))
      } else {
        localStorage.setItem('jwtToken', res.token)
        localStorage.setItem('login', res.informations.login)
        dispatch(loginSuccess(res.message))
        history.push('/')
      }
    })
    .catch((error) => {
      dispatch(loginError(error))
    })
  }
}

/* BAD PRACTICE */
export const setLoginActionsToDefault = () => {
  return dispatch => {
    dispatch(loginIsLoading(false))
    dispatch(loginSuccess(''))
    dispatch(loginError(''))
  }
}

export const logoutSuccess = bool => {
  return {
    type: LOGOUT_SUCCESS,
    logoutSucceed: bool
  }
}

export const logoutError = bool => {
  return {
    type: LOGOUT_ERROR,
    logoutError: bool
  }
}

export const logoutFetchData = (history) => {
  return dispatch => {
    const url = 'http://localhost:3000/api/logout'

    fetch(url, {
      method: 'get',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-Access-Token': localStorage.getItem('jwtToken')
      }      
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.error) {
        dispatch(logoutError(res.error))
      } else {
        dispatch(logoutSuccess(res.success))
        localStorage.removeItem('jwtToken')
        localStorage.removeItem('login')

        history.push('/')
      }
    })
    .catch((error) => dispatch(logoutError(error)))
  }
}