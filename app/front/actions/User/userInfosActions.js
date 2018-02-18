'use strict'

/* Get recommendation list of all users registered matching current user profile (location, gender, orientation, interests, popularity) */
export const MATCHING_USERS_LIST_SUCCESS = 'MATCHING_USERS_LIST_SUCCESS'
export const MATCHING_USERS_LIST_ERROR = 'MATCHING_USERS_LIST_ERROR'

export const loadMatchingUsersSuccess = content => {
  return {
    type: MATCHING_USERS_LIST_SUCCESS,
    getSucceed: content
  }
}

export const loadMatchingUsersError = content => {
  return {
    type: MATCHING_USERS_LIST_ERROR,
    hasErrored: content
  }
}

export const loadMatchingUsers = () => {
  return dispatch => {
    const url = 'http://localhost:3000/api/recommend/users/list'

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
        dispatch(loadMatchingUsersError(res.error))
      } else {
        dispatch(loadMatchingUsersSuccess(res.users))
      }
    })
    .catch((error) => dispatch(loadMatchingUsersError(error)))
  }
}

/* Get list of all users registered matching user search */
export const SEARCH_USERS_LIST_SUCCESS = 'SEARCH_USERS_LIST_SUCCESS'
export const SEARCH_USERS_LIST_ERROR = 'SEARCH_USERS_LIST_ERROR'

export const loadSearchUsersSuccess = content => {
  return {
    type: SEARCH_USERS_LIST_SUCCESS,
    getSucceed: content
  }
}

export const loadSearchUsersError = content => {
  return {
    type: SEARCH_USERS_LIST_ERROR,
    hasErrored: content
  }
}

export const loadSearchUsers = (age, popularity, location, interests) => {
  return dispatch => {
    const url = 'http://localhost:3000/api/search/users/list'

    const data = {
      age: age,
      popularity: popularity,
      location: location,
      interests: interests
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
      if (res.error) {
        dispatch(loadSearchUsersError(res.error))
      } else {
        dispatch(loadSearchUsersSuccess(res.users))
      }
    })
    .catch((error) => dispatch(loadSearchUsersError(error)))
  }
}

/* Get current user session informations */
export const PUBLIC_INFOS_SUCCESS = 'PUBLIC_INFOS_SUCCESS'
export const PUBLIC_INFOS_ERROR = 'PUBLIC_INFOS_ERROR'
export const PUBLIC_INFOS_LOADING = 'PUBLIC_INFOS_LOADING'

export const getInformationsIsLoading = bool => {
  return {
    type: PUBLIC_INFOS_LOADING,
    isLoading: bool
  }
}

export const getInformationsSuccess = content => {
  return {
    type: PUBLIC_INFOS_SUCCESS,
    getSucceed: content
  }
}

export const getInformationsError = content => {
  return {
    type: PUBLIC_INFOS_ERROR,
    hasErrored: content
  }
}

export const loadUserPublicInfos = () => {
  return dispatch => {
    const url = 'http://localhost:3000/api/user/profile'

    dispatch(getInformationsIsLoading(true))

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
        dispatch(getInformationsError(res.error))
      } else {
        dispatch(getInformationsSuccess(res.public_infos))
      }
    })
    .catch((error) => dispatch(getInformationsError(error)))
  }
}

/* Get current session user private informations (matches, likes, user blocked) */
export const PRIVATE_INFOS_SUCCESS = 'PRIVATE_INFOS_SUCCESS'
export const PRIVATE_INFOS_ERROR = 'PRIVATE_INFOS_ERROR'

export const getPrivateInformationsSuccess = content => {
  return {
    type: PRIVATE_INFOS_SUCCESS,
    getSucceed: content
  }
}

export const getPrivateInformationsError = content => {
  return {
    type: PRIVATE_INFOS_ERROR,
    hasErrored: content
  }
}

export const getPrivateInformations = () => {
  return dispatch => {
    const url = 'http://localhost:3000/api/user/private/'

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
        dispatch(getPrivateInformationsError(res.error))
      } else {
        dispatch(getPrivateInformationsSuccess(res.private_infos))
      }
    })
    .catch((error) => dispatch(getPrivateInformationsError(error)))
  }
}

/* Get public profile visited by current user */
export const VISITED_INFOS_SUCCESS = 'VISITED_INFOS_SUCCESS'
export const VISITED_INFOS_ERROR = 'VISITED_INFOS_ERROR'
export const VISITED_INFOS_LOADING = 'VISITED_INFOS_LOADING'

export const getUserVisitedInfosIsLoading = bool => {
  return {
    type: VISITED_INFOS_LOADING,
    isLoading: bool
  }
}

export const getUserVisitedInfosSuccess = content => {
  return {
    type: VISITED_INFOS_SUCCESS,
    getSucceed: content
  }
}

export const getUserVisitedInfosError = content => {
  return {
    type: VISITED_INFOS_ERROR,
    hasErrored: content
  }
}

