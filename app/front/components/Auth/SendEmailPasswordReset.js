'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'

import { sendResetEmail, setActionsToDefault } from '../../actions/index'

const RenderErrorAlert = props => {
  return (
    <div className="alert alert-danger" role="alert">
      <strong>{props.message}</strong>
    </div>
  )
}

const RenderSuccessAlert = props => {
  return (
    <div className="alert alert-success" role="alert">
      <strong>{props.message}</strong>
    </div>    
  )
}

class PasswordReset extends Component {
  constructor(props) {
    super(props)

    this.state = {'email' : ''}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    e.preventDefault()
    const state = this.state
    const {name, value} = e.target

    state[name] = value
    this.setState(state)
  }

  handleSubmit(e) {
    e.preventDefault()

    this.props.onSubmitSendEmail(this.state)
  }

  componentWillUnmount() {
    this.props.setToDefault(false)
  }

  render() {
    let alert = null

    if (this.props.messageError)
      alert = <RenderErrorAlert message={this.props.messageError} />

    if (this.props.messageSucceed)
      alert = <RenderSuccessAlert message={this.props.messageSucceed} />
      
    return (
      <div>
        <div className="container-fluid col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3 password-form" id="forgot-password-form" >
          <h3>Reset your password</h3>
          { alert }
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="reset-password">Enter your email address and we will send you a link to reset your password.</label>
              <input type="email" className="form-control" id="reset-password" name="email" onChange={this.handleChange} placeholder="Enter your email address"></input>
            </div>
            <button type="submit" className="btn btn-success">Send password reset email</button>
          </form>
        </div>
      </div>
    )
  }
}

PasswordReset.PropTypes = {
  messageSucceed: PropTypes.string.isRequired,
  messageError: PropTypes.string.isRequired,
  onSubmitSendEmail: PropTypes.func.isRequired,
  setToDefault: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    messageSucceed: state.resetPassword.sendSucceed,
    messageError: state.resetPassword.sendError
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmitSendEmail: data => dispatch(sendResetEmail(data)),
    setToDefault: bool => dispatch(setActionsToDefault(bool))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset)