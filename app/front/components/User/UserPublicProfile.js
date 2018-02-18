'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'

import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import InfoBox from "react-google-maps/lib/components/addons/InfoBox"

import {  loadUserVisitedPublicInfos,
          getPrivateInformations,
          getVisitedPrivateInformations,
          saveUserLiked,
          unlikeUser,
          saveUserVisitingProfile,
          reportUserAsFake,
          blockUser,
          unblockUser } from '../../actions/index'

import config from '../../config/config'

const ReportModal = props => {
  return (
    <div>
      <button type="button" className="btn btn-default btn-lg btn-space" data-toggle="modal" data-target="#myModal">Report</button>
      <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">Report user</h4>
            </div>
            <div className="modal-body">
              This action will cause further investigations on the user being reported.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button className="btn btn-danger" name="report" onClick={props.onClick} type="button" >Report user</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const RenderProfileHeader = props => {

  let button_like = ''
  let button_block = ''
  let button_message = ''
  let button_report = ''
  let online = ''
  let popularity = props.userPublicInfos.popularity

  /* Check if user visited has block current user */
  const blocked_by = props.userCurrentPrivate.blocked_by
  let blocked = false

  for (let i = 0; i < blocked_by.length; i++) {
    if (blocked_by[i].username === props.userPublicInfos.username) {
      blocked = true
    }
  }

  /* If current user is blocked disable likes/messages */
  const disabled = blocked ? {disabled: true} : undefined

  const dateTime = moment(props.userPublicInfos.last_connection)
  const now = moment.now()
  const lastLog = dateTime.from(now)
  let imgStyle = {}
  let imgPath = null

  if (props.userPublicInfos.pictures[0] && props.userPublicInfos.pictures[0].profile_pic === 1) {
    imgPath = config.application_address+config.server.port+'/'+props.userPublicInfos.pictures[0].path
  } else {
    imgPath = config.application_address+config.server.port+'/'+'assets/unknown.png'
  }

  if (imgPath) {
    imgStyle = {
      backgroundImage: 'url(' + imgPath + ')',
      backgroundSize: 'cover',
      height: '180px',
      width: '180px',
      borderRadius: '50%',
      float: 'none',
      margin: 'auto',
      marginBottom: '30px',
      backgroundPosition: 'center'      
    }
  }

  if (props.username !== props.userPublicInfos.username) {
    if (props.userPublicInfos.pictures.length > 0 && props.userCurrent.pictures.length > 0) {
      if (props.liked === -1) {
        button_like = <button className="btn btn-default btn-md" name="like" onClick={props.onClick} {...disabled} >Like</button>
      } else {
        button_like = <button className="btn btn-danger btn-md active" name="unlike" onClick={props.onClick} >Unlike</button>
      }
    }

    if (props.blocked === -1) {
      button_block = <button type="button" className="btn btn-default btn-md" name="block" onClick={props.onClick} >Block</button>
    } else {
      button_block = <button type="button" className="btn btn-danger btn-md" name="unblock" onClick={props.onClick} ><span className="glyphicon glyphicon-remove"/> Unblock</button>      
    }

    if (!props.matched) {
      button_message = <button type="button" className="btn btn-default btn-md" name="message" onClick={props.onClick} {...disabled} >Message</button>
    }

    button_report = <button type="button" className="btn btn-default btn-md" name="report" onClick={props.onClick} type="button">Report</button>
  }

  if (props.userPublicInfos.online === true) {
    online = <span className="badge progress-bar-success">online</span>
  } else {
    online = 'Last visit '+lastLog+'.'
  }

  return (
    <div className="col-md-12 profile-header">
      <div className="col-md-12">
        <div style={imgStyle} ></div>
      </div>
      <div id="profile-login-public">
        <h3>{ props.userPublicInfos.username }</h3>
        { online }
        <br />
        <h4>{ popularity }</h4>
      </div>
        <div id="public-buttons">
          { button_like }
          { button_block }
          <Link to={`/message/${props.userPublicInfos.username}`} >{ button_message }</Link>
          { button_report }
        </div>
      <hr className="my-4"/>
    </div>
  )
}

const RenderProfileInformations = props => {
  let gender = ''
  let interests = []
  let address = ''

  if (props.informations && props.informations.gender === '0') {
    gender = 'Male'
  } else if (props.informations && props.informations.gender === '1') {
    gender = 'Female'
  } else {
    gender = 'undefined gender'
  }

  if (props.informations.interests && props.informations.interests.length > 0) {
    let i = 0

    props.informations.interests.map((elem) => {
      interests[i] = '#' + elem + ' '
      i++
    })
  }

  if (props.localisation && props.localisation.address) {
    address = props.localisation.address
  }

  return (
    <div className="col-md-10 col-md-offset-1" >
      <div id="profile-infos-public"> 
        <div className="jumbotron main-infos-public">
          <p className="lead">{props.informations.firstname} {props.informations.lastname}</p>
          { address }<br />
          <hr className="my-4"/>
          <p><span className="glyphicon glyphicon-gift"></span>{props.informations.birthday}<br /></p>
          <p>
            { gender }, {props.informations.orientation}<br />
          </p>
        </div>
        <div className="jumbotron">
          <p className="lead">About me:</p>
          <hr className="my-4"/>
          <p>{props.informations.bio}</p>
        </div>
        <div className="jumbotron">
          <p className="lead">Interests</p>
          <hr className="my-4"/>
          <p>{ interests }</p>
        </div>
      </div>
      <RenderImageGallery images={props.images} />
    </div>
  )
}

const RenderImageGallery = props => {
  return (
    <div className="col-md-12 jumbotron">
        <p className="lead">Pictures</p>
        <hr className="my-4"/>
        {
          props.images.map(elem => {
            if (!elem.profile_pic) {
              return (
                <div key={elem.id} >
                  <img 
                    className="col-md-3 thumbnail img-responsive"
                    src={config.application_address + config.server.port + '/' + elem.path}
                  />
                </div>
              ) 
            } else {
              return (
                <div key={elem.id} />
              ) 
            }
          })
        }
    </div>
  )
}

const RenderMap = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{ lat: props.localisation.lat, lng: props.localisation.lng }}
  >
    {props.isMarkerShown && <Marker position={{ lat: props.localisation.lat, lng: props.localisation.lng }} />}
  </GoogleMap>
))

