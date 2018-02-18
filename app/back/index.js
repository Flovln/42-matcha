"use strict"
require('babel-register');
require('babel-polyfill');

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const app = express()

const config = require('./config/config.js')
const routes = require('./config/routes')

const server = require('./server/server')
const db = require('./repository/connect.js');

db.connect({
  host: config.database.host,
  name: config.database.name
}).then(db => {
  app.db = db
  console.log('Starting server...')
  return server.start(app, {
    port: config.server.port
  })
}).then(server => {
  console.log("Server started successfully, running on port " + config.server.port + ".")
  server.on('close', () => {
    app.db.close();
  })
})