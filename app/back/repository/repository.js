const mongoClient = require('mongodb').MongoClient

const config = require('../config/config.js')

class Repository {
  constructor(connectionSettings) {
    this.connectionSettings = connectionSettings
    this.db = mongoClient.connect(this.connectionSettings.host + this.connectionSettings.name)
  }

  getDb() {
    return this.db
  }

  disconnect() {
    this.db.close()
  }
}

module.exports.connect = (connectionSettings) => {
  return new Promise((resolve, reject) => {
    if (!connectionSettings.host) throw new Error("A host must be specified")
    if (!connectionSettings.name) throw new Error("A host name must be specified")
    resolve(new Repository(connectionSettings))
  })  
}