const RenderAddressInformations = props => {
  let address = null
  let map = null

  if (props.localisation && props.localisation.address) {
    address = props.localisation.address
  }

  if (props.localisation !== undefined && props.localisation) {
    map = <RenderMap
            isMarkerShown
            googleMapURL={`"https://maps.googleapis.com/maps/api/js?key=`+config.googleMapKey+`&v=3.exp&libraries=geometry,drawing,places"`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `50%` }} />}
            localisation={props.localisation}
          />
  }

  return (
    <div className="col-md-3">
      { map }
    </div>
  )
}

class UserPublicProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      liked: -1, //if != -1 user liked, else if -1 user not like
      blocked: -1,
      matched: -1
    }

    this.isEmptyObject = this.isEmptyObject.bind(this)
    this.handleOnClicks = this.handleOnClicks.bind(this)
  }

  componentWillMount() {
    const username_visited = this.props.match.params.login
    const username_current = this.props.userSessionActiveInfos.username

    if (this.props.session === true) {
      this.props.getUserSessionPrivateInfos()
      this.props.getUserVisitedInfos(username_visited)

      if (username_current !== username_visited) {
        this.props.saveUserVisiting(username_visited)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const username = nextProps.match.params.login
    const state = this.state

    if (username !== this.props.match.params.login) {
      this.props.getUserVisitedInfos(username)
    }

    if (nextProps.userSessionActivePrivateInfos.likes &&
      nextProps.userSessionActivePrivateInfos.likes.length > 0 && this.state.liked === -1) {
      const users_liked = nextProps.userSessionActivePrivateInfos.likes
      const liked = users_liked.indexOf(username)

      state['liked'] = liked
      this.setState(state)
    }

    if (nextProps.userSessionActivePrivateInfos.blocked_users &&
      nextProps.userSessionActivePrivateInfos.blocked_users.length > 0) {
      const users_blocked = nextProps.userSessionActivePrivateInfos.blocked_users
      const blocked = users_blocked.indexOf(username)

      state['blocked'] = blocked
      this.setState(state)    
    }

    if (nextProps.userSessionActivePrivateInfos.matches &&
      nextProps.userSessionActivePrivateInfos.matches.length > 0) {
      const users_matched = nextProps.userSessionActivePrivateInfos.matches
      let matched = -1

      for (let key in users_matched) {
        if (users_matched[key].username === username) {
          matched = 0
          break;
        }
      }

      state['matched'] = matched
      this.setState(state)
    }
  }

  isEmptyObject(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key))
        return false
    }
    return true
  }

  handleOnClicks(e) {
    const event_name = e.target.name
    const state = this.state
    const user_visited = this.props.match.params.login

    if (event_name === 'like') {
      this.props.likeUser(user_visited)

      state['liked'] = 0
      this.setState(state)
    } else if (event_name == 'unlike') {
      state['liked'] = -1
      state['matched'] = -1
      this.setState(state)

      this.props.unlikeUser(user_visited)
    }  else if (event_name === 'report') {
      this.props.reportUser(user_visited)

    } else if (event_name === 'block') {

      state['blocked'] = 0
      this.setState(state)
      this.props.blockUser(user_visited)
    } else if (event_name === 'unblock') {

      state['blocked'] = -1
      this.setState(state)
      this.props.unblockUser(user_visited)      
    }
  }

  render() {
    let emptyObject = this.isEmptyObject(this.props.userPublicInfos)

    if (!emptyObject) {
      let public_header = null
      let images = null

      if (this.props.userPublicInfos && this.props.userPublicInfos.pictures !== undefined) {
        public_header = <RenderProfileHeader
                          userPublicInfos={this.props.userPublicInfos}
                          userCurrent={this.props.userSessionActiveInfos}
                          userCurrentPrivate={this.props.userSessionActivePrivateInfos}
                          username={this.props.userSessionActiveInfos.username}
                          onClick={this.handleOnClicks}
                          liked={this.state.liked}
                          blocked={this.state.blocked}
                          matched={this.state.matched}
                        />
        images = <RenderImageGallery images={this.props.userPublicInfos.pictures} />
      }

      return(
        <div className="container-fluid">
          { public_header }
          <RenderProfileInformations
            localisation={this.props.userPublicInfos.localisation}
            informations={this.props.userPublicInfos}
            images={this.props.userPublicInfos.pictures}
          />
        </div>
      )
    } else {
      return (
        <div className="col-md-offset-6 loader"></div>
      )
    }
  }
}

UserPublicProfile.defaultProps = {
  userPublicInfos: {},
  userSessionActiveInfos: {}
}

UserPublicProfile.propTypes = {
  session: PropTypes.bool.isRequired,
  userPublicInfos: PropTypes.object.isRequired,
  userSessionActiveInfos: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    session: state.loginUser.session,
    userPublicInfos: state.userInfos.userVisitedSuccess,
    userSessionActivePrivateInfos: state.userInfos.privateInfosSuccess,
    userSessionActiveInfos: state.userInfos.infosSuccess
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getUserVisitedInfos: username => dispatch(loadUserVisitedPublicInfos(username)),
    getUserSessionPrivateInfos: () => dispatch(getPrivateInformations()),
    saveUserVisiting: username => dispatch(saveUserVisitingProfile(username)),
    likeUser: username => dispatch(saveUserLiked(username)),
    unlikeUser: username => dispatch(unlikeUser(username)),
    reportUser: username => dispatch(reportUserAsFake(username)),
    blockUser: username => dispatch(blockUser(username)),
    unblockUser: username => dispatch(unblockUser(username))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPublicProfile)