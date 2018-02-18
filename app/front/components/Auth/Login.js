'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'

import { loginFetchData, setLoginActionsToDefault } from '../../actions/index'
import geolocation from '../../helpers/geolocation'

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

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      'username': '',
      'password': ''
    }

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

  handleGeolocation() {
    const history = this.props.history
    const { username, password } = this.state

    const data = {
      username: username,
      password: password,
      location: {
        lat: null,
        lng: null
      }
    }

    if ("geolocation" in navigator) {

      geolocation.getLocation()
        .then((pos) => {
          data.location.lat = pos.coords.latitude
          data.location.lng = pos.coords.longitude

          this.props.submitLoginInfos(data, history)
        })
        .catch((error) => {
          this.props.submitLoginInfos(data, history)
        })

    } else {
      alert('Geolocation service is not available on your computer.')
    }

  }

  handleSubmit(e) {
    e.preventDefault()
    const { username, password } = this.state

    if (username && password) {  
      this.handleGeolocation()
    }
  }

  componentWillUnmount() {
    this.props.setToDefault()
  }

  render() {
    let alert = null

    if (this.props.hasErrored) {
      alert = <RenderErrorAlert message={this.props.hasErrored} />
    } else if (this.props.session) {
      alert = <RenderSuccessAlert message={this.props.loginSucceed} />
    }

    return (
      <div>
        <div className="container-fluid col-xs-10 col-xs-offset-1  col-md-4 col-md-offset-4 login-form">
        <h3>Sign in to Matcha</h3>
        { alert }
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username or email address</label>
              <input type="username" className="form-control" id="username" name="username" onChange={this.handleChange}></input>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Link to='/password_reset'> Forget password?</Link>
            <input type="password" className="form-control" id="password" name="password" onChange={this.handleChange}></input>
          </div>
          <button type="submit" className="btn btn-success col-md-12">Sign in</button>
        </form>         
      </div>
    </div>
    )
  }
}

Login.defaultProps = {
  hasErrored: '',
  loginSucceed: ''
}

Login.propTypes = {
  submitLoginInfos: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasErrored: PropTypes.string.isRequired,
  loginSucceed: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    isLoading: state.loginUser.loginLoading,
    hasErrored: state.loginUser.loginError,
    loginSucceed: state.loginUser.loginSucceed,
    session: state.loginUser.session
  }
}

const mapDispatchToProps = dispatch => {
  return {
    submitLoginInfos: (data, history) => dispatch(loginFetchData(data, history)),
    setToDefault: () => dispatch(setLoginActionsToDefault()) //unvalid to remove
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)