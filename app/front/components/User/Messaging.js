'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import moment from 'moment'

import {  loadUserVisitedPublicInfos,
          getPrivateInformations,
          sendMessage } from '../../actions/index'

import socket from '../../helpers/sockets'

class Messaging extends Component {
  constructor(props) {
    super(props)

    this.state = {
      contact: '',
      message: ''
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
  }

  componentWillMount() {
    const receiver = this.props.match.params.login
    const current_user = this.props.userSessionActiveInfos.username

    this.props.getReceiverInfos(receiver)
    this.props.getUserSessionPrivateInfos()

    this.setState({contact: receiver})
  }

  componentDidMount() {
    /* Works as a connector / when component is mounted it saves in memory the event listenner as a continuous connection */
    socket.on('message', data => {
      this.props.getUserSessionPrivateInfos()
    })
  }

  handleOnChange(e) {
    e.preventDefault()
    const state = this.state
    const {name, value} = e.target

    state[name] = value
    this.setState(state)
  }

  handleOnSubmit(e) {
    e.preventDefault()
    const state = this.state
    const sender = this.props.userSessionActiveInfos.username
    const receiver = this.state.contact
    const message = this.state.message
    const regex = /\S/

    if (message && regex.test(message)) {
      this.props.sendMessage(sender, receiver, message)

      state['message'] = ''
      this.setState(state)
    }
  }

  render() {
    const threads = this.props.userSessionActivePrivateInfos.threads
    const matches = this.props.userSessionActivePrivateInfos.matches
    const blocked_by = this.props.userSessionActivePrivateInfos.blocked_by
    const contact = this.state.contact

    let unblockContact = true
    let thread = []
    let dateTime = ''
    let now = ''
    let sentAt = ''

    for (let key in threads) {
      if (key === contact) {
        thread = threads[key]
      }
    }

    if (matches !== undefined) {
      for (let i = 0; i < matches.length; i++) {
        if (contact === matches[i].username) {
          unblockContact = false
        }
      }
    }

    if (blocked_by !== undefined) {
      for (let i = 0; i < blocked_by.length; i++) {
        if (contact === blocked_by[i].username) {
          unblockContact = true
        }
      }      
    }

    /* If current user is blocked or unmatched disable send messages */
    const disabled = unblockContact ? {disabled: true} : undefined
    const currentUser = this.props.userSessionActiveInfos.username

    return(
      <div className="col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
        <h3>Conversation with <Link to={`/user/${contact}`} className="text-color-red">{ contact }</Link></h3>
        <div id="message-window">
          {
            thread.map(elem => {
              dateTime = moment(elem.time)
              now = moment.now()
              sentAt = dateTime.from(now)

              if (elem.sender === currentUser) {
                return (
                  <div key={elem._id} className="alert alert-info col-md-7 col-md-offset-5">
                    <span className="text-color-black">{elem.content}</span>
                    <br />
                    <div className="col-xs-offset-8 col-md-offset-9 text-color-brown">
                      Sent {sentAt}
                    </div>
                  </div>
                )
              } else {
                return (
                  <div key={elem._id} className="alert alert-warning col-md-7" >
                    <span className="text-color-black">{elem.content}</span>
                    <br />
                    <div className="col-xs-offset-8 col-md-offset-9 text-color-brown">
                      Sent {sentAt}
                    </div>
                  </div>
                )
              }
            })
          }
        </div>
        <form autoComplete="off" className="col-md-12" onSubmit={this.handleOnSubmit} id="message-input">
          <div className="input-group">
            <input className="form-control" name="message" onChange={this.handleOnChange} value={this.state.message} placeholder="Your message ..." {...disabled} />
            <span className="input-group-btn">
              <button className="btn btn-default" type="submit" {...disabled} >Send</button>
            </span>
          </div>
        </form>
      </div>
    )
  }
}

Messaging.defaultProps = {
  userSessionActiveInfos: {}
}

Messaging.propTypes = {
  userSessionActiveInfos: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    userSessionActivePrivateInfos: state.userInfos.privateInfosSuccess,
    userSessionActiveInfos: state.userInfos.infosSuccess
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getReceiverInfos: username => dispatch(loadUserVisitedPublicInfos(username)),
    getUserSessionPrivateInfos: () => dispatch(getPrivateInformations()),
    sendMessage: (sender, receiver, message) => dispatch(sendMessage(sender, receiver, message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messaging)