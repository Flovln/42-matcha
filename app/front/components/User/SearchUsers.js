'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactBootstrapSlider from 'react-bootstrap-slider'
import { Typeahead } from 'react-bootstrap-typeahead'
import moment from 'moment'

import {  loadSearchUsers,
          getTagsPool
        } from '../../actions/index'

import config from '../../config/config'
import SearchModule from './SearchModule'

const OrderList = props => {
  return (
    <div className="col-md-12 order-list">
      <form onSubmit={props.onSubmit}>
        <div className="form-group">
          <label className="text-order-filter">Order by</label>
          <select className="form-control" name="ordered" onChange={props.onChange} value={props.order}>
            <option>Default</option>
            <option>Age</option>
            <option>Location</option>
            <option>Popularity</option>
            <option>Interests</option>
          </select>
        </div>
      </form>        
   </div>
  )
}

const AgeFilter = props => {
  return (
    <div className="filter-list-item">
      <div>
        <label className="text-color-red">Age</label>
      </div>
      <ReactBootstrapSlider
        change={props.onChange}
        max={100}
        min={18}
        orientation="horizontal"
        step={1}
        value={[props.pos[0], props.pos[1]]}
      />
    </div>
  )
}

const PopularityFilter = props => {
  return (
    <div className="filter-list-item">
      <div>
        <label className="text-color-red">Popularity</label>
      </div>
      <ReactBootstrapSlider
        change={props.onChange}
        max={2500}
        min={1}
        orientation="horizontal"
        step={1}
        value={[props.pos[0], props.pos[1]]}
      />
    </div>
  )
}

const FilterList = props => {
  return (
    <div className="col-md-12 filter-list">
      <label className="text-order-filter">Filter by</label>
      <AgeFilter onChange={props.onChangeAge} pos={props.posAge} />
      <PopularityFilter onChange={props.onChangePopularity} pos={props.posPop} />
      <div className="filter-list-item">
        <div>
          <label className="text-color-red">Location</label>
        </div>
        <ReactBootstrapSlider
          change={props.onChange}
          max={100}
          min={0}
          orientation="horizontal"
          step={1}
          value={props.posLocation}
        />
      </div>
      <div>
        <form name="interests" >
          <label className="text-color-red">Interests</label>
          <Typeahead
            allowNew
            clearButton
            labelKey="tag"
            onChange={props.onInterestsChange}
            multiple
            options={props.tags}
          />
        </form>
      </div>
    </div>
  )
}

