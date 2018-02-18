'use strict'

const ObjectId = require('mongodb').ObjectId;
const fs = require('fs')
const readChunk = require('read-chunk')
const fileType = require('file-type')

const userModel = require('./UserModel')

const files = {
  countNbOfImages: (db, user_id) => {
    return new Promise((resolve, reject) => {
      //get pictures array size = number of pictures uploaded
      db.collection('users').findOne({"_id": new ObjectId(user_id) }, {pictures: 1}).then((data) => {
        const elementsNb = data.pictures.length
        resolve(elementsNb)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  uploadImageOnServer: (db, user_id, filedata, metadata) => {
    return new Promise((resolve, reject) => {

      const buffer = readChunk.sync(filedata.path, 0, parseInt(filedata.size))
      const result = fileType(buffer)

      if (result.ext !== 'jpg' && result.ext !== 'jpeg' && result.ext !== 'png') {
        return reject('Unvalid file type.')
      }

      files.countNbOfImages(db, user_id).then((elements) => {
        const random = Math.random().toString(36).slice(2)
        let profile = 0

        if (elements === 0)
          profile = 1

        const image = {
          id: random,
          profile_pic: profile,
          name: filedata.originalname,
          encodedname: filedata.filename,
          type: filedata.mimetype,
          path: filedata.path
        }

        if (elements < 5) {
          db.collection('users').update({"_id" : new ObjectId(user_id)}, {$push: {pictures: image }}, null)
          .then((res) => {
            userModel.userGetPublicInfos(db, user_id).then((infos) => {
              return resolve(infos)
            })
            .catch((error) => {
              return reject(error);          
            })
          })
          .catch((error) => {
            return reject(error);
          })
        } else {
          return reject('You can not upload more than 5 photos')
        }
      }).catch((error) => {
        return reject(error)
      })
    })
  },
  removeFileFromServer: (db, user_id, file_id) => {
    return new Promise((resolve, reject) => {

      db.collection('users').findOne({"_id" : new ObjectId(user_id)}, {pictures: 1})
        .then((data) => {

          data.pictures.forEach((elem) => {
            if (elem.id === file_id) {
              fs.unlink(elem.path, (err) => {
                if (err)
                  return reject(err)
              })
            }
          })
          return resolve()
      })
      .catch((error) => {
        return reject(error);          
      })
    })
  },
  removeImageFromDB: (db, user_id, data) => {
    return new Promise((resolve, reject) => {
      files.removeFileFromServer(db, user_id, data.id).then(() => {

        db.collection('users').update({"_id" : new ObjectId(user_id)}, {$pull: {"pictures": {id: data.id}}}, null)
        .then((res) => {
          userModel.userGetPublicInfos(db, user_id).then((infos) => {
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
        return reject(error);          
      })      
    })
  }
}

module.exports = files