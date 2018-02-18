'use strict'

export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS'
export const UPLOAD_ERROR = 'UPLOAD_ERROR'

export const uploadSuccess = content => {
  return {
    type: UPLOAD_SUCCESS,
    uploadSucceed: content
  }
}

export const uploadError = bool => {
  return {
    type: UPLOAD_ERROR,
    uploadHasErrored: bool
  }
}

export const uploadImage = data => {
  return dispatch => {
    const url = 'http://localhost:3000/api/images'
    const formData = new FormData()

    formData.append('file', data.file)
    formData.append('name', data.filename)

    fetch(url, {
      method: 'post',
      headers: {
        'X-Access-Token': localStorage.getItem('jwtToken')
      },
      body: formData
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.error){
        dispatch(uploadError(true))
      }
      else {
        dispatch(uploadSuccess(res.public_infos.pictures))
      }
    })
    .catch((error) => {
      dispatch(uploadError(false))
    })
  }
}

export const REMOVE_SUCCESS = 'REMOVE_SUCCESS'
export const REMOVE_ERROR = 'REMOVE_ERROR'

export const removeSuccess = content => {
  return {
    type: REMOVE_SUCCESS,
    removeSucceed: content
  }
}

export const removeError = bool => {
  return {
    type: REMOVE_ERROR,
    removeHasErrored: bool
  }
}

export const removeFromServer = data => {
  return dispatch => {
    const url = 'http://localhost:3000/api/images/delete'

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
        dispatch(removeError(true))
      }
      else {
        dispatch(removeSuccess(res.public_infos.pictures))
      }
    })
    .catch((error) => {
      dispatch(removeError(false))
    })
  }
}

export const SET_NEW_NAMES_SUCCESS = 'SET_NEW_NAMES_SUCCESS'
export const SET_NEW_NAMES_ERROR = 'SET_NEW_NAMES_ERROR'

export const setNewNamesSuccess = content => {
  return {
    type: SET_NEW_NAMES_SUCCESS,
    setNewNamesSucceed: content
  }
}

export const setNewNamesError = content => {
  return {
    type: SET_NEW_NAMES_ERROR,
    hasErrored: content
  }
}

export const setNewUserNames = data => {
  return dispatch => {
    const url = 'http://localhost:3000/api/edit/names'

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
        dispatch(setNewNamesError(res.error))
      }
      else {
        dispatch(setNewNamesSuccess(res.public_infos))
      }
    })
    .catch((error) => {
      dispatch(setNewNamesError(false))
    })
  }
}

export const SET_USER_BIO_SUCCESS = 'SET_USER_BIO_SUCCESS'
export const SET_USER_BIO_ERROR = 'SET_USER_BIO_ERROR'

export const setUserBioSuccess = content => {
  return {
    type: SET_USER_BIO_SUCCESS,
    setUserBioSucceed: content
  }
}

export const setUserBioError = bool => {
  return {
    type: SET_USER_BIO_ERROR,
    hasErrored: bool
  }
}

export const setUserBio = data => {
  return dispatch => {
    const url = 'http://localhost:3000/api/edit/bio'

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
        dispatch(setUserBioError(true))
      }
      else {
        dispatch(setUserBioSuccess(res.public_infos))
      }
    })
    .catch((error) => {
      dispatch(setUserBioError(false))
    })
  }
}

export const SET_USER_GENDER_SUCCESS = 'SET_USER_GENDER_SUCCESS'
export const SET_USER_GENDER_ERROR = 'SET_USER_GENDER_ERROR'

export const setUserGenderSuccess = content => {
  return {
    type: SET_USER_GENDER_SUCCESS,
    setUserGenderSucceed: content
  }
}

export const setUserGenderError = bool => {
  return {
    type: SET_USER_GENDER_ERROR,
    hasErrored: bool
  }
}

export const setUserGender = data => {
  return dispatch => {
    const url = 'http://localhost:3000/api/edit/gender'

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
        dispatch(setUsergGenderError(true))
      }
      else {
        dispatch(setUserGenderSuccess(res.public_infos))
      }
    })
    .catch((error) => {
      dispatch(setUserGenderError(false))
    })
  }
}

export const SET_USER_ORIENTATION_SUCCESS = 'SET_USER_ORIENTATION_SUCCESS'
export const SET_USER_ORIENTATION_ERROR = 'SET_USER_ORIENTATION_ERROR'

export const setUserOrientationSuccess = content => {
  return {
    type: SET_USER_ORIENTATION_SUCCESS,
    setUserOrientationSucceed: content
  }
}

export const setUserOrientationError = bool => {
  return {
    type: SET_USER_ORIENTATION_ERROR,
    hasErrored: bool
  }
}

export const setUserOrientation = data => {
  return dispatch => {
    const url = 'http://localhost:3000/api/edit/orientation'

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
        dispatch(setUsergOrientationError(true))
      }
      else {
        dispatch(setUserOrientationSuccess(res.public_infos))
      }
    })
    .catch((error) => {
      dispatch(setUserOrientationError(false))
    })
  }
}

export const UPDATE_USER_INTERESTS_SUCCESS = 'UPDATE_USER_INTERESTS_SUCCESS'
export const UPDATE_USER_INTERESTS_ERROR = 'UPDATE_USER_INTERESTS_ERROR'

export const updateUserInterestsSuccess = content => {
  return {
    type: UPDATE_USER_INTERESTS_SUCCESS,
    updateUserInterestsSucceed: content
  }
}

export const updateUserInterestsError = bool => {
  return {
    type: UPDATE_USER_INTERESTS_ERROR,
    hasErrored: bool
  }
}

export const updateUserInterests = data => {
  return dispatch => {
    const url = 'http://localhost:3000/api/edit/interests'

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
        dispatch(updateUserInterestsError(true))
      }
      else {
        dispatch(updateUserInterestsSuccess(res.public_infos))
      }
    })
    .catch((error) => {
      dispatch(updateUserInterestsError(false))
    })
  }
}

export const SET_USER_BDATE_SUCCESS = 'SET_USER_BDATE_SUCCESS'
export const SET_USER_BDATE_ERROR = 'SET_USER_BDATE_ERROR'

export const setUserBdateSuccess = content => {
  return {
    type: SET_USER_BDATE_SUCCESS,
    setUserBdateSucceed: content
  }
}

export const setUserBdateError = bool => {
  return {
    type: SET_USER_BDATE_ERROR,
    hasErrored: bool
  }
}

export const setUserBirthdate = data => {
  return dispatch => {
    const url = 'http://localhost:3000/api/edit/birthdate'

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
        dispatch(setUserBdateError(true))
      }
      else {
        dispatch(setUserBdateSuccess(res.public_infos))
      }
    })
    .catch((error) => {
      dispatch(setUserBdateError(false))
    })
  }
}

export const SEARCH_LOCATION_SUCCESS = 'SEARCH_LOCATION_SUCCESS'
export const SEARCH_LOCATION_ERROR = 'SEARCH_LOCATION_ERROR'

export const searchLocationSuccess = content => {
  return {
    type: SEARCH_LOCATION_SUCCESS,
    searchLocationSucceed: content
  }
}

export const searchLocationError = bool => {
  return {
    type: SEARCH_LOCATION_ERROR,
    hasErrored: bool
  }
}

export const getUserLocation = data => {
  return dispatch => {
    const url = 'http://localhost:3000/api/search/location'

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
        dispatch(searchLocationError(true))
      }
      else {
        dispatch(searchLocationSuccess(res.public_infos))
      }
    })
    .catch((error) => {
      dispatch(searchLocationError(false))
    })
  }
}