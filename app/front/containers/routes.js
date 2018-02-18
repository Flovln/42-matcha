'use strict'

import React from 'react'
import {  Route, IndexRoute } from 'react-router-dom'
import { Switch, Redirect } from 'react-router'

import Header from '../components/Header'
import Home from '../components/Home'

/* Authentication components */
import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'
import SendEmailPasswordReset from '../components/Auth/SendEmailPasswordReset'
import SetNewPassword from '../components/Auth/SetNewPassword'
import ActivateAccount from '../components/Auth/ActivateAccount'

/* User components */
import EditUserProfile from '../components/User/EditUserProfile'
import EditAccountInformations from '../components/User/EditAccount'
import UserPublicProfile from '../components/User/UserPublicProfile'
import Messaging from '../components/User/Messaging'
import ListLikes from '../components/User/ListUserLikes.js'
import ListGuests from '../components/User/ListUserGuestsVisits.js'
import ListMatches from '../components/User/ListUserMatches.js'
import ListContacts from '../components/User/ListUserContacts.js'
import SearchUsers from '../components/User/SearchUsers'

/* Utilities components */
import UnvalidRoute from '../components/UnvalidRoute'

const Routes = () => (
  <div>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
      <Route path='/password_reset' component={SendEmailPasswordReset} />
      <Route path='/password_new' component={SetNewPassword} />
      <Route path='/activate' component={ActivateAccount} />

      <AuthRoute path='/profile' authed={localStorage.getItem('jwtToken')} component={EditUserProfile} />
      <AuthRoute path='/settings' authed={localStorage.getItem('jwtToken')} component={EditAccountInformations} />
      <AuthRoute path='/user/:login' authed={localStorage.getItem('jwtToken')} component={UserPublicProfile} />
      <AuthRoute path='/message/:login' authed={localStorage.getItem('jwtToken')} component={Messaging} />
      <AuthRoute path='/likes' authed={localStorage.getItem('jwtToken')} component={ListLikes} />
      <AuthRoute path='/visits' authed={localStorage.getItem('jwtToken')} component={ListGuests} />
      <AuthRoute path='/matches' authed={localStorage.getItem('jwtToken')} component={ListMatches} />
      <AuthRoute path='/contacts' authed={localStorage.getItem('jwtToken')} component={ListContacts} />
      <AuthRoute path='/search' authed={localStorage.getItem('jwtToken')} component={SearchUsers} />

      <Route component={UnvalidRoute}/>
    </Switch>
  </div>
);

/* Component checking user authentication through his JWT */
const AuthRoute = ({component: Component, authed, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props => authed
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/', state: {from: props.location} }} />
      }
    />
  )
}

export default Routes