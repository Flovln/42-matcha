'use strict'

const geolib = require('geolib')
const moment = require('moment')

const ObjectId = require('mongodb').ObjectId;

const authPolicies = require('../policies/AuthPolicies')
const userServices = require('../services/UserServices')
const cryptoService = require('../services/CryptoServices')
const matchingService = require('../services/MatchingService')
const geolocalisationService = require('../services/GeolocalisationServices')
const tagsModel = require('./tagsModel')

const userModule = {
  listAllSearchedUsers: (db, user, data) => {
    /* SEARCH component */
    return new Promise((resolve, reject) => {

      if (!data.age.length && !data.popularity && !location && !data.interests.length) {
        return resolve([])
      }

      const currentYear = new Date().getFullYear()
      const gtYear = currentYear - data.age[0] 
      const ltYear = currentYear - data.age[1]
      const ltDate = new Date(gtYear + '-01-01').toISOString()
      const gtDate = new Date(ltYear + '-01-01').toISOString()

      userModule.userGetPublicInfos(db, user.user_id).then((public_infos) => {
        const gender = public_infos.gender
        const birthday = public_infos.birthday

        if (!gender || !birthday.length) {
          return resolve([])
        }

        userModule.userGetPrivateInfos(db, user)
        .then((private_infos) => {
          db.collection('users').find({
              location: {
                $nearSphere: {
                  $geometry: private_infos.location,
                  $minDistance: 0,
                  $maxDistance: 100000
                  },
                },
                $and: [
                  {username: { $ne: user.username, $nin: private_infos.blocked_users}},
                  {popularity: {$gt: data.popularity[0], $lt: data.popularity[1]}},
                  {isoBirthday: {$gt: new Date(gtDate), $lt: new Date(ltDate)}}
                ]
              },
              {
                _id: 1,
                username: 1,
                birthday: 1,
                gender: 1,
                orientation: 1,
                localisation: 1,
                interests: 1,
                popularity: 1,
                pictures: 1
              }
            )
            .toArray().then((users_list) => {
              let interestsScore = 0


              /* Starting from here we have a valid user list */
              users_list.forEach((user, index) => {
                user.locationIndex = index

                /* Find how many interests each user has in common with current user */
                if (user.interests.length > 0 && public_infos.interests.length > 0) {
                  const currentInterests = public_infos.interests
                  const userInterests = user.interests

                  currentInterests.forEach((interest) => {
                    if (userInterests.indexOf(interest) !== -1) {
                      interestsScore += 1 
                    }
                  })
                }

                user.commonInterests = interestsScore

                /* For each user get his distance from current user*/
                const distance = geolib.getDistance(
                  {latitude: public_infos.localisation.lat, longitude: public_infos.localisation.lng},
                  {latitude: user.localisation.lat, longitude: user.localisation.lng}
                )

                user.distance = Math.floor(distance / 1000)

              })

              
              let filtered = []
              const distanceMax = data.location
              const interests = data.interests

              /* Keep only the users matching the distance grade research */
              if (distanceMax > 0) {
                filtered = users_list.filter((user) => {
                  if (user.distance <= distanceMax) {
                    return true
                  }
                })
              } else {
                filtered = users_list       
              }

              /* Keep only the users matching the interests search */
              if (interests.length > 0) {
                let score = 0

                filtered = filtered.filter((user) => {
                  interests.forEach((interest) => {
                    if (user.interests.indexOf(interest.tag) !== -1) {
                      score += 1
                    }
                  })

                  if (score > 0) {
                    score = 0
                    return true          
                  }
                })
              }

              return resolve(filtered)
            })
            .catch((error) => {
              return reject(error)
            })
          })
        })
      })
      .catch((error) => {
        return reject(error)
      })
  },
  listAllMatchingUsers: (db, user) => {
    /* USER FEED component */
    return new Promise((resolve, reject) => {

      userModule.userGetPublicInfos(db, user.user_id).then((public_infos) => {
        const gender = public_infos.gender
        const orientation = public_infos.orientation
        const birthday = public_infos.birthday

        if (!gender || !birthday.length) {
          return resolve([])
        }

        userModule.userGetPrivateInfos(db, user)
          .then((private_infos) => {
          db.collection('users').find({
            location: {
              $nearSphere: {
                $geometry: private_infos.location,
                $minDistance: 0,
                $maxDistance: 50000
                },
              },
              $and: [
                {username: { $ne: user.username, $nin: private_infos.blocked_users}},
                {$or: matchingService.filterMatching(gender, orientation)}
              ]
            },
            {
              _id: 1,
              username: 1,
              birthday: 1,
              gender: 1,
              orientation: 1,
              localisation: 1,
              interests: 1,
              popularity: 1,
              pictures: 1
            }
          )
          .toArray().then((users_list) => {
            /* Valid list of users - current and blocked users not included - Geospace 50kms around - Matching gender + orientation */

            users_list.forEach((user, index) => {
              /* A unique locationIndex is set for each user, it will be use on client side to order users using their location */
              user.locationIndex = index
              let interestsScore = 0
              let popularityScore = 0
              let score = 0
            
              /* Find how many interests each user has in common with current user */
              if (user.interests.length > 0 && public_infos.interests.length > 0) {
                const currentInterests = public_infos.interests
                const userInterests = user.interests

                currentInterests.forEach((interest) => {
                  if (userInterests.indexOf(interest) !== -1) {
                    interestsScore += 1 
                  }
                })
              }

              /* For each user get his distance from current user*/
              const distance = geolib.getDistance(
                {latitude: public_infos.localisation.lat, longitude: public_infos.localisation.lng},
                {latitude: user.localisation.lat, longitude: user.localisation.lng}
              )

              user.distance = Math.floor(distance / 1000)

              /* New field to know number of interests the user has in common with current user*/
              user.commonInterests = interestsScore

              interestsScore *= 10
              popularityScore = user.popularity / 3

              /* For each user we create a score based on common interests + popularity where interests are taken as more important than popularity */
              user.score = interestsScore + popularityScore
            })
            
            return resolve(users_list)
          })
          .catch((error) => {
            return reject(error)
          })
        })
        .catch((error) => {
          return reject(error)
        })
      })
    })
  },
  /* Get current session user public informations */
  userGetPublicInfos: (db, user_id) => {
    return new Promise((resolve, reject) => {
      db.collection('users').findOne({ "_id" : new ObjectId(user_id)}, {
        username: 1,
        firstname: 1,
        lastname:1,
        birthday: 1,
        gender: 1, 
        orientation: 1,
        bio: 1,
        interests: 1,
        pictures: 1,
        localisation: 1,
        online: 1,
        last_connection: 1,
        popularity: 1,
        notifications: 1
      })
      .then((infos) => {
        resolve(infos)
      })
      .catch((err) => {
        reject(err);
      });      
    })
  },
  /* Get current session user private infos */
  userGetPrivateInfos: (db, user) => {
    return new Promise((resolve, reject) => {
      db.collection('users').findOne({ "_id" : new ObjectId(user.user_id)}, {
        location: 1,
        likes: 1,
        liked_by: 1,
        matches: 1,
        guests_visits: 1,
        blocked_users: 1,
        blocked_by: 1,
        threads: 1
      }).then((infos) => {
        resolve(infos)
      }).catch((err) => {
        reject(err);
      });
    })
  },
  /* Get user profile visited public informations */
  searchUserPublicInfos: (db, username) => {
    return new Promise((resolve, reject) => {
      db.collection('users').findOne({ "username" : username}, {
        username: 1,
        firstname: 1,
        lastname:1,
        birthday: 1,
        gender: 1,
        orientation: 1,
        bio: 1,
        interests: 1,
        pictures: 1,
        localisation: 1,
        online: 1,
        last_connection: 1,
        popularity: 1
      }).then((infos) => {
        resolve(infos)
      })
      .catch((err) => {
        reject(err);
      });
    });
  },
  /* Get user profile visited private infos !!! TO BE REMOVED !!! */
  userVisitedGetPrivateInfos: (db, username) => {
    return new Promise((resolve, reject) => {
      db.collection('users').findOne({ "username" : username}, {
        likes: 1,
        liked_by: 1,
        matches: 1,
        guests_visits: 1,
        blocked_users: 1,
        blocked_by: 1,
        threads: 1
      }).then((infos) => {
        resolve(infos)
      }).catch((err) => {
        reject(err);
      });
    })
  },
  /* Handles update password only for now */
  updateAccount: (db, user, data) => {
    return new Promise((resolve, reject) => {

      if (authPolicies.validateEmail(data.email)) 
        return reject('unvalid email format');
      db.collection('users').update({"_id" : new ObjectId(user.user_id)}, {$set: {email: data.email }}, null).then((res) => {
        return resolve();
      }).catch((err) => {
        return reject(err);
      })
    })
  },  
  editUserNames: (db, user_id, data) => {
    return new Promise((resolve, reject) => {
      if (!data.firstname)
        return reject('First name field is empty');

      if (!data.lastname)
        return reject('Last name field is empty');

      let value = null

      if (value = authPolicies.validateNames(data.firstname)) {
        return reject(value)
      } else if (value = authPolicies.validateNames(data.lastname)) {
        return reject(value)
      }

      db.collection('users').update({"_id" : new ObjectId(user_id)}, {$set: {firstname: data.firstname, lastname: data.lastname }}, null).then((res) => {
        userModule.userGetPublicInfos(db, user_id).then((infos) => {
          return resolve(infos)
        })
        .catch((error) => {
          return reject(error);          
        })
      })
      .catch((err) => {
        return reject(err);
      })
    })
  },
  editUserBio: (db, user_id, data) => {
    return new Promise((resolve, reject) => {
      db.collection('users').update({"_id" : new ObjectId(user_id)}, {$set: {bio: data.bio} }, null).then((res) => {
        userModule.userGetPublicInfos(db, user_id).then((infos) => {
          return resolve(infos)
        })
        .catch((error) => {
          return reject(error);          
        })
      })
      .catch((err) => {
        return reject(err);
      })
    })    
  },
  editUserGender: (db, user_id, data) => {
    return new Promise((resolve, reject) => {
      db.collection('users').update({"_id" : new ObjectId(user_id)}, {$set: {gender: data.gender} }, null).then((res) => {
        userModule.userGetPublicInfos(db, user_id).then((infos) => {
          return resolve(infos)
        })
        .catch((error) => {
          return reject(error);          
        })
      })
      .catch((err) => {
        return reject(err);
      })
    })    
  },
  editUserOrientation: (db, user_id, data) => {
    return new Promise((resolve, reject) => {
      db.collection('users').update({"_id" : new ObjectId(user_id)}, {$set: {orientation: data.orientation} }, null).then((res) => {
        userModule.userGetPublicInfos(db, user_id).then((infos) => {
          return resolve(infos)
        })
        .catch((error) => {
          return reject(error);          
        })
      })
      .catch((err) => {
        return reject(err);
      })
    })    
  },
  editUserInterests: (db, user_id, data) => {
    return new Promise((resolve, reject) => {

      userServices.normalizeTagsArray(data.interests).then((tags) => {
        tagsModel.addInterestsToPool(db, tags).then(() => {
          db.collection('users').update({"_id" : new ObjectId(user_id)}, {$set: {interests: tags} }, null).then((res) => {
            userModule.userGetPublicInfos(db, user_id).then((infos) => {
              return resolve(infos)
            })
            .catch((error) => {
              return reject(error);          
            })
          })
          .catch((error) => {
            return reject(error);
          })
        })
        .catch((error) => {
          return reject(error)          
        })
      })
      .catch((error) => {
        return reject(error)
      })
    })    
  },
  setUserBirthdate: (db, user_id, data) => {
    return new Promise((resolve, reject) => {
      /* Checking if user is underaged */
      const isoDate = new Date(data.birthdate).toISOString()
      const age = moment().diff(data.birthdate, 'years')

      if (age < 18) {
        return reject('Underaged users are not accepted, you have to be over 18 years old.')
      }

      db.collection('users').update({"_id" : new ObjectId(user_id)}, {$set: {birthday: data.birthdate, isoBirthday: new Date(isoDate)} }, null).then((res) => {
        userModule.userGetPublicInfos(db, user_id).then((infos) => {
          return resolve(infos)
        })
        .catch((error) => {
          return reject(error);          
        })
      })
      .catch((err) => {
        return reject(err);
      })
    })    
  },
  searchLocation: (db, user_id, data) => {
    return new Promise((resolve, reject) => {
      geolocalisationService.locateByAddress(data.address).then((result) => {
        
        if (!result.length) {
          return resolve('location couldn\'t be found')
        }

        const localisation = {
          lat: result[0].geometry.location.lat,
          lng: result[0].geometry.location.lng,
          address: result[0].formatted_address
        }

        const location = {
          type: 'Point',
          coordinates: [result[0].geometry.location.lng, result[0].geometry.location.lat]
        }

        db.collection('users').update({"_id" : new ObjectId(user_id)}, {$set: {localisation: localisation, location: location} }, null).then((res) => {
          userModule.userGetPublicInfos(db, user_id).then((infos) => {
            return resolve(infos)
          })
          .catch((error) => {
            return reject(error);          
          })
        })
        .catch((error) => {
          return reject()
        })
      })
      .catch((error) => {
        return reject(error)
      })
    })    
  },
  saveUserVisting: (db, user, user_to_query) => {
    return new Promise((resolve, reject) => {
      if (user_to_query === user.username) {
        return reject(error);        
      }

      // check if current user is blocked by visited user / if so, no notification
      userModule.userGetPrivateInfos(db, user).then((infos) => {
        let blocked = false

        for (let i = 0; i < infos.blocked_by.length; i++) {
          if (infos.blocked_by[i].username === user_to_query) {
            blocked = true
          }
        }

        if (blocked === false) {

          const key = Math.random().toString(36).slice(2)
          const user_obj = {
            id: key,
            time: Date.now(),
            username: user.username
          }

          db.collection('users').update({"_id" : new ObjectId(user.user_id)}, {$inc: {popularity: -1} }, null).then(() => {
            db.collection('users').update({"username" : user_to_query}, {$push: {guests_visits: user_obj}, $inc: {popularity: 2, "notifications.views": 1} }, null)
              .then((res) => {
                return resolve('success saving guest user')
            })
            .catch((error) => {
              return reject('saving guest user' + error);
            })
          })
          .catch((error) => {
            return reject('saving guest user' + error);
          })
        } else {
          return resolve('user blocked, not profile view notifications')          
        }
      })
    })
  },
  saveMatch: (db, user, user_liked_name, user_liked_id) => {
    return new Promise((resolve, reject) => {

      const user_liked = {
        _id: user_liked_id,
        time: Date.now(),
        username: user_liked_name
      }
        
      db.collection('users').update({"username" : user.username}, {$push: {matches: user_liked}, $inc: {popularity: 10, "notifications.matches": 1} }, null).then((res) => {
        
        const user_session = {
          _id: user.user_id,
          time: Date.now(),
          username: user.username
        }

        db.collection('users').update({"username" : user_liked_name}, {$push: {matches: user_session}, $inc: {popularity: 10, "notifications.matches": 1} }, null).then((res) => {
          return resolve('success saving match!')
        })
        .catch((error) => {
          return reject('saving match' + error);
        })
      })
      .catch((error) => {
        return reject('saving match' + error);
      })
    })
  },
  saveUserLiked: (db, user, user_liked) => {
    return new Promise((resolve, reject) => {
      userModule.userGetPrivateInfos(db, user).then((infos) => {

        for(let i = 0; i < infos.likes.length; i++) {
          if (infos.likes[i] === user_liked) {
            return resolve('user already liked!')
          }
        }

        db.collection('users').update({"_id" : new ObjectId(user.user_id)}, {$push: {likes: user_liked}, $inc: {popularity: -3} }, null).then((res) => {
          return resolve()
        })
        .catch((error) => {
          return reject('user liked' + error)
        })
      })
      .catch((error) => {
        return reject('user liked' + error)        
      })
    })
  },
  handleLikes: (db, user, user_liked) => {
    return new Promise((resolve, reject) => {
  
      /* Get user visited likes list */
      db.collection('users').findOne({"username": user_liked }, { liked_by: 1 }).then((user_data) => {

        /* Make sure a user can't like himself */
        if (user.username === user_liked) {
          throw new Error('a user cannot like himself!');
        }

        /* Make sure a user is not liked twice */
        for (let i = 0; i < user_data.liked_by.length; i++) {
          if (user_data.liked_by[i].username === user.username) {
            return resolve('user already liked')
          }
        }

        const user_obj = {
          _id: user.user_id,
          time: Date.now(),
          username: user.username
        }

        /* Save current session user in user liked likes array */
        db.collection('users').update({"username" : user_liked}, {$push: {liked_by: user_obj}, $inc: {popularity: 7, "notifications.likes": 1} }, null).then((res) => {
          
          /* Get current session user likes array */
          db.collection('users').findOne({"username": user.username }, { liked_by: 1 }).then((user_likes) => {

            let match = null;

            /* If user_liked is in current session user array it is a match */
            for (var i = 0; i < user_likes.liked_by.length; i++) {
              if (user_likes.liked_by[i].username === user_liked)
                match = 'it is a match!';
            }

            if (match) {
              /* Save current session user + liked user in match array from corresponding user */
              userModule.saveMatch(db, user, user_liked, user_data._id).then((res) => {
                return resolve({message: 'it is a match', match: user})
              })
              .catch((error) => {
                return reject(error);
              })              
            } else {
              return resolve('success saving user liked')
            }
          })
          .catch((error) => {
            return reject('saving liked user' + error);
          })
        })
        .catch((error) => {
          return reject('saving liked user' + error);
        })
      })
      .catch((error) => {
        return reject('saving liked user' + error);
      })
    })
  },
  unmatchUsers: (db, user, user_to_unmatch) => {
    return new Promise((resolve, reject) => {
      db.collection('users').update({"_id" : new ObjectId(user.user_id)}, {$pull: {matches:{username: user_to_unmatch}} }, null)
      .then(() => {
        db.collection('users').update({"username" : user_to_unmatch}, {$pull: {matches:{username: user.username}, $inc: {popularity: -5}} }, null)
        .then(() => {
          return resolve()
        })
        .catch((error) => {
          return reject(error)
        })  
      })
      .catch((error) => {
        return reject(error)
      })  
    })
  },
  unlikeUser: (db, user, user_to_unlike) => {
    return new Promise((resolve, reject) => {
      db.collection('users').update({"_id" : new ObjectId(user.user_id)}, {$pull: {likes: user_to_unlike} }, null).then(() => {
  
        userModule.userGetPrivateInfos(db, user).then((infos) => {
          let blocked = false

          for (let i = 0; i < infos.blocked_by.length; i++) {
            if (infos.blocked_by[i].username === user_to_unlike) {
              blocked = true
            }
          }

          if (blocked === false) {
            db.collection('users').update({"username" : user_to_unlike}, {$pull: {liked_by:{username: user.username}}, $inc: {popularity: -2, "notifications.unlikes": 1}}, null).then(() => {
              userModule.unmatchUsers(db, user, user_to_unlike).then(() => {
                return resolve('unlike user succeed')
              })
              .catch((error) => {
                return reject(error)
              })
            })
            .catch((error) => {
              return reject(error)
            })
          } else {
            db.collection('users').update({"username" : user_to_unlike}, {$pull: {liked_by:{username: user.username} }}, null).then(() => {
              userModule.unmatchUsers(db, user, user_to_unlike).then(() => {
                return resolve('unlike user with no notification succeed')
              })
              .catch((error) => {
                return reject(error)
              })
            })
            .catch((error) => {
              return reject(error)
            })
          }
        })
        .catch((error) => {
          return reject(error)
        })
      })
      .catch((error) => {
        return reject(error)
      })
    })
  },
  blockUser: (db, user, user_to_block) => {
    return new Promise((resolve, reject) => {
      userModule.userGetPrivateInfos(db, user).then((infos) => {

        let blocked = null

        for (let i = 0; i < infos.blocked_users.length; i++) {
          if (infos.blocked_users[i] === user_to_block) {
            blocked = 'user already blocked!'
          }
        }

        if (!blocked) {
          db.collection('users').update({"_id" : new ObjectId(user.user_id)}, {$push: {blocked_users: user_to_block} }, null).then((res) => {
            
            const obj = {
              _id: user.user_id,
              username: user.username
            }

            db.collection('users').update({"username": user_to_block}, {$push: {blocked_by: obj}, $inc: {popularity: -10} }, null).then(() => {
              return resolve(user_to_block + ' has successfully been blocked.')
            })
          })
          .catch((error) => {
            return reject('blocking user ' + error);
          })          
        } else {
          return resolve(blocked)
        }
      })
      .catch((error) => {
        return reject(error)         
      })
    })
  },
  unblockUser: (db, user, user_to_unblock) => {
    return new Promise((resolve, reject) => {
      db.collection('users').update({"_id" : new ObjectId(user.user_id)}, {$pull: {blocked_users: user_to_unblock} }, null).then(() => {

        db.collection('users').update({"username" : user_to_unblock}, {$pull: {blocked_by:{username: user.username}} }, null).then(() => {
          return resolve('success unblocking ' + user_to_unblock)
        })
        .catch((error) => {
          return reject(error)
        })
      })
      .catch((error) => {
        return reject(error)         
      })
    })
  },
  setViewsToDefault: (db, user) => {
    return new Promise((resolve, reject) => {
      db.collection('users').update({"_id" : new ObjectId(user.user_id)}, {$set: {"notifications.views": 0}}, null).then(() => {
        return resolve('user views set to default')
      })
      .catch((error) => {
        return reject(error)
      })
    })
  },
  setLikesToDefault: (db, user) => {
    return new Promise((resolve, reject) => {
      db.collection('users').update({"_id" : new ObjectId(user.user_id)}, {$set: {"notifications.likes": 0}}, null).then(() => {
        return resolve('user likes set to default')
      })
      .catch((error) => {
        return reject(error)
      })
    })
  },
  setUnlikesToDefault: (db, user) => {
    return new Promise((resolve, reject) => {
      db.collection('users').update({"_id" : new ObjectId(user.user_id)}, {$set: {"notifications.unlikes": 0}}, null).then(() => {
        return resolve('user unlikes set to default')
      })
      .catch((error) => {
        return reject(error)
      })
    })
  },
  setMatchesToDefault: (db, user) => {
    return new Promise((resolve, reject) => {
      db.collection('users').update({"_id" : new ObjectId(user.user_id)}, {$set: {"notifications.matches": 0}}, null).then(() => {
        return resolve('user matches set to default')
      })
      .catch((error) => {
        return reject(error)
      })
    })
  },
  setMessagesToDefault: (db, user) => {
    return new Promise((resolve, reject) => {
      db.collection('users').update({"_id" : new ObjectId(user.user_id)}, {$set: {"notifications.messages": 0}}, null).then(() => {
        return resolve('user messages set to default')
      })
      .catch((error) => {
        return reject(error)
      })
    })
  }
}

module.exports = userModule;