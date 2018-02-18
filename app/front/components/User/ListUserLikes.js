'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import moment from 'moment'
import lodash from 'lodash'

import { getPrivateInformations } from '../../actions/index'

class ListUserLikes extends Component {
  constructor(props) {
    super(props)
  }
  
  componentWillMount() {
    this.props.getUserPrivateInfos()
  }

  componentWillReceiveProps() {
  }

  render() {
    const liked_by = this.props.userPrivateInfos.liked_by

    if (liked_by !== undefined) {
      let orderedLikes = []
      let dateTime = ''
      let now = ''
      let likedAt = ''

      //instead of lodash sort can be use
      orderedLikes = lodash.orderBy(liked_by, ['time'], ['asc'])

      return(
        <div className="notifications">
          <h3>People who liked your profile</h3>
          <hr />
          <ul className="list-group col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">
            {
              orderedLikes.reverse().map(elem => {
                dateTime = moment(elem.time)
                now = moment.now()
                likedAt = dateTime.from(now)

                return (
                  <div key={elem._id} className="list-group-item">
                    <Link to={`/user/${elem.username}`} className="list-group-item"><span className="glyphicon glyphicon-user text-color-red"/> { elem.username } <span className="glyphicon glyphicon-time text-color-blue"/> liked you { likedAt }</Link>
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

ListUserLikes.defaultProps = {
  userPrivateInfos: {}
}

ListUserLikes.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ListUserLikes)