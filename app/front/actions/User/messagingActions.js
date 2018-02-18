'use strict'

export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS'
export const SEND_MESSAGE_ERROR = 'SEND_MESSAGE_ERROR'

export const sendMessageSuccess = bool => {
  return {
    type: SEND_MESSAGE_SUCCESS,
    sendSucceed: bool
  }
}

export const sendMessageError = bool => {
  return {
    type: SEND_MESSAGE_ERROR,
    hasErrored: bool
  }
}

export const sendMessage = (sender, receiver, content) => {
  return dispatch => {
    const url = 'http://localhost:3000/api/message'
    const data = {
      sender: sender,
      receiver: receiver,
      content: content
    }

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
        dispatch(sendMessageError(res.error))
      }
      else{
        dispatch(sendMessageSuccess(res.message))
      }
    })
    .catch((error) => {
      dispatch(sendMessageError(error))
    })
  }
}