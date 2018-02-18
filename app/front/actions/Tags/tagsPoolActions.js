'use strict'

export const GET_TAGS_POOL_SUCCESS = 'GET_TAGS_POOL_SUCCESS'
export const GET_TAGS_POOL_ERROR = 'GET_TAGS_POOL_ERROR'
export const GET_TAGS_POOL_LOADING = 'GET_TAGS_POOL_LOADING'

export const getTagsPoolIsLoading = bool => {
  return {
    type: GET_TAGS_POOL_LOADING,
    isLoading: bool
  }
}

export const getTagsPoolSuccess = content => {
  return {
    type: GET_TAGS_POOL_SUCCESS,
    getTagsPoolSucceed: content
  }
}

export const getTagsPoolError = bool => {
  return {
    type: GET_TAGS_POOL_ERROR,
    hasErrored: bool
  }
}

export const getTagsPool = () => {
  return dispatch => {
    const url = 'http://localhost:3000/api/tags'

    dispatch(getTagsPoolIsLoading(true))

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
      if (res.error){
        dispatch(getTagsPoolError(true))
      }
      else {
        dispatch(getTagsPoolSuccess(res.tags_pool))
      }
    })
    .catch((error) => {
      dispatch(getTagsPoolError(false))
    })
  }
}