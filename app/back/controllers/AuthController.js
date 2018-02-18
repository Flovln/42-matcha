"use strict"
const authModel = require('../models/AuthModel');
const mailService = require('../services/MailService');
const jwtService = require('../services/JwtService');

const Auth = {
  createUser: (req, res) => {
    req.app.db.collection('users').findOne({$or: [{username: req.body.username}, {email: req.body.email}]}).then((data) => {
      if (data && req.body.username === data.username) {  
        return res.status(200).json({error: "This username is already taken"});
    
      } else if (data && req.body.email === data.email) {
        return res.status(200).json({error: "This email already exists"});
      
      } else if (!data) {
        authModel.registerUser(req.app.db, req.body).then((data) => {
          mailService.sendNewAccountEmail(data.ops[0]);
          return res.status(200).json({ message: 'Well done you just registered! Please activate your account by checking your emails' });
   
        }).catch((err) => {
          return res.status(200).json({error: err});

        })
      }
    }).catch((err) => {
      console.log("Error : " + err);
    })
  },
  loginUser: (req, res) => {
    if (!req.body.username || !req.body.password) {
      return res.status(200).send({error: 'Empty field'})

    } else {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

      authModel.loginUser(req.app.db, req.body, ip).then((data) => {
        const token = jwtService.tokenSign(req.app, data);
        
        return res.status(200).json({ success: true, message: 'User logged in' , token: token, informations: data})
        }).catch((err) => {
          return res.status(200).json({error: err});      
        
        });
      }
  },
  logoutUser: (req, res) => {
    authModel.logoutUser(req.app.db, req.decoded.user_id).then((status) => {      
      return res.status(200).json({success: true, message: status})
    }).catch((err) => {
      return res.status(200).json({error: 'error logging out' + err});
    });
  },
  activateUser: (req, res) => {
    authModel.activateOn(req.app.db, req.query.login, req.query.token).then(() => {
      return res.status(200).json({ message: 'Account validated'});

    }).catch((err) => {
      return res.status(200).json({ error: 'Error activating account'});

    });
  },
  forgotPassword: (req, res) => {
    authModel.forgotPassword(req.app.db, req.body).then(() => {
      return res.status(200).json({ message: 'Check your emails for a link to reset your password. If it doesn\'t appear within a few minutes, check your spam folder.'});

    }).catch(() => {
      return res.status(200).json({ error: 'This email doesn\'t seem to be related to any account'});

    })
  },
  resetPassword: (req, res) => {
    if (!req.body.password || !req.body.confirmation) {
      return res.status(200).send({error: 'Empty fields'});
    } else if (req.body.password !== req.body.confirmation) {
      return res.status(200).send({error: 'Please make sure to enter the same password'});
    } 

    authModel.resetPassword(req.app.db, req.body).then(() => {
      return res.status(200).json({ message: 'Password successfully updated.'});

    }).catch((err) => {
      return res.status(200).json({ error: err});

    })
  },
  loginRequired: (req, res, next) => {
    if (req.decoded) {
      next();
    } else {
      res.status(401).send({ message: 'Unauthorized user! '});
    }
  }
}

module.exports = Auth;