'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import moment from 'moment'
import lodash from 'lodash'

import { getPrivateInformations } from '../../actions/index'

class ListUserMatches extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.getUserPrivateInfos()
  }

  componentWillReceiveProps() {
//    this.props.getUserPrivateInfos()
  }

  render() {
    const matches = this.props.userPrivateInfos.matches

    if (matches !== undefined) {
      let orderedMatches = []
      let dateTime = ''
      let now = ''
      let matchedAt = ''

      orderedMatches = lodash.orderBy(matches, ['time'], ['desc'])

      return(
        <div className="notifications">
          <h3>Your matches</h3>
          <hr />
          <ul className="list-group col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">
            {
              orderedMatches.map(elem => {
                dateTime = moment(elem.time)
                now = moment.now()
                matchedAt = dateTime.from(now)

                return (
                  <div key={elem._id} className="list-group-item">
                    <Link to={`/user/${elem.username}`} className="list-group-item"><span className="glyphicon glyphicon-user text-color-red"/> { elem.username } and you <span className="glyphicon glyphicon-time text-color-blue"/> matched { matchedAt }</Link>
                  </div>
                )    
              })
            }
          </ul>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

ListUserMatches.defaultProps = {
  userPrivateInfos: {}
}

ListUserMatches.propTypes = {
  userPrivateInfos: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    userPrivateInfos: state.userInfos.privateInfosSuccess
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getUserPrivateInfos: () => dispatch(getPrivateInformations()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListUserMatches)