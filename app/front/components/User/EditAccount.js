'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'

import { updateEmail } from '../../actions/index'

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

class EditAccount extends Component {
  constructor(props) {
    super(props)

    this.state = {
      'email': ''
    }
    
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.emailSucceed !== this.state.emailSucceed) {
      this.state.emailSucceed = true
    } else if (nextProps.emailError !== this.state.emailError) {
      this.state.emailError = true
    }
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
    const history = this.props.history

    if (this.state.email) {
      this.props.onTodoSubmit(this.state, history)
    }
  }
  
  render() {
    let alert = null

    if (this.state.emailSucceed === true) {
      alert = <RenderSuccessAlert message={'Your email has been successfully updated.'} />
    }

    if (this.state.emailError === true) {
      alert = <RenderErrorAlert message={'We were not able to update your email, please make sure it is valid.'} />
    }

    return(
      <div className="container-fluid" className="col-md-4 col-md-offset-4">
        <h4>Edit your account settings</h4>
        { alert }
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Change email address</label>
              <input type="email" className="form-control" id="email" name="email" placeholder="you@example.com" onChange={this.handleChange}></input>
          </div>
          <button type="submit" className="btn btn-primary col-md-12">Update</button>
        </form>         
      </div>
    )
  }
}

EditAccount.defaultProps = {
  email: '',
}

EditAccount.propTypes = {
  emailSucceed: PropTypes.bool.isRequired,
  emailError: PropTypes.bool.isRequired,
  onTodoSubmit: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    emailSucceed: state.editAccount.updateEmailSucceed,
    emailError: state.editAccount.updateEmailError
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTodoSubmit: (data, history) => dispatch(updateEmail(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAccount)