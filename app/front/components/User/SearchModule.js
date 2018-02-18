'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactBootstrapSlider from 'react-bootstrap-slider'
import { Typeahead } from 'react-bootstrap-typeahead'
import moment from 'moment'

import {  getTagsPool,
          loadSearchUsers } from '../../actions/index'

const AgeFilterSearch = props => {
  return (
    <div className="filter-list-item">
      <div>
        <label className="text-color-red">Age</label>
      </div>
      <ReactBootstrapSlider
        slideStop={props.onChange}
        max={100}
        min={18}
        orientation="horizontal"
        step={1}
        value={[props.pos[0], props.pos[1]]}
      />
    </div>
  )
}

const PopularityFilterSearch = props => {
  return (
    <div className="filter-list-item">
      <div>
        <label className="text-color-red">Popularity</label>
      </div>
      <ReactBootstrapSlider
        slideStop={props.onChange}
        max={2500}
        min={1}
        orientation="horizontal"
        step={1}
        value={[props.pos[0], props.pos[1]]}
      />
    </div>
  )
}

class SearchModule extends Component {
  constructor(props) {
    super(props)

    this.state = {
      age: [18, 100],
      popularity: [1, 2500],
      location: 0,
      interests: []
    }

    this.onClickSearch = this.onClickSearch.bind(this)
    this.onClickRefresh = this.onClickRefresh.bind(this)
    this.onChangeAge = this.onChangeAge.bind(this)
    this.onChangePopularity = this.onChangePopularity.bind(this)
    this.onChangeLocation = this.onChangeLocation.bind(this)
    this.onChangeInterests = this.onChangeInterests.bind(this)
  }

  componentWillMount() {
    this.props.loadInterestsList()
  }

  onChangeAge(e) {
    const state = this.state
    const { value } = e.target
    const name = 'age'

    state[name] = value
    this.setState(state)
  }

  onChangePopularity(e) {
    const state = this.state
    const { value } = e.target
    const name = 'popularity'

    state[name] = value
    this.setState(state)
  }

  onChangeLocation(e) {
    const state = this.state
    const { value } = e.target
    const name = 'location'

    state[name] = value
    this.setState(state)
  }

  onChangeInterests(tags) {
    const state = this.state
    const name = 'interests'

    state[name] = tags
    this.setState(state)
  }

  onClickRefresh() {
    this.props.searchUsers([], [], 0, [])
  }

  onClickSearch() {
    const { age, popularity, location, interests } = this.state

    if (location > 0 || age[0] > 17 || age[1] < 100 || popularity[0] > 1 || popularity[1] < 2500 || interests.length > 0) {
      this.props.searchUsers(age, popularity, location, interests)
    }
  }

  render() {
    return(
      <div className="col-md-12 search-users">
        <label className="text-order-filter">Search</label>
        <AgeFilterSearch
          pos={this.state.age}
          onChange={this.onChangeAge}
        />
        <PopularityFilterSearch
          pos={this.state.popularity}
          onChange={this.onChangePopularity}
        />
      <div className="filter-list-item">
        <div>
          <label className="text-color-red">Location</label>
        </div>
        <ReactBootstrapSlider
          slideStop={this.onChangeLocation}
          max={100}
          min={0}
          orientation="horizontal"
          step={1}
          value={this.state.location}
        />
      </div>
        <form name="interests" >
          <div>
            <label className="text-color-red">Interests</label>
            <Typeahead
              allowNew
              clearButton
              labelKey="tag"
              onChange={this.onChangeInterests}
              multiple
              options={this.props.tagsPool}
            />
          </div>
        </form>
        <div className="btn-group-vertical col-md-12 search-users-buttons" role="group">
          <button type="submit" className="btn btn-default col-md-12" onClick={this.onClickSearch}><span className="glyphicon glyphicon-search"/> Search</button>
          <button type="submit" className="btn btn-default col-md-12" onClick={this.onClickRefresh}><span className="glyphicon glyphicon-refresh"/> Clear</button>
        </div>
      </div>
    )
  }
}

SearchModule.defaultProps = {
  userInfos: {}
}

SearchModule.propTypes = {
  userInfos: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    userInfos: state.userInfos.infosSuccess,
    tagsPool: state.tagsPool.loadPoolSucceed,
    usersSearched: state.userInfos.usersSearchListSuccess
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadInterestsList: () => dispatch(getTagsPool()),
    searchUsers: (age, popularity, location, interests) => dispatch(loadSearchUsers(age, popularity, location, interests))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchModule)