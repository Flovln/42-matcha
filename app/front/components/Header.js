'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import {connect} from 'react-redux'

import { logoutFetchData,
          loadUserPublicInfos,
          resetViewsNotificationsToDefault,
          resetLikesNotificationsToDefault,
          resetUnlikesNotificationsToDefault,
          resetMatchesNotificationsToDefault,
          resetMessagesNotificationsToDefault
        } from '../actions/index'

import socket from '../helpers/sockets'

const LoggedInButtons = props => {
  let views = ''
  let likes = ''
  let unlikes = ''
  let matches = ''
  let messages = ''

  if (props.views) {
    views = <span className="badge progress-bar-warning">{props.views}</span>
  }

  if (props.matches) {
    matches = <span className="badge progress-bar-warning">{props.matches}</span>
  }

  if (props.likes) {
    likes = <span className="badge progress-bar-warning">{props.likes}</span>
  }

  if (props.unlikes) {
    unlikes = <span className="badge progress-bar-danger">{props.unlikes}</span>
  }

  if (props.messages) {
    messages = <span className="badge progress-bar-success">{props.messages}</span>
  }

  return (
    <div>
      <div className="navbar-header">
        <Link to="/"><h2 id="logo-color">Matcha</h2></Link>
      </div>
      <ul className="nav navbar-nav navbar-right">
        <li>
          <Link to="/visits" name="views" onClick={props.onClickNotifs}>Views {views}</Link>
        </li>
        <li>
          <Link to="/likes" name="likes" onClick={props.onClickNotifs}>Likes {likes} {unlikes}</Link>
        </li>
        <li>
          <Link to="/matches" name="matches" onClick={props.onClickNotifs}>Matches {matches}</Link>
        </li>
        <li>
          <Link to="/contacts" name="messages" onClick={props.onClickNotifs}>Messages {messages}</Link>
        </li>
        <li>
          <Link to="/search" /*onClick={props.onClickNotifs}*/><span className="glyphicon glyphicon-search"/> Search </Link>
        </li>
        <li className="dropdown">
          <a id="logo-color" href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{props.infos.username}<span className="caret"></span></a>
          <ul className="dropdown-menu">
            <li>
              <Link to={`/user/${props.infos.username}`}>Your profile</Link>
            </li>
            <li>
              <Link to="/profile">Edit profile</Link>
            </li>
            <li className="divider"></li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <Link to='/' onClick={props.action}>Sign out</Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

const LoggedOutButtons = () => {
  return (
    <div>
      <div className="navbar-header">
        <Link to="/"><h2 id="logo-color">Matcha</h2></Link>
      </div>
      <ul className="nav navbar-nav navbar-right">
        <li>
          <Link id="logo-color" to='/login'>Sign in</Link>
        </li>
        <li>
          <Link id="logo-color" to="/register">Sign up</Link>
        </li>
      </ul>
    </div>
  )
}

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      'login': '',
      'socketAuth': false,
      'previousUser': '',
      'notifications': {
        'views': 0,
        'likes': 0,
        'unlikes': 0,
        'matches': 0,
        'messages': 0
      }
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleOnClickNotifications = this.handleOnClickNotifications.bind(this)
  }

  handleClick(e) {
    e.preventDefault()
    const history = this.props.history

    this.props.onClickLogout(history)
  }

  initSocketAuth(username) {
    const state = this.state

    if (state.socketAuth === false) {
      socket.emit('auth', username)
      state['socketAuth'] = true

      this.setState(state)

      socket.on('view', data => { this.props.loadUserInfos() })
      socket.on('like', data => { this.props.loadUserInfos() })
      socket.on('unlike', data => { this.props.loadUserInfos() })
      socket.on('match', data => { this.props.loadUserInfos() })
      socket.on('messageNotif', data => { this.props.loadUserInfos() })
    }
  }

  componentWillMount() {
    if (this.props.logged_in) {
      this.props.loadUserInfos()
    }
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.logged_in !== this.props.logged_in) {
      if (nextProps.logged_in === true) {
        this.props.loadUserInfos()
      }
    }

    if (nextProps.logged_in === false) {
      const state = this.state

      state['socketAuth'] = false
      state['previousUser'] = nextProps.userInfos.username
      this.setState(state)
    }

    /* Emit auth event for socket connection + initialise event listenners */
    if (nextProps.userInfos && nextProps.userInfos.username !== undefined) {

      /* Make sure the next user connected is different than previous, to set new socket auth connection */
      if (this.state.previousUser !== nextProps.userInfos.username) {
        this.initSocketAuth(nextProps.userInfos.username)
      }
    }

    if (nextProps.userInfos && nextProps.userInfos.notifications) {
      if (nextProps.userInfos.notifications.views !== this.state.notifications.views) {
        const state = this.state

        state.notifications['views'] = nextProps.userInfos.notifications.views
        this.setState(state)        
      }

      if (nextProps.userInfos.notifications.likes !== this.state.notifications.likes) {
        const state = this.state

        state.notifications['likes'] = nextProps.userInfos.notifications.likes
        this.setState(state)        
      }

      if (nextProps.userInfos.notifications.unlikes !== this.state.notifications.unlikes) {
        const state = this.state

        state.notifications['unlikes'] = nextProps.userInfos.notifications.unlikes
        this.setState(state)        
      }

      if (nextProps.userInfos.notifications.matches !== this.state.notifications.matches) {
        const state = this.state

        state.notifications['matches'] = nextProps.userInfos.notifications.matches
        this.setState(state)        
      }

      if (nextProps.userInfos.notifications.messages !== this.state.notifications.messages) {
        const state = this.state

        state.notifications['messages'] = nextProps.userInfos.notifications.messages
        this.setState(state)        
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (true)
  }

  handleOnClickNotifications(e) {
    const name = e.target.name
    const state = this.state

    if (name === 'views' && this.state.notifications.views !== 0) {
      this.props.resetViews()

      state.notifications['views'] = 0
      this.setState(state)
      this.props.loadUserInfos()
    } else if (name === 'likes' && (this.state.notifications.likes !== 0 || this.state.notifications.unlikes !== 0)) {
      this.props.resetLikes()
      this.props.resetUnlikes()

      state.notifications['likes'] = 0
      state.notifications['unlikes'] = 0
      this.setState(state)
      this.props.loadUserInfos()
    } else if (name === 'matches' && this.state.notifications.matches !== 0) {
      this.props.resetMatches()
     
      state.notifications['matches'] = 0
      this.setState(state)
      this.props.loadUserInfos()
    } else if (name === 'messages' && this.state.notifications.messages !== 0) {
      this.props.resetMessages()

      state.notifications['messages'] = 0
      this.setState(state)
      this.props.loadUserInfos()
    }
  }

  render () {
    let buttons = null

    if (this.props.logged_in && this.props.userInfos.notifications) {
      buttons = <LoggedInButtons
                  action={this.handleClick}
                  infos={this.props.userInfos}
                  views={this.state.notifications.views}
                  likes={this.state.notifications.likes}
                  unlikes={this.state.notifications.unlikes}
                  matches={this.state.notifications.matches}
                  messages={this.state.notifications.messages}
                  onClickNotifs={this.handleOnClickNotifications}
                />
    } else {
      buttons = <LoggedOutButtons />
    }
 
    return (
      <header>
        <nav id="header-background" className="navbar navbar-inverse">
          <div className="container-fluid">
            { buttons }
          </div>
        </nav>
      </header>
    )
  }
}

Header.defaultProps = {
  userInfos: {}
}

Header.propTypes = {
  onClickLogout: PropTypes.func.isRequired,
  loadUserInfos: PropTypes.func.isRequired,
  logoutError: PropTypes.bool.isRequired,
  logoutSucceed: PropTypes.bool.isRequired,
  logged_in: PropTypes.bool.isRequired,
  userInfos: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    logoutError: state.loginUser.logoutError,
    logoutSucceed: state.loginUser.logoutSucceed,
    logged_in: state.loginUser.session,
    userInfos: state.userInfos.infosSuccess
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onClickLogout: history => dispatch(logoutFetchData(history)),
    loadUserInfos: () => dispatch(loadUserPublicInfos()),
    resetViews: () => dispatch(resetViewsNotificationsToDefault()),
    resetLikes: () => dispatch(resetLikesNotificationsToDefault()),
    resetUnlikes: () => dispatch(resetUnlikesNotificationsToDefault()),
    resetMatches: () => dispatch(resetMatchesNotificationsToDefault()),
    resetMessages: () => dispatch(resetMessagesNotificationsToDefault())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))