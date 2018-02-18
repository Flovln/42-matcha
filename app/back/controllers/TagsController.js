'use strict'

const tagsModel = require('../models/TagsModel')

const tags = {
  getTagsList: (req, res) => {
    tagsModel.getTagsList(req.app.db, req.decoded.user_id).then((tags) => {
      res.status(200).json({ tags_pool: tags});
    }).catch((error) => {
      res.status(500).json({ error: error });
    });
  }
}

module.exports = tags