export const loadUserVisitedPublicInfos = username => {
  return dispatch => {
    const url = 'http://localhost:3000/api/search/' + username

    dispatch(getUserVisitedInfosIsLoading(true))

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
        dispatch(getUserVisitedInfosError(res.error))
      } else {
        dispatch(getUserVisitedInfosSuccess(res.user_infos))
      }
    })
    .catch((error) => dispatch(getInformationsError(error)))
  }
}

/* Save users visiting public profile */
export const SAVE_GUEST_USER_SUCCESS = 'SAVE_GUEST_USER_SUCCESS'
export const SAVE_GUEST_USER_ERROR = 'SAVE_GUEST_USER_ERROR'

export const saveUserVisitingSuccess = content => {
  return {
    type: SAVE_GUEST_USER_SUCCESS,
    getSucceed: content
  }
}

export const saveUserVisitingError = content => {
  return {
    type: SAVE_GUEST_USER_ERROR,
    hasErrored: content
  }
}

export const saveUserVisitingProfile = username => {
  return dispatch => {
    const url = 'http://localhost:3000/api/user/view/' + username

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
        dispatch(saveUserVisitingError(res.error))
      } else {
        dispatch(saveUserVisitingSuccess(res.message))
      }
    })
    .catch((error) => dispatch(saveUserVisitingError(error)))
  }
}

/* Save user liked by current user session */
export const USER_LIKED_SUCCESS = 'USER_LIKED_SUCCESS'
export const USER_LIKED_ERROR = 'USER_LIKED_ERROR'

export const userLikedSuccess = content => {
  return {
    type: USER_LIKED_SUCCESS,
    getSucceed: content
  }
}

export const userLikedError = content => {
  return {
    type: USER_LIKED_ERROR,
    hasErrored: content
  }
}

export const saveUserLiked = username => {
  return dispatch => {
    const url = 'http://localhost:3000/api/user/like/' + username

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
        dispatch(userLikedError(res.error))
      } else {
        dispatch(userLikedSuccess(res.message))
      }
    })
    .catch((error) => dispatch(userLikedError(error)))
  }
}

export const UNLIKE_USER_SUCCESS = 'UNLIKE_USER_SUCCESS'
export const UNLIKE_USER_ERROR = 'UNLIKE_USER_ERROR'

export const unlikeUserSuccess = content => {
  return {
    type: UNLIKE_USER_SUCCESS,
    getSucceed: content
  }
}

export const unlikeUserError = content => {
  return {
    type: UNLIKE_USER_ERROR,
    hasErrored: content
  }
}

export const unlikeUser = username => {
  return dispatch => {
    const url = 'http://localhost:3000/api/user/unlike/' + username

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
        dispatch(unlikeUserError(res.error))
      } else {
        dispatch(unlikeUserSuccess(res.message))
      }
    })
    .catch((error) => dispatch(unlikeUserError(error)))
  }
}

/* Report user as fake count */
export const REPORT_USER_SUCCESS = 'REPORT_USER_SUCCESS'
export const REPORT_USER_ERROR = 'REPORT_USER_ERROR'

export const reportUserSuccess = content => {
  return {
    type: REPORT_USER_SUCCESS,
    getSucceed: content
  }
}

export const reportUserError = content => {
  return {
    type: REPORT_USER_ERROR,
    hasErrored: content
  }
}

export const reportUserAsFake = username => {
  return dispatch => {
    const url = 'http://localhost:3000/api/user/report/' + username

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
        dispatch(reportUserError(res.error))
      } else {
        dispatch(reportUserSuccess(res.message))
      }
    })
    .catch((error) => dispatch(reportUserError(error)))
  }
}

/* Block user profile visited */
export const BLOCK_USER_SUCCESS = 'BLOCK_USER_SUCCESS'
export const BLOCK_USER_ERROR = 'BLOCK_USER_ERROR'

export const blockUserSuccess = content => {
  return {
    type: BLOCK_USER_SUCCESS,
    getSucceed: content
  }
}

export const blockUserError = content => {
  return {
    type: BLOCK_USER_ERROR,
    hasErrored: content
  }
}

export const blockUser = username => {
  return dispatch => {
    const url = 'http://localhost:3000/api/user/block/' + username

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
        dispatch(blockUserError(res.error))
      } else {
        dispatch(blockUserSuccess(res.message))
      }
    })
    .catch((error) => dispatch(blockUserError(error)))
  }
}

export const UNBLOCK_USER_SUCCESS = 'UNBLOCK_USER_SUCCESS'
export const UNBLOCK_USER_ERROR = 'UNBLOCK_USER_ERROR'

export const unblockUserSuccess = content => {
  return {
    type: UNBLOCK_USER_SUCCESS,
    getSucceed: content
  }
}

export const unblockUserError = content => {
  return {
    type: UNBLOCK_USER_ERROR,
    hasErrored: content
  }
}

