'use strict'

import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { asyncContainer, Typeahead } from 'react-bootstrap-typeahead'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import InfoBox from "react-google-maps/lib/components/addons/InfoBox"

import config from '../../config'

import {  uploadImage,
          loadUserPublicInfos,
          removeFromServer,
          setAsProfile,
          setNewUserNames,
          setUserBio,
          setUserGender,
          setUserOrientation,
          addUserInterest,
          getTagsPool,
          updateUserInterests,
          setUserBirthdate,
          getUserLocation } from '../../actions/index'

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

const RenderImageForm = props => {
  return (
    <form onSubmit={props.onSubmit} encType="multipart/form-data">
      <div className="form-group edit-upload-img-form">
        <label className="col-md-12">Select an image</label>
        <input type="file" name="file" className="form-control-file col-md-6" onChange={props.onChange} ></input>
        <input className='btn-xs btn-warning' type="submit" value="Upload"></input>
      </div>
    </form>
  )
}

const RenderImageGallery = props => {
  if (props.images && props.images.length) {
    return (
      <div>
        {
          props.images.map((elem) => {

            const imgPath = config.application_address+config.server.port+'/'+ elem.path

            if (elem.profile_pic === 1) {
  
              const profileImgStyle = {
                backgroundImage: 'url(' + imgPath + ')',
                backgroundSize: 'cover',
                height: '250px',
                width: '350px',
                backgroundPosition: 'center'
              }

              return (
                <div className="edit-profile-pic img-responsive" key={elem.id} >
                  <div
                    className="img-responsive" style={profileImgStyle}
                    data-toggle="modal"
                    data-target={'#' + elem.id}
                  >
                  </div>
                  <div className="modal fade" id={elem.id} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                          <h4 className="modal-title" id="myModalLabel">{elem.name}</h4>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            data-dismiss="modal"
                            onClick={props.onClickDeleteImage(elem.id)}
                          >Delete</button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            data-dismiss="modal"
                            /*onClick={props.onClickSetAsProfile(elem.id)}*/
                          >Define as profile picture</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            } else {
  
              const imgStyle = {
                backgroundImage: 'url(' + imgPath + ')',
                backgroundSize: 'cover',
                height: '120px',
                width: '120px',
                backgroundPosition: 'center'
              }

              return (
                <div className="edit-img-mosaic" key={elem.id} >
                  <div
                    className="img-responsive" style={imgStyle}
                    data-toggle="modal"
                    data-target={'#' + elem.id}
                  >
                  </div>
                  <div className="modal fade" id={elem.id} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                          <h4 className="modal-title" id="myModalLabel">{elem.name}</h4>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            data-dismiss="modal"
                            onClick={props.onClickDeleteImage(elem.id)}
                          >Delete</button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            data-dismiss="modal"
                            /*onClick={props.onClickSetAsProfile(elem.id)}*/
                          >Define as profile picture</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) 
            }
          })
        }
    </div>
    )
  } else {
    return (
      <div />
    )
  }
}

const RenderNamesForm = props => {
  return (
    <div className="col-md-12">
      <form onSubmit={props.onSubmit} >
        <div className="form-group">
          <label htmlFor="firstname"> First name: </label>
          <input type="text" className="form-control" id="firstname" name="firstname" onChange={props.onChange} value={props.firstname} ></input>
        </div>
        <div className="form-group">
          <label htmlFor="lastname"> Last name: </label>
          <input type="text" className="form-control" id="lastname" name="lastname" onChange={props.onChange} value={props.lastname} ></input>
        </div>
        <button type="submit" className="btn btn-warning">Edit</button>
      </form>
    </div>
  )
}

const RenderDatePicker = props => {
  return (
    <div>
    <form className="col-md-12" onSubmit={props.onSubmit}>
      <div className="form-group">
        <label htmlFor="birthdate">Select your birth date</label>
        <input className="form-control" type="date" onChange={props.onChange} value={props.birthdate} name="birthdate"/>
        <small className="form-text text-muted">You have to be 18 yeard old.</small>
      </div>
      <button type="submit" className="btn-xs btn-warning">Select</button>
    </form>
    </div>
  )
}

const RenderGenderForm = props => {
  return (
    <div className="radio col-md-4" >
      <h5>Gender</h5>
      <label className="radio-inline">
        <input type="radio" name="gender" id="radios1" value="0" onChange={props.onChange} checked={props.gender == '0'}></input>
        Male
      </label>
      <label className="radio-inline">
        <input type="radio" name="gender" id="radios2" value="1" onChange={props.onChange} checked={props.gender == '1'}></input>
        Female
      </label>
    </div>
  )
}

const RenderOrientationForm = props => {
  return (
    <div>
      <form className="col-md-8" onSubmit={props.onSubmit}>
        <div className="form-group">
          <label htmlFor="">Sexual orientation</label>
          <select className="form-control" name="orientation" onChange={props.onChange} value={props.orientation}>
            <option>Bisexual</option>
            <option>Heterosexual</option>
            <option>Homosexual</option>
          </select>
        </div>   
        <button type="submit" className="btn-xs btn-warning">Select</button>
      </form>
    </div>
  )
}

const RenderTypeHead = props => {
  return (
    <form name="form" onSubmit={props.onSubmit}>
      <div className="col-md-12" >
        <label htmlFor="">Interests</label>
        <Typeahead
          allowNew
          clearButton
          labelKey="tag"
          onChange={props.onChange}
          multiple
          options={props.tagsPool}
//          selected={props.interests}
        />
        <button type="submit" className="btn-xs btn-warning">Update</button>
      </div>
    </form>
  )
}

const RenderBioForm = props => {
  return (
    <div>
      <form className="col-md-12" onSubmit={props.onSubmit}>
        <label htmlFor="">About you</label>
        <div>
          <textarea className="form-control" rows="3" name="bio" onChange={props.onChange} value={props.currentBio} ></textarea>
          <small className="form-text text-muted">Tell the others a little bit more about yourself in less than 200 characters.</small>
        </div>
        <button type="submit" className="btn-xs btn-warning">Add</button>
      </form>
    </div>
  )
}

const RenderFormGetLocation = props => {
  return (
    <div>
      <form className="form-inline" onSubmit={props.onSubmit}>
        <div className="input-group">
          <input className="form-control" type="text" name="address" onChange={props.onChange} value={props.address} />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit" ><span className=" glyphicon glyphicon-send"/></button>
          </span>
        </div>
      </form>
    </div>
  )
}

const RenderMap = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{ lat: props.userInfos.localisation.lat, lng: props.userInfos.localisation.lng }}
  >
    {props.isMarkerShown && <Marker position={{ lat: props.userInfos.localisation.lat, lng: props.userInfos.localisation.lng }} />}
  </GoogleMap>
))

class EditUserProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      'informations': {
        'firstname': '',
        'lastname': '',
        'gender': '',
        'orientation': 'Bisexual',
        'interests': [],
        'birthdate': '01-01-1990',
        'bio': '',
        'address': '',
        'location': ''
      },
      'file': '',
      'filename': '',
      'filetype': '',
      'uploadSucceed': false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.handleDeleteFile = this.handleDeleteFile.bind(this)
    this.handleNamesSubmit = this.handleNamesSubmit.bind(this)
    this.handleSetGender = this.handleSetGender.bind(this)
    this.handleOrientationSubmit = this.handleOrientationSubmit.bind(this)
    this.handleBioSubmit = this.handleBioSubmit.bind(this)
    this.handleInterestsChange = this.handleInterestsChange.bind(this)
    this.handleInterestsSubmit = this.handleInterestsSubmit.bind(this)
    this.handleBirthdateSubmit = this.handleBirthdateSubmit.bind(this)
    this.handleLocationSubmit = this.handleLocationSubmit.bind(this)
  }

  /* File upload handlers */

  handleFile(e) {
    e.preventDefault()

    const state = this.state
    const { name } = e.target
    const value =  e.target.files[0]

    if (e.target.files && e.target.files.length) {
      state[name] = value
      this.setState(state)
    }
  }

  handleFileUpload(e) {
    e.preventDefault()
    const state = this.state

    this.props.onSubmitUploadImage(state)
  }

  handleDeleteFile = id => e => {
    e.preventDefault()

    const data = {
      id: id
    }

    this.props.removeImage(data)
  }

  /* Interests set/update handling */

  handleInterestsChange(tags) {
    const state = this.state
    const name = 'interests'

    state.informations[name] = tags
    this.setState(state)
  }

  handleInterestsSubmit(e) {
    e.preventDefault()

    this.props.setNewInterestsList(this.state.informations)
  }

  /* Generic handle change */

  handleChange(e) {
    e.preventDefault()
    const state = this.state
    const {name, value} = e.target

    state.informations[name] = value
    this.setState(state)
  }

  /* Submitting functions */
  
  handleNamesSubmit(e) {
    e.preventDefault()

    this.props.submitNewNames(this.state.informations)
  }

  handleBirthdateSubmit(e) {
    e.preventDefault()

    this.props.setBirthdate(this.state.informations)
  }

  handleSetGender(e) {
    e.preventDefault()
    const state = this.state
    const {name, value} = e.target

    state.informations[name] = value
    this.setState(state)
    this.props.setGender(this.state.informations)
  }

  handleOrientationSubmit(e) {
    e.preventDefault()

    this.props.setOrientation(this.state.informations)
  }

  handleBioSubmit(e) {
    e.preventDefault()
    const bio = this.state.informations.bio

    if (bio.length < 201) {
      this.props.submitUserBio(this.state.informations)
    }
  }

  handleLocationSubmit(e) {
    e.preventDefault()

    this.props.submitUserLocationSearch(this.state.informations)
  }

  componentDidMount() {
    this.props.loadUserInfos()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.uploadSucceed !== this.props.uploadSucceed ||
        nextProps.removeSucceed !== this.props.removeSucceed ||
        nextProps.removeSucceed !== this.props.removeSucceed ||
        nextProps.setUserBirthdateSucceed !== this.props.setUserBirthdateSucceed ||
        nextProps.updateNamesSucceed !== this.props.updateNamesSucceed ||
        nextProps.setOrientationSucceed !== this.props.setOrientationSucceed ||
        nextProps.updateUserInterestsSucceed !== this.props.updateUserInterestsSucceed ||
        nextProps.updateBioSucceed !== this.props.updateBioSucceed ||
        nextProps.userLocationSucceed !== this.props.userLocationSucceed) {
      this.props.loadUserInfos()
    }

    if (nextProps.updateUserInterestsSucceed !== this.props.updateUserInterestsSucceed) {
      this.props.loadInterestsList()
    }

    /* use when loadUserInfos is call from componentDidMount - local state is set with default values */
    if (nextProps.userInfos && nextProps.userInfos.gender !== this.state.informations.gender) {
      const state = this.state

      state.informations['firstname'] = nextProps.userInfos.firstname
      state.informations['lastname'] = nextProps.userInfos.lastname
      state.informations['gender'] = nextProps.userInfos.gender
      state.informations['birthdate'] = nextProps.userInfos.birthday
      state.informations['orientation'] = nextProps.userInfos.orientation
      state.informations['interests'] = nextProps.userInfos.interests
      state.informations['bio'] = nextProps.userInfos.bio
      state.informations['location'] = nextProps.userInfos.localisation
      state.informations['address'] = nextProps.userInfos.localisation.address

      this.setState(state)
      this.props.loadInterestsList()
    }

    /* used when gender field change after action has been dispatched */
    if (nextProps.setGenderSucceed.gender && nextProps.setGenderSucceed.gender !== this.state.informations.gender) {
      const state = this.state

      state.informations['gender'] = nextProps.setGenderSucceed.gender
      this.setState(state)
      /* update redux store with new values from db */
      this.props.loadUserInfos()
    }
  }

  render() {
    let alert = null
    let map = null

    if (this.state.informations.location !== undefined && this.state.informations.location) {
      map = <RenderMap
              isMarkerShown
              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=`+config.googleMapKey+`&v=3.exp&libraries=geometry,drawing,places`}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              userInfos={this.props.userInfos}
              test={this.state.informations}
            />
    }

    return(
      <div className="container-fluid col-md-10 col-md-offset-1">
        <h3 className="edit-user-profile" >Profile informations</h3>
        <hr />
        <div className="col-md-5" id="edit-images-box">
          <RenderImageForm
            onChange={this.handleFile}
            onSubmit={this.handleFileUpload}
            images={this.props.userImages}
            onClickDeleteImage={this.handleDeleteFile}
          />
          <RenderImageGallery
            images={this.props.userImages}
            onClickDeleteImage={this.handleDeleteFile}
          />
        </div>
        <div className="col-md-7" id="edit-forms-container">
          <h3>Edit</h3>
          {alert}
          <RenderNamesForm
            onChange={this.handleChange}
            onSubmit={this.handleNamesSubmit}
            firstname={this.state.informations.firstname}
            lastname={this.state.informations.lastname}
          />
          <RenderDatePicker
            onChange={this.handleChange}
            onSubmit={this.handleBirthdateSubmit}
            birthdate={this.state.informations.birthdate}
          />
          <RenderGenderForm
            onChange={this.handleSetGender}
            gender={this.state.informations.gender}
          />
          <RenderOrientationForm
            onChange={this.handleChange}
            onSubmit={this.handleOrientationSubmit}
            orientation={this.state.informations.orientation}
          />
          <RenderTypeHead
            onChange={this.handleInterestsChange}
            onSubmit={this.handleInterestsSubmit}
            tagsPool={this.props.tagsPool}
            interests={this.state.informations.interests}
          />
          <RenderBioForm
            onChange={this.handleChange}
            onSubmit={this.handleBioSubmit}
            currentBio={this.state.informations.bio}
          />
        </div>
        <div className="col-md-12" id="edit-profile-geoloc">
          <h3>Geolocation</h3>
          <RenderFormGetLocation
            onChange={this.handleChange}
            onSubmit={this.handleLocationSubmit}
            address={this.state.informations.address}
          />
          <br />
          <div>
            { map }
          </div>
        </div>
      </div>
    )
  }
}

EditUserProfile.defaultProps = {
  userInfos: {}
  /* set other props*/
}

EditUserProfile.propTypes = {
  userInfos: PropTypes.object.isRequired
  /* set other props*/
}

const mapStateToProps = state => {
  return {
    tagsPool: state.tagsPool.loadPoolSucceed,
    userInfos: state.userInfos.infosSuccess,
    userImages: state.userInfos.infosSuccess.pictures,
    uploadSucceed: state.editProfile.uploadSucceed,
    removeSucceed: state.editProfile.removeSucceed,
    updateNamesSucceed: state.editProfile.setNewNamesSucceed,
    updateNamesError: state.editProfile.setNewNamesHasErrored,
    updateBioSucceed: state.editProfile.setUserBioSucceed,
    setGenderSucceed: state.editProfile.setUserGenderSucceed,
    setOrientationSucceed: state.editProfile.setUserOrientationSucceed,
    updateUserInterestsSucceed: state.editProfile.updateUserInterestsSucceed,
    setUserBirthdateSucceed: state.editProfile.setUserBirthdateSucceed,
    userLocationSucceed: state.editProfile.searchLocationSucceed
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmitUploadImage: data => dispatch(uploadImage(data)),
    loadUserInfos: () => dispatch(loadUserPublicInfos()),
    removeImage: data => dispatch(removeFromServer(data)),
    submitNewNames: data => dispatch(setNewUserNames(data)),
    submitUserBio: data => dispatch(setUserBio(data)),
    setGender: data => dispatch(setUserGender(data)),
    setOrientation: data => dispatch(setUserOrientation(data)),
    loadInterestsList: () => dispatch(getTagsPool()),
    setNewInterestsList: data => dispatch(updateUserInterests(data)),
    setBirthdate: data => dispatch(setUserBirthdate(data)),
    submitUserLocationSearch: data => dispatch(getUserLocation(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUserProfile)