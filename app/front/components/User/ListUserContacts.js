'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import moment from 'moment'
import lodash from 'lodash'

import { getPrivateInformations } from '../../actions/index'

class ListUserContacts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      unread: false
    }
  }
  
  componentWillMount() {
    this.props.getUserPrivateInfos()
  }

  render() {
    const threads = this.props.userPrivateInfos.threads
    const contacts = []
    let orderedContacts = []

    for (let key in threads) {
      const id = Math.random().toString(36).slice(2)
      /* Get time last message was sent*/
      const timeMsg = threads[key][threads[key].length -1].time
      /* convert time in milliseconds to minutes/hours/days */
      const dateTime = moment(timeMsg)
      const now = moment.now()
      const sentAt = dateTime.from(now)

      /* Get last message content - if > 20 characters truncate it */
      let lastMsg = null

      if (threads[key][threads[key].length -1].content.length > 25) {
        lastMsg = threads[key][threads[key].length -1].content.substring(0, 25).concat('...')
      } else {
        lastMsg = threads[key][threads[key].length -1].content
      }

      contacts.push({_id: id, contact: key, timeStamp: timeMsg, time: sentAt, content: lastMsg})
    }

    orderedContacts = lodash.orderBy(contacts, ['timeStamp'], ['desc'])

    return(
      <div className="notifications">
        <h3>Contacts</h3>
        <hr />
        <ul className="list-group col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">
          {
            orderedContacts.map(elem => {

              return (
                <div key={elem._id} className="list-group-item">
                  <Link to={`/message/${elem.contact}`} className="list-group-item">
                    <span className="glyphicon glyphicon-user text-color-red"/> { elem.contact } <span className="glyphicon glyphicon-envelope text-color-green"/> { elem.content } <span className="glyphicon glyphicon-time text-color-blue"/> { elem.time }
                  </Link>
                </div>
              )    
            })
          }
        </ul>
      </div>
    )
  }
}

ListUserContacts.defaultProps = {
  userPrivateInfos: {}
}

ListUserContacts.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ListUserContacts)