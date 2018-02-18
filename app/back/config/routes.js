"use strict"
const express = require('express')
const multer = require('multer')
const fs = require('fs')

const imageDir = './uploads'

if (!fs.existsSync(imageDir)){
  fs.mkdirSync(imageDir)
}

const router = express.Router()
const upload = multer({ dest: './uploads/' })

const userController = require('../controllers/UserController.js')
const authController = require('../controllers/AuthController.js')
const messagesController = require('../controllers/MessagesController.js')
const collectionsController = require('../controllers/CollectionsController')
const filesController = require('../controllers/FilesController')
const tagsController = require('../controllers/TagsController')
const reportController = require('../controllers/ReportController')

const jwtService = require('../services/JwtService')

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token")
  res.header("Access-Control-Allow-Methods", "POST, GET")
  res.header('Content-Type', 'application/json')
  
  if (req.method === 'OPTIONS'){
    return res.status(200).send()
  } else {
    next()
  }
});

/* Initialize Collections */
router.get('/api/setcollections', collectionsController.createCollections)

/* Public Routes */
router.post('/api/register', authController.createUser)
router.get('/api/activate', authController.activateUser);
router.post('/api/forgot-password', authController.forgotPassword)
router.post('/api/reset-password', authController.resetPassword)
router.post('/api/login', authController.loginUser)

/* Middleware verifying JWT - From here all the routes are protected with authentication */
router.use((req, res, next) => {
  jwtService.tokenVerify(req, res, next);
});

router.get('/api/logout', authController.loginRequired, authController.logoutUser)

/* USER Routes */
router.post('/api/update/account', authController.loginRequired, userController.updateAccount)
router.post('/api/search/users/list', authController.loginRequired, userController.listAllSearchedUsers)
router.get('/api/recommend/users/list', authController.loginRequired, userController.listAllMatchingUsers)
router.get('/api/search/:username', authController.loginRequired, userController.searchUserPublicProfile)
router.get('/api/user/private/', authController.loginRequired, userController.getPrivateInfos)
router.get('/api/user/profile', authController.loginRequired, userController.getPublicInfos)

router.get('/api/user/view/:username', authController.loginRequired, userController.saveUserVisiting)
router.get('/api/user/like/:username', authController.loginRequired, userController.handleLikes)
router.get('/api/user/unlike/:username', authController.loginRequired, userController.unlikeUser)
router.get('/api/user/block/:username', authController.loginRequired, userController.blockUser)
router.get('/api/user/unblock/:username', authController.loginRequired, userController.unblockUser)
router.get('/api/user/report/:username', authController.loginRequired, reportController.reportUser)

/* User notifications values */
router.get('/api/user/views/default', authController.loginRequired, userController.setViewsToDefault)
router.get('/api/user/likes/default', authController.loginRequired, userController.setLikesToDefault)
router.get('/api/user/unlikes/default', authController.loginRequired, userController.setUnlikesToDefault)
router.get('/api/user/matches/default', authController.loginRequired, userController.setMatchesToDefault)
router.get('/api/user/messages/default', authController.loginRequired, userController.setMessagesToDefault)

router.post('/api/edit/names', authController.loginRequired, userController.editUserNames)
router.post('/api/edit/bio', authController.loginRequired, userController.editUserBio)
router.post('/api/edit/gender', authController.loginRequired, userController.editUserGender)
router.post('/api/edit/orientation', authController.loginRequired, userController.editUserOrientation)
router.post('/api/edit/interests', authController.loginRequired, userController.editUserInterests)
router.post('/api/edit/birthdate', authController.loginRequired, userController.setUserBirthdate)
router.post('/api/search/location', authController.loginRequired, userController.searchLocation)

/* MESSAGES */
router.post('/api/message/', authController.loginRequired, messagesController.saveMessage);

/* FILES */
router.post('/api/images', authController.loginRequired, upload.single('file'), filesController.fileUpload)
router.post('/api/images/delete', authController.loginRequired, filesController.fileRemove)

/* TAGS collection*/
router.get('/api/tags', authController.loginRequired, tagsController.getTagsList)

module.exports = router