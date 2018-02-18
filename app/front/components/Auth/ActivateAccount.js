'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'

import { activateAccount } from '../../actions/index'

class ActivateAccount extends Component {
  constructor(props) {
    super(props)

    const search = props.location.search
    const params = new URLSearchParams(search)

    this.state = {
      login: params.get('login'),
      token: params.get('token')
    }
  }
  
  componentWillMount() {
    const { login, token } = this.state

    this.props.activateAccount(login, token)
  }

  render() {
    return(
      <div className="col-md-offset-5">
        <h3>{ this.props.activateSucceed }</h3>
      </div>
    )
  }
}

ActivateAccount.defaultProps = {
  activateSucceed: '',
  activateError: ''
}

ActivateAccount.propTypes = {
  activateSucceed: PropTypes.string.isRequired,
  activateError: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    activateSucceed: state.registering.activateSucceed,
    activateError: state.registering.activateError
  }
}

const mapDispatchToProps = dispatch => {
  return {
    activateAccount: (login, token) => dispatch(activateAccount(login, token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivateAccount)