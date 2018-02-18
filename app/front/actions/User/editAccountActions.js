'use strict'

export const UPDATE_EMAIL_SUCCESS = 'UPDATE_EMAIL_SUCCESS'
export const UPDATE_EMAIL_ERROR = 'UPDATE_EMAIL_ERROR'

export const updateSuccess = bool => {
  return {
    type: UPDATE_EMAIL_SUCCESS,
    updateSucceed: bool
  }
}

export const updateError = bool => {
  return {
    type: UPDATE_EMAIL_ERROR,
    hasErrored: bool
  }
}

export const updateEmail = data => {
  return dispatch => {
    const url = 'http://localhost:3000/api/update/account'
    
    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-Access-Token': localStorage.getItem('jwtToken')
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.error){
        dispatch(updateError(true))
      }
      else{
        dispatch(updateSuccess(true))
      }
    })
    .catch((error) => {
      dispatch(updateError(true))
    })
  }
}