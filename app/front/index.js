import React from 'react'
import {  BrowserRouter as Router } from 'react-router-dom'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import reducers from './reducers'
import App from './components/App'

let logger = createLogger()

let createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
let store = createStoreWithMiddleware(reducers)

render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider >,
  document.getElementById('root')
)