'use strict'

const collections = {
  createCollections: (req, res) => {
    req.app.db.createCollection("users");
    req.app.db.createCollection("tags");
    req.app.db.createCollection("reports");
    /* This unique index is needed to enable Geospatial Queries on the user collection */
    req.app.db.collection('users').createIndex({location: "2dsphere"}).then(() => {
      res.status(200).json({ message: 'collections created' })
    })
    .catch((error) => {
      console.log('Error creating 2dsphere index in user collection ' + error)
    })          
  }
}

module.exports = collections;