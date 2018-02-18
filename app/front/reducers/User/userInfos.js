'use strict'

const INITIAL_STATE = { infosLoading: false,
                        infosSuccess: {},
                        infosError: '',
                        usersMatchingListSuccess: [],
                        usersMatchingListError: '',
                        usersSearchListSuccess: [],
                        usersSearchListError: '',
                        userVisitedLoading: false,
                        userVisitedSuccess: {},
                        userVisitedError: '',
                        guestUserSuccess: '',
                        guestUserError: '',
                        userLikedSuccess: '',
                        userLikedError: '',
                        unlikeUserSuccess: '',
                        unlikeUserError: '',
                        reportUserSuccess: '',
                        reportUserError: '',
                        privateInfosSuccess: {},
                        privateInfosError: '',
                        setViewsDefaultSuccess: false,
                        setViewsDefaultError: false,
                        setLikesDefaultSuccess: false,
                        setLikesDefaultError: false,
                        setUnlikesDefaultSuccess: false,
                        setUnlikesDefaultError: false,
                        setMatchesDefaultSuccess: false,
                        setMatchesDefaultError: false,
                        setMessagesDefaultSuccess: false,
                        setMessagesDefaultError: false
                      }

const userInfos = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case 'PUBLIC_INFOS_LOADING':
      return { ...state, infosLoading: action.isLoading }
    case 'PUBLIC_INFOS_SUCCESS':
      return { ...state, infosSuccess: action.getSucceed }
    case 'PUBLIC_INFOS_ERROR':
      return { ...state, infosError: action.hasErrored }

    case 'MATCHING_USERS_LIST_SUCCESS':
      return { ...state, usersMatchingListSuccess: action.getSucceed }
    case 'MATCHING_USERS_LIST_ERROR':
      return { ...state, usersMatchingListError: action.hasErrored }

    case 'SEARCH_USERS_LIST_SUCCESS':
      return { ...state, usersSearchListSuccess: action.getSucceed }
    case 'SEARCH_USERS_LIST_ERROR':
      return { ...state, usersSearchListError: action.hasErrored }

    case 'VISITED_INFOS_LOADING':
      return { ...state, userVisitedLoading: action.isLoading }
    case 'VISITED_INFOS_SUCCESS':
      return { ...state, userVisitedSuccess: action.getSucceed }
    case 'VISITED_INFOS_ERROR':
      return { ...state, userVisitedError: action.hasErrored }

    case 'SAVE_GUEST_USER_SUCCESS':
      return { ...state, guestUserSuccess: action.getSucceed }
    case 'SAVE_GUEST_USER_ERROR':
      return { ...state, guestUserError: action.hasErrored }

    case 'USER_LIKED_SUCCESS':
      return { ...state, userLikedSuccess: action.getSucceed }
    case 'USER_LIKED_ERROR':
      return { ...state, userLikedError: action.hasErrored }

    case 'UNLIKE_USER_SUCCESS':
      return { ...state, unlikeUserSuccess: action.getSucceed }
    case 'UNLIKE_USER_ERROR':
      return { ...state, unlikeUserError: action.hasErrored }

    case 'REPORT_USER_SUCCESS':
      return { ...state, reportUserSuccess: action.getSucceed }
    case 'REPORT_USER_ERROR':
      return { ...state, reportUserError: action.hasErrored }

    case 'PRIVATE_INFOS_SUCCESS':
      return { ...state, privateInfosSuccess: action.getSucceed }
    case 'PRIVATE_INFOS_ERROR':
      return { ...state, privateInfosError: action.hasErrored }

    case 'SET_VIEWS_DEFAULT_SUCCESS':
      return { ...state, setViewsDefaultSuccess: action.getSucceed }
    case 'SET_VIEWS_DEFAULT_ERROR':
      return { ...state, setViewsDefaultError: action.hasErrored }

    case 'SET_LIKES_DEFAULT_SUCCESS':
      return { ...state, setLikesDefaultSuccess: action.getSucceed }
    case 'SET_LIKES_DEFAULT_ERROR':
      return { ...state, setLikesDefaultError: action.hasErrored }

    case 'SET_UNLIKES_DEFAULT_SUCCESS':
      return { ...state, setUnlikesDefaultSuccess: action.getSucceed }
    case 'SET_UNLIKES_DEFAULT_ERROR':
      return { ...state, setUnlikesDefaultError: action.hasErrored }

    case 'SET_MATCHES_DEFAULT_SUCCESS':
      return { ...state, setLikesDefaultSuccess: action.getSucceed }
    case 'SET_MATCHES_DEFAULT_ERROR':
      return { ...state, setLikesDefaultError: action.hasErrored }

    case 'SET_MESSAGES_DEFAULT_SUCCESS':
      return { ...state, setMessagesDefaultSuccess: action.getSucceed }
    case 'SET_MESSAGES_DEFAULT_ERROR':
      return { ...state, setMessagesDefaultError: action.hasErrored }

    default:
      return state
  }
}

export default userInfos