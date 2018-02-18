'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'

import { newPasswordFetchData } from '../../actions/index'

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

class setNewPassword extends Component {
  constructor(props) {
    super(props)

    this.state = {
      'login': '',
      'token': '',
      'password': '',
      'confirmation': ''
    }

    const search = props.location.search
    const params = new URLSearchParams(search)
    this.state.login = params.get('login')
    this.state.token = params.get('token')

    this.handleChange = this.handleChange.bind(this)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
  }

  handleChange(e) {
    e.preventDefault()
    const state = this.state
    const { name, value } = e.target

    state[name] = value
    this.setState(state)
  }

  handleOnSubmit(e) {
    e.preventDefault()
    const state = this.state
    const { password, confirmation } = this.state

    this.props.onSubmitNewPassword(state)
  }
  
  render() {
    let alert = null

    if (this.props.newPasswordSucceed)
      alert = <RenderSuccessAlert message={this.props.newPasswordSucceed} />
    if (this.props.newPasswordError)
      alert = <RenderErrorAlert message={this.props.newPasswordError} />

    return (
      <div className="container-fluid col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-4 password-form" id="new-password-form">
        <h3>Set your new password</h3>
        { alert }
        <form onSubmit={this.handleOnSubmit}>
          <div className="form-group">
            <label htmlFor="password">New password</label>
            <input type="password" className="form-control" placeholder="Enter your new password" name="password" onChange={this.handleChange}></input>
          </div>
          <div className="form-group">
            <label htmlFor="password">Confirmation</label>
            <input type="password" className="form-control" placeholder="Confirm your new password" name="confirmation" onChange={this.handleChange}></input>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    newPasswordSucceed: state.resetPassword.updateSucceed,
    newPasswordError: state.resetPassword.updateError
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmitNewPassword: data => dispatch(newPasswordFetchData(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(setNewPassword)