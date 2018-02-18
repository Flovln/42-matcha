'use strict'

const cryptoService = require('../services/CryptoServices')
const mailService = require('../services/mailService')
const geolocalisationService = require('../services/GeolocalisationServices')
const authPolicies = require('../policies/AuthPolicies')
const userModel = require('./UserModel')
const ObjectId = require('mongodb').ObjectId;

const Auth = {
  registerUser : (db, data) => {
    return new Promise((resolve, reject) => {
      const errors = [];
      let value = null

      if (value = authPolicies.validateEmail(data.email)) 
        errors.push(value);
      if (value = authPolicies.validateUsername(data.username))
        errors.push(value);
      if ((value = authPolicies.validateNames(data.first_name)) || (value = authPolicies.validateNames(data.last_name)))
        errors.push(value);
      if (data.password !== data.confirmation)
        errors.push('Please make sure to enter the same password');
      if (value = authPolicies.validatePassword(data.password, data.confirmation))
        errors.push(value);

      if (!errors.length) {
        const current_date = Date.now();
        const validation_token = cryptoService.createSalt(30);
        /* Password encryption using password hash and unique salt*/
        const salt = cryptoService.createSalt(16);
        const passwordData = cryptoService.createHash(data.password, salt);

        db.collection('users').insert({
          /* Account infos */
          username: data.username,
          firstname: data.first_name,
          lastname: data.last_name,
          email: data.email,
          salt: passwordData.salt,
          password: passwordData.hashPassword,
          subscribed_at: current_date,
          last_connection: undefined,
          is_active: false, //account validation confirmed
          validation_token: validation_token,
          /* public infos*/
          status: undefined,
          birthday: '',
          age: 0,
          gender: undefined,
          orientation: 'Bisexual',
          bio: '',
          popularity: 150,
          interests: [],
          pictures: [],
          localisation: undefined,
          online: false,
          notifications: {views: 0, likes: 0, unlikes: 0, matches: 0, messages: 0},
          /* Private infos */
          location: {}, //use for mongo geoSphere queries
          threads: {},
          matches: [],
          guests_visits: [],
          blocked_users: [],
          blocked_by: [],
          likes: [],
          liked_by: []
        }).then((user) => {
          return resolve (user);
        })
        .catch(() => {
          return reject ('error insert users collection');
        })
      } else {
        return reject (errors[0]);
      }
    });
  },
  activateOn: (db, login, token) => {
    return new Promise((resolve, reject) => {      
      db.collection('users').findOne({username: login}).then((user_data) => {

        if (user_data.validation_token === token) {
          db.collection('users').update({"validation_token" : token}, {$set : {is_active: true}}, null).then((res) => {  
            resolve (res);
          
          }).catch((err) => {    
            reject ('unvalid token');
          
          });
        } else {
          reject ('unvalid token');
        
        }
      }).catch((err) => {
        reject ('unknown login');
      
      });
    });
  },
  loginUser: (db, login_data, client_ip) => {
    return new Promise((resolve, reject) => {

      db.collection('users').findOne({username: login_data.username}).then((user_data) => {

        if (!user_data) {
          return reject('This username doesn\'t exist');
        }

        if (user_data.is_active == true) {
          const passwordVerify = cryptoService.createHash(login_data.password, user_data.salt)
    

          /* Check if correct password */
          if (passwordVerify.hashPassword === user_data.password) {
            const current_time = Date.now();

            if (!user_data.localisation || user_data.localisation.address == "") {

              /* Call to geolocalisation service using navigator api */
              geolocalisationService.locateUserAtLogin(client_ip, login_data.location).then((localisation) => {
                
                const location = {
                  type: 'Point',
                  coordinates: [localisation.lng, localisation.lat]
                }
                
                /* If user hasn't set his location */
                db.collection('users').update({"username": user_data.username}, {$set: {last_connection: current_time, online: true, localisation: localisation, location: location}}, null).then(() => {
                  return resolve ({
                    _id: user_data._id,
                    login: user_data.username,
                    firstname: user_data.firstname,
                    lastname: user_data.lastname
                  })
                }).catch((error) => {
                  return reject(error)
                })
              }).catch((error) => {
                return reject('server error')
              })
            } else {
              /* If user has set/edit his profile location using google map */
              db.collection('users').update({"username": user_data.username}, {$set: {last_connection: current_time, online: true}}, null).then(() => {
                return resolve ({
                  _id: user_data._id,
                  login: user_data.username,
                  firstname: user_data.firstname,
                  lastname: user_data.lastname
                })
              }).catch((error) => {
                return reject(error)
              })
            }
          } else {
            return reject ('This password is uncorrect.');
          }
        } else {
          return reject ('Please make sure your account is activated');
        }
      }).catch((err) => {
        return reject('internal error logging in');
      })      
    })
  },
  logoutUser: (db, user_id) => {
    return new Promise((resolve, reject) => {
      db.collection('users').update({"_id" : new ObjectId(user_id)}, {$set: {online: false} }, null).then((res) => {
        return resolve('User logged out')
      })
      .catch((error) => {
        return reject(error);
      })
    })
  },
  forgotPassword: (db, data) => {
    return new Promise((resolve, reject) => {
      db.collection('users').findOne({email: data.email}).then((content) => {
        if (!content) {
          return reject();          
        } else {
          const new_token = cryptoService.createSalt(30);

          db.collection('users').update({"_id" : content._id}, {$set: {validation_token: new_token}}, null).then(() => {
            mailService.sendResetEmail(content, new_token);
            return resolve();
          }).catch(() => {
            return reject();
          })
        }
      }).catch((err) => {
        return reject(err);
      });
    });
  },
  resetPassword: (db, data) => {
    return new Promise((resolve, reject) => {
      db.collection('users').findOne({username: data.login}).then((user_data) => {
        if (!user_data)
          return reject('Unvalid username.');

        let value = null

        if (value = authPolicies.validatePassword(data.password, data.confirmation)) {
          return reject(value)
        }

        if (user_data.validation_token === data.token) {
          const new_password = cryptoService.createHash(data.password, user_data.salt);

          db.collection('users').update({"_id" : user_data._id}, {$set: {password: new_password.hashPassword}}, null).then(() => {
            return resolve();
          }).catch(() => {
            console.log('Error updating password');
          });
        } else {
          return reject('Unvalid account.');          
        }
      }).catch(() => {
        return reject();
      });
    });
  }
}

module.exports = Auth;