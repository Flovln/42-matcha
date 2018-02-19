'use strict'

export const SEND_SUCCESS = 'SEND_SUCCESS'
export const SEND_ERROR = 'SEND_ERROR'

export const emailSentSuccess = content => {
  return {
    type: SEND_SUCCESS,
    sendSucceedMsg: content
  }
}

export const emailSentError = content => {
  return {
    type: SEND_ERROR,
    sendErrorMsg: content
  }
}

export const sendResetEmail = data => {
  return dispatch => {
    const url = 'http://localhost:3000/api/forgot-password'

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
        dispatch(emailSentError(res.error))
      } else {
        dispatch(emailSentSuccess(res.message))
      }
    })
    .catch((error) => dispatch(emailSentError('error sending email')))
  }
}

/* bad practice - to remove */
export const setActionsToDefault = bool => {
  return dispatch => {
    dispatch(emailSentSuccess(''))
    dispatch(emailSentError(''))
  }
}

export const UPDATE_SUCCESS = 'UPDATE_SUCCESS'
export const UPDATE_ERROR = 'UPDATE_ERROR'

export const setNewPasswordSuccess = content => {
  return {
    type: UPDATE_SUCCESS,
    updateSucceed: content
  }
}

export const setNewPasswordError = content => {
  return {
    type: UPDATE_ERROR,
    updateError: content
  }
}

export const newPasswordFetchData = data => {
  return dispatch => {
    const url = 'http://localhost:3000/api/reset-password'

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
        dispatch(setNewPasswordError(res.error))
      } else {
        dispatch(setNewPasswordSuccess(res.message))
      }
    })
    .catch((error) => dispatch(setNewPasswordError('request error ')))
  }
}