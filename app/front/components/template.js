'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'

class Template extends Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    return(
      <div>
        <h3>Hello world</h3>
        {this.props.content}
      </div>
    )
  }
}

Template.defaultProps = {
}

Template.propTypes = {
}

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Template)