class SearchUsers extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: [],
      defaultOrder: [],
      ordered:'',
      age: [18, 100],
      popularity: [1, 2500],
      location: 0,
      interests: []
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.onFilterChange = this.onFilterChange.bind(this)
    this.onFilterChangeAge = this.onFilterChangeAge.bind(this)
    this.onFilterChangePopularity = this.onFilterChangePopularity.bind(this)
    this.onFilterChangeInterests = this.onFilterChangeInterests.bind(this)
    this.orderUsers = this.orderUsers.bind(this)
  }
  
  componentWillMount() {
    if (this.props.session == true) {
      this.props.loadInterestsList()
      this.setState({users: []})
    }
  }

  componentWillReceiveProps(nextProps) {
    const state = this.state

    state['users'] = nextProps.usersSearched
    state['defaultOrder'] = nextProps.usersSearched
    this.setState(state)
  }

  /* Filter sliders change handler Age */
  onFilterChangeAge(e) {
    const state = this.state
    const { value } = e.target
    const name = 'age'

    state[name] = value
    this.setState(state)
  }

  /* Filter sliders change handler Popularity */
  onFilterChangePopularity(e) {
    const state = this.state
    const { value } = e.target
    const name = 'popularity'

    state[name] = value
    this.setState(state)
  }

  /* Filter interests change handler */
  onFilterChangeInterests(tags) {
    const state = this.state
    const name = 'interests'

    state[name] = tags
    this.setState(state)
  }

  /* Filter sliders change handler */
  onFilterChange(e) {
    const state = this.state
    const { value } = e.target
    const name = 'location'

    state[name] = value
    this.setState(state)
  }

  /* Order list change handler */
  handleOnChange(e) {
    e.preventDefault()
    const state = this.state
    const { name, value} = e.target

    state[name] = value
    this.setState(state)
  }

  orderUsers() {
    let users = this.state.users
    const defaultOrder = this.state.defaultOrder
    const ordered = this.state.ordered

    switch(ordered) {
      case 'Age':
        users.sort((a, b) => {
          if (a.birthday < b.birthday)
            return 1
          else
            return -1
        })
        break;

      case 'Location':
        users.sort((a, b) => {
          if (a.locationIndex < b.locationIndex)
            return -1
          else
            return 1
        })
        break;

      case 'Popularity':
        users.sort((a, b) => {
          if (a.popularity < b.popularity)
            return 1
          else
            return -1
        })
        break;

      case 'Interests':
        users.sort((a, b) => {
          if (a.commonInterests < b.commonInterests)
            return 1
          else
            return -1
        })
        break;

      default:
        users.sort((a, b) => {
          if (a.birthday < b.birthday)
            return 1
          else
            return -1
        })
        break;
    }
  }

  render() {
    this.orderUsers()

    const users = this.state.users
    let filtered = []

    const ageMin = this.state.age[0]
    const ageMax = this.state.age[1]
    const popularityMin = this.state.popularity[0]
    const popularityMax = this.state.popularity[1]
    const distanceMax = this.state.location
    const interests = this.state.interests

    filtered = users.filter((user) => {
      const age = moment().diff(user.birthday, 'years')
      if (age >= ageMin && age <= ageMax) {
        return true
      }
    })

    if (popularityMin > 1 || popularityMax < 2500) {
      filtered = filtered.filter((user) => {
        if (user.popularity >= popularityMin && user.popularity <= popularityMax) {
          return true
        }
      })
    }

    if (distanceMax > 0) {
      filtered = filtered.filter((user) => {
        if (user.distance <= distanceMax) {
          return true
        }
      })
    }

    if (interests.length > 0) {
      let score = 0

      filtered = filtered.filter((user) => {
        interests.forEach((interest) => {
          if (user.interests.indexOf(interest.tag) !== -1) {
            score += 1
          }
        })

        if (score > 0) {
          score = 0
          return true          
        }
      })
    }

    return(
      <div className="user-feed">
        <h3>Discover who is around you.</h3>
        <hr />
        <div className="col-md-3">
          <SearchModule />
          <OrderList
            onChange={this.handleOnChange}
            onSubmit={this.handleSubmit}
          />
          <FilterList
            onChange={this.onFilterChange}
            onChangeAge={this.onFilterChangeAge}
            onChangePopularity={this.onFilterChangePopularity}
            onInterestsChange={this.onFilterChangeInterests}
            tags={this.props.tagsPool}
            posAge={this.state.age}
            posPop={this.state.popularity}
            posLocation={this.state.location}
          />
        </div>
        <div className="row col-md-9 feed-profiles-box">
          {
            filtered.map(elem => {

              let path = null
              let imgFullPath = null

              if (elem.pictures[0] && elem.pictures.length > 0) {
                if (elem.pictures[0].profile_pic === 1) {
                  path = elem.pictures[0].path
                } else {
                  path = 'assets/unknown.png'
                }
              } else {
                path = 'assets/unknown.png'
              }

              if (path) {
                imgFullPath = config.application_address+config.server.port+'/'+ path
              } else {
                imgFullPath = null
              }

              const imgPath = config.application_address+config.server.port+'/'+ path
              const imgStyle = {
                backgroundImage: 'url(' + imgFullPath + ')',
                backgroundSize: 'cover',
                height: '220px',
                width: '210px',
                backgroundPosition: 'center'
              }

              return (
                <div key={elem._id} className="col-xs-6 col-sm-3 col-md-3 col-lg-3">
                  <Link to={`/user/${elem.username}`}>
                    <div className="thumbnail img-responsive" style={imgStyle}>
                      <div className="caption feed-search-username-thumbnail">
                        <span className="glyphicon glyphicon-user text-color-white"/> <label className="text-color-white"> {elem.username}</label>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })          
          }
        </div>
      </div>
    )
  }
}

SearchUsers.defaultProps = {
  userInfos: {}
}

SearchUsers.propTypes = {
  userInfos: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    session: state.loginUser.session,
    userInfos: state.userInfos.infosSuccess,
    tagsPool: state.tagsPool.loadPoolSucceed,
    usersSearched: state.userInfos.usersSearchListSuccess
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadInterestsList: () => dispatch(getTagsPool())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchUsers)