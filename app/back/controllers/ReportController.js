'use strict'

const reportModel = require('../models/ReportModel')

const report = {
  reportUser: (req, res) => {
    const username = req.params.username

    reportModel.addUserToReportedList(req.app.db, req.decoded, username).then((message) => {
      res.status(200).json({ message: message});
    })
    .catch((err) => {
      res.status(500).json({ error: err});
    })
  }
}

module.exports = report