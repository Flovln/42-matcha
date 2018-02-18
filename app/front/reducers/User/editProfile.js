'use strict'

const INITIAL_STATE = { uploadError: false,
                        uploadSucceed: {},
                        removeError: false,
                        removeSucceed: {},
                        setProfilePicError: false,
                        setProfilePicSucceed: {},
                        setProfilePicIsLoading: false,
                        setNewNamesError: '',
                        setNewNamesSucceed: {},
                        setUserBioError: false,
                        setUserBioSucceed: {},
                        setUserGenderError: false,
                        setUserGenderSucceed: {},
                        setUserOrientationError: false,
                        setUserOrientationSucceed: {},
                        updateUserInterestsError: false,
                        updateUserInterestsSucceed: {},
                        setUserBirthdateError: false,
                        setUserBirthdateSucceed: {},
                        searchLocationError: false,
                        searchLocationSucceed: {}
                      }

const editProfile = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPLOAD_SUCCESS':
      return { ...state, uploadSucceed: action.uploadSucceed }
    case 'UPLOAD_ERROR':
      return { ...state, uploadHasErrored: action.hasErrored }

    case 'REMOVE_SUCCESS':
      return { ...state, removeSucceed: action.removeSucceed }
    case 'REMOVE_ERROR':
      return { ...state, removeHasErrored: action.hasErrored }

    case 'SET_NEW_NAMES_SUCCESS':
      return { ...state, setNewNamesSucceed: action.setNewNamesSucceed }
    case 'SET_NEW_NAMES_ERROR':
      return { ...state, setNewNamesHasErrored: action.hasErrored }

    case 'SET_USER_BIO_SUCCESS':
      return { ...state, setUserBioSucceed: action.setUserBioSucceed }
    case 'SET_USER_BIO_ERROR':
      return { ...state, setUserBioHasErrored: action.hasErrored }

    case 'SET_USER_GENDER_SUCCESS':
      return { ...state, setUserGenderSucceed: action.setUserGenderSucceed }
    case 'SET_USER_GENDER_ERROR':
      return { ...state, setUserGenderHasErrored: action.hasErrored }

    case 'SET_USER_ORIENTATION_SUCCESS':
      return { ...state, setUserOrientationSucceed: action.setUserOrientationSucceed }
    case 'SET_USER_ORIENTATION_ERROR':
      return { ...state, setUserOrientationHasErrored: action.hasErrored }

    case 'UPDATE_USER_INTERESTS_SUCCESS':
      return { ...state, updateUserInterestsSucceed: action.updateUserInterestsSucceed }
    case 'UPDATE_USER_INTERESTS_ERROR':
      return { ...state, updateUserInterestsHasErrored: action.hasErrored }

    case 'SET_USER_BDATE_SUCCESS':
      return { ...state, setUserBirthdateSucceed: action.setUserBdateSucceed }
    case 'SET_USER_BDATE_ERROR':
      return { ...state, setUserBirthdateHasErrored: action.hasErrored }

    case 'SEARCH_LOCATION_SUCCESS':
      return { ...state, searchLocationSucceed: action.searchLocationSucceed }
    case 'SEARCH_LOCATION_ERROR':
      return { ...state, searchLocationHasErrored: action.hasErrored }

    default:
      return state
  }
}

export default editProfile