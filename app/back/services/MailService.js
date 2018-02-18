'use strict'

const nodemailer = require('nodemailer');
const secret = require('../config/secret.js');
const config = require('../config/config.js');

let smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: 'matchadev42@gmail.com',
    pass: secret.pass
  }
});

module.exports = {
  sendNewAccountEmail: (data) => {
    const token = data.validation_token;
    const login = data.username;
    
    const infos = {
      from: 'matcha@love.fr',
      to: data.email,
      subject: 'Matcha: new message',
      text: 'Welcome to Matcha\n\nPlease validate your registration by clicking on the link bellow\n\n'+config.application_address+config.frontServer.port+'/activate?login='+login+'&token='+token
    };
    
    smtpTransport.sendMail(infos, function(err, res) {
      if (err) {
        console.error('Email error', err);
      } else {
        console.log('Email sent', res);
      }
    });
  },
  sendResetEmail: (data, token) => {
    const login = data.username;
    const url = config.application_address+config.frontServer.port+'/password_new?login='+login+'&token='+token

    const infos = {
      from: 'matcha@love.fr',
      to: data.email,
      subject: 'Matcha: reset your password',
      text: 'Welcome to Matcha\n\nPlease reset your password by visiting the link bellow\n\n' + url
    };

    smtpTransport.sendMail(infos, function(err, res) {    
      if (err) {
        console.error('Email error', err);
      } else {
        console.log('Email sent', res);
      }
    });
  }
}