export const unblockUser = username => {
  return dispatch => {
    const url = 'http://localhost:3000/api/user/unblock/' + username

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
        dispatch(unblockUserError(res.error))
      } else {
        dispatch(unblockUserSuccess(res.message))
      }
    })
    .catch((error) => dispatch(unblockUserError(error)))
  }
}

export const SET_VIEWS_DEFAULT_SUCCESS = 'SET_VIEWS_DEFAULT_SUCCESS'
export const SET_VIEWS_DEFAULT_ERROR = 'SET_VIEWS_DEFAULT_ERROR'

export const setViewsToDefaultSuccess = bool => {
  return {
    type: SET_VIEWS_DEFAULT_SUCCESS,
    getSucceed: bool
  }
}

export const setViewsToDefaultError = bool => {
  return {
    type: SET_VIEWS_DEFAULT_ERROR,
    hasErrored: bool
  }
}

export const resetViewsNotificationsToDefault = () => {
  return dispatch => {
    const url = 'http://localhost:3000/api/user/views/default'

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
        dispatch(setViewsToDefaultError(true))
      } else {
        dispatch(setViewsToDefaultSuccess(true))
      }
    })
    .catch((error) => dispatch(setViewsToDefaultError(true)))
  }
}

export const SET_LIKES_DEFAULT_SUCCESS = 'SET_LIKES_DEFAULT_SUCCESS'
export const SET_LIKES_DEFAULT_ERROR = 'SET_LIKES_DEFAULT_ERROR'

export const setLikesToDefaultSuccess = bool => {
  return {
    type: SET_LIKES_DEFAULT_SUCCESS,
    getSucceed: bool
  }
}

export const setLikesToDefaultError = bool => {
  return {
    type: SET_LIKES_DEFAULT_ERROR,
    hasErrored: bool
  }
}

export const resetLikesNotificationsToDefault = () => {
  return dispatch => {
    const url = 'http://localhost:3000/api/user/likes/default'

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
        dispatch(setLikesToDefaultError(true))
      } else {
        dispatch(setLikesToDefaultSuccess(true))
      }
    })
    .catch((error) => dispatch(setLikesToDefaultError(true)))
  }
}

export const SET_UNLIKES_DEFAULT_SUCCESS = 'SET_UNLIKES_DEFAULT_SUCCESS'
export const SET_UNLIKES_DEFAULT_ERROR = 'SET_UNLIKES_DEFAULT_ERROR'

export const setUnlikesToDefaultSuccess = bool => {
  return {
    type: SET_UNLIKES_DEFAULT_SUCCESS,
    getSucceed: bool
  }
}

export const setUnlikesToDefaultError = bool => {
  return {
    type: SET_UNLIKES_DEFAULT_ERROR,
    hasErrored: bool
  }
}

export const resetUnlikesNotificationsToDefault = () => {
  return dispatch => {
    const url = 'http://localhost:3000/api/user/unlikes/default'

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
        dispatch(setUnlikesToDefaultError(true))
      } else {
        dispatch(setUnlikesToDefaultSuccess(true))
      }
    })
    .catch((error) => dispatch(setUnlikesToDefaultError(true)))
  }
}

export const SET_MATCHES_DEFAULT_SUCCESS = 'SET_MATCHES_DEFAULT_SUCCESS'
export const SET_MATCHES_DEFAULT_ERROR = 'SET_MATCHES_DEFAULT_ERROR'

export const setMatchesToDefaultSuccess = bool => {
  return {
    type: SET_MATCHES_DEFAULT_SUCCESS,
    getSucceed: bool
  }
}

export const setMatchesToDefaultError = bool => {
  return {
    type: SET_MATCHES_DEFAULT_ERROR,
    hasErrored: bool
  }
}

export const resetMatchesNotificationsToDefault = () => {
  return dispatch => {
    const url = 'http://localhost:3000/api/user/matches/default'

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
        dispatch(setMatchesToDefaultError(true))
      } else {
        dispatch(setMatchesToDefaultSuccess(true))
      }
    })
    .catch((error) => dispatch(setMatchesToDefaultError(true)))
  }
}


export const SET_MESSAGES_DEFAULT_SUCCESS = 'SET_MESSAGES_DEFAULT_SUCCESS'
export const SET_MESSAGES_DEFAULT_ERROR = 'SET_MESSAGES_DEFAULT_ERROR'

export const setMessagesToDefaultSuccess = bool => {
  return {
    type: SET_MESSAGES_DEFAULT_SUCCESS,
    getSucceed: bool
  }
}

export const setMessagesToDefaultError = bool => {
  return {
    type: SET_MESSAGES_DEFAULT_ERROR,
    hasErrored: bool
  }
}

export const resetMessagesNotificationsToDefault = () => {
  return dispatch => {
    const url = 'http://localhost:3000/api/user/messages/default'

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
        dispatch(setMessagesToDefaultError(true))
      } else {
        dispatch(setMessagesToDefaultSuccess(true))
      }
    })
    .catch((error) => dispatch(setMessagesToDefaultError(true)))
  }
}