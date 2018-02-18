'use strict'

const INITIAL_STATE = { poolLoading: false,
                        poolError: '',
                        loadPoolSucceed: [],
                      }

const tagsPool = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_TAGS_POOL_LOADING':
      return {...state, poolLoading: action.isLoading }
    case 'GET_TAGS_POOL_SUCCESS':
      return {...state, loadPoolSucceed: action.getTagsPoolSucceed }
    case 'GET_TAGS_POOL_ERROR':
      return {...state, poolError: action.hasErrored }

    default:
      return state
  }
}

export default tagsPool