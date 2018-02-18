const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const io = require('socket.io')()

const config = require('../config/config.js');
const routes = require('../config/routes');

module.exports.start = (app, options) => {
  return new Promise((resolve, reject) => {
    if (!options.port)
      throw new Error('A server must be started with a port');
    
    //Api authentication use with jwt
    app.set('secretApi', config.secretAuthpwd);
    app.set('ioClients', {})

    app.use(cors())
    app.use(morgan('dev'));
  
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

//    app.use(express.static(path.join(__dirname, '../uploads')))
//    http://localhost:3000/a49dfda65f35f9eadb4edec7b5eca9da
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
//    http://localhost:3000/uploads/a49dfda65f35f9eadb4edec7b5eca9da
    app.use('/assets', express.static(path.join(__dirname, '../assets')))


    /* Socket connection */
    io.on('connection', client => {

      /* Auth client connection */
      client.on('auth', user => {
        console.log('Auth through socket from client: ', user)
        const ioClients = app.get('ioClients')

        ioClients[user] = client        
      })
    })

    app.use('/', routes);

    const server = app.listen(options.port, () => {
      resolve(server)
      io.listen(server)
    })
  })
}