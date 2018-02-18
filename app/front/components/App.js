'use strict'

import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {connect} from 'react-redux'

import Header from './Header'
import Routes from '../containers/routes'
import { loadUserPublicInfos } from '../actions/index'

const Footer = () => (
  <footer>
    <h2>footer</h2>
  </footer>
)

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    if (this.props.logged_in) {
      this.props.loadUserInfos()
    }
  }

  render() {
    return (
      <div>
        <Header />
        <Routes />
      </div>
    )
  }
}

Header.defaultProps = {
}

Header.propTypes = {
}

const mapStateToProps = state => {
  return {
    logoutSucceed: state.loginUser.logoutSucceed,
    logged_in: state.loginUser.session,
    userInfos: state.userInfos.infosSuccess
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadUserInfos: () => dispatch(loadUserPublicInfos())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))