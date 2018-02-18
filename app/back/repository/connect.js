const mongoClient = require('mongodb').MongoClient

const db = {
  connect: (connectionSettings) => {
    return new Promise((resolve, reject) => {
      if (!connectionSettings.host) throw new Error("A host must be specified")
      if (!connectionSettings.name) throw new Error("A host name must be specified")

      mongoClient.connect(connectionSettings.host + connectionSettings.name)
        .then(db => {
          console.log('Mongo successfully connected on ', connectionSettings.host + connectionSettings.name)
          resolve(db)
        }).catch(err => {
          console.error('Mongo connection failed ', err)
          reject()
        })
    })
  }
}

module.exports = db