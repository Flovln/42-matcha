'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { registerFetchData, setRegisterActionsToDefault } from '../../actions/index'

const FormErrors = ({formErrors}) => (
  <div>
    {Object.keys(formErrors).map((key, i) => {
      if (formErrors[key].length > 0){
        return (
          <p key={i}>{key} {formErrors[key]}</p>
        )
      } else {
        return ''
      }
    })}
  </div>
)

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

class Register extends Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmation: '',
      formErrors: {confirmation: ''},
      formValid: false,
      passwordValid: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  
  validateForm() {
    this.setState({formValid: this.state.passwordValid})
  }

  validateField(name, value) {
    let fieldValidationErrors = this.state.formErrors
    let passwordValid = this.state.passwordValid
    
    const {
      username,
      first_name,
      last_name,
      email,
      password,
      confirmation
    } = this.state

    if (password === confirmation) {
      passwordValid = true
      fieldValidationErrors.confirmation = passwordValid ? '' : ' please confirm your password'
    }
    this.setState({formErrors: fieldValidationErrors,
                    passwordValid: passwordValid}, this.validateForm)
  }

  errorClass(error) {
   return(error.length === 0 ? '' : 'has-error');
  }

  handleChange(e) {
    e.preventDefault()
    const state = this.state
    const {name, value} = e.target

    state[name] = value
    this.setState(state, () => {this.validateField(name, value)})
  }

  handleSubmit(e) {
    e.preventDefault()

    const {
      username,
      first_name,
      last_name,
      email,
      password,
      confirmation
    } = this.state

    this.props.onTodoSubmit(this.state);
  }

  componentDidMount() {
    this.props.setActionsToDefault()
  }

  render() {    
    let alert = null
      
    if (this.props.hasErrored) {
      alert = <RenderErrorAlert message={this.props.hasErrored} />
    }

    if (this.props.registerSucceed) {
      alert = <RenderSuccessAlert message={this.props.registerSucceed} />
    }

    return (
      <div>
        <div className="container-fluid col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-4 register-form">
          <h3>Join matcha!</h3>
          The best way to meet new people around you.
          { alert }
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="username" className="form-control" id="username" placeholder="Pick a username" name="username" onChange={this.handleChange}></input>
            </div>
            <div className="form-group">
              <label htmlFor="first-name">First Name</label>
              <input type="first-name" className="form-control" id="first-name" placeholder="First name" name="first_name" onChange={this.handleChange}></input>
            </div>
            <div className="form-group">
              <label htmlFor="last-name">Last Name</label>
              <input type="last-name" className="form-control" id="last-name" placeholder="Last name" name="last_name" onChange={this.handleChange}></input>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" className="form-control" id="email" aria-describedby="email" placeholder="you@exemple.com" name="email" onChange={this.handleChange}></input>
              <small id="email" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" placeholder="Create a password" name="password" onChange={this.handleChange}></input>
              <small id="password" className="form-text text-muted">Use at least on letter, one numeral, and seven characters.</small>
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm password</label>
              <input type="password" className="form-control" id="confirm-password" placeholder="Confirm your password" name="confirmation" onChange={this.handleChange}></input>
            </div>
            <button type="submit" className="btn btn-primary col-md-12" disabled={!this.state.formValid}>Sign up for Matcha</button>
          </form>         
        </div>
      </div>
    )
  }
}

Register.defaultProps = {
  hasErrored: '',
  registerSucceed: ''
}

Register.propTypes = {
  onTodoSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasErrored: PropTypes.string.isRequired,
  registerSucceed: PropTypes.string.isRequired
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.registering.registerLoading,
    hasErrored: state.registering.registerError,
    registerSucceed: state.registering.registerSucceed
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoSubmit: data => dispatch(registerFetchData(data)),
    setActionsToDefault: () => dispatch(setRegisterActionsToDefault())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)