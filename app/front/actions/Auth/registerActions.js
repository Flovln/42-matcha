'use strict'

export const REGISTER_LOADING = 'REGISTER_LOADING'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const REGISTER_ERROR = 'REGISTER_ERROR'

export const registerIsLoading = bool => {
  return {
    type: REGISTER_LOADING,
    isLoading: bool
  }
}

export const registerSuccess = content => {
  return {
    type: REGISTER_SUCCESS,
    registerSucceed: content
  }
}

export const registerError = content => {
  return {
    type: REGISTER_ERROR,
    hasErrored: content
  }
}

export const registerFetchData = data => {
  return dispatch => {
    const url = 'http://localhost:3000/api/register'

    dispatch(registerIsLoading(true))

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
        dispatch(registerSuccess(''))
        dispatch(registerError(res.error)) //bad practice - to remove
      }
      else{
        dispatch(registerSuccess(res.message))
        dispatch(registerError('')) //bad practice - to remove
      }
    })
    .catch((error) => {
      dispatch(registerError(error))
    })
  }
}
/* BAD PRACTICE */
export const setRegisterActionsToDefault = () => {
  return dispatch => {
    dispatch(registerSuccess(''))
    dispatch(registerError(''))
  }
}

export const ACTIVATE_ACCOUNT_SUCCESS = 'ACTIVATE_ACCOUNT_SUCCESS'
export const ACTIVATE_ACCOUNT_ERROR = 'ACTIVATE_ACCOUNT_ERROR'

export const activateAccountSuccess = content => {
  return {
    type: ACTIVATE_ACCOUNT_SUCCESS,
    activateSucceed: content
  }
}

export const activateAccountError = content => {
  return {
    type: ACTIVATE_ACCOUNT_ERROR,
    hasErrored: content
  }
}

export const activateAccount = (login, token) => {
  return dispatch => {
    const url = 'http://localhost:3000/api/activate'+'?login='+login+'&token='+token

    fetch(url, {
      method: 'get',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.error){
        dispatch(activateAccountSuccess(res.error))
      }
      else{
        dispatch(activateAccountSuccess(res.message))
      }
    })
    .catch((error) => {
      dispatch(activateAccountError(error))
    })    
  }
}