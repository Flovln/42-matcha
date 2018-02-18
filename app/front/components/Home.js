'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import RegisterForm from './Auth/RegisterForm'
import UserFeed from './User/UserFeed'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render() {    

    if (this.props.session) {
      return <UserFeed />
    } else {
      return <RegisterForm />
    }
  }
}

Home.PropTypes = {
  session: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => {
  return {
    session: state.loginUser.session
  }
}

export default connect(mapStateToProps, null)(Home)