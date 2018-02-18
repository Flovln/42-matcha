'use strict'

const fileModel = require('../models/FilesModel')

const files = {
  fileUpload: (req, res) => {
    if (req.file) {
      fileModel.uploadImageOnServer(req.app.db, req.decoded.user_id, req.file, req.body).then((infos) => {
        res.status(200).json({ public_infos: infos })
      }).catch((error) => {
        res.status(200).json({ error: error })
      })
    } else {
      res.status(200).json({ error: 'empty file' })
    }
  },
  fileRemove: (req, res) => {
    fileModel.removeImageFromDB(req.app.db, req.decoded.user_id, req.body).then((infos) => {
      res.status(200).json({ public_infos: infos })
    }).catch((error) => {
      res.status(200).json({ error: error })
    })    
  },
  setProfilePicture: (req, res) => {
    fileModel.setProfilePicture(req.app.db, req.decoded.user_id, req.body).then((infos) => {
      res.status(200).json({ public_infos: infos })
    }).catch((error) => {
      console.log('error: ', error)
      res.status(200).json({ error: error })
    })    
  }
}

module.exports = files