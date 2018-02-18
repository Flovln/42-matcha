'use strict'

const tags = {
  getTagsList: (db, user_id, data) => {
    return new Promise((resolve, reject) => {
      db.collection('tags').find().toArray().then((tags) => {
        resolve(tags);
      })
      .catch((error) => {
        reject(error);
      })
    })
  },
  addInterestsToPool: (db, data) => {
    return new Promise((resolve, reject) => {

      if (!data.length) {
        return resolve(data)
      }

      db.collection('tags').find().toArray().then((tags) => {

        let newTags = []
        let result = []

        /* Get new tags to save from request */
        for (let i = 0; i < data.length; i++) {
          let tagToSave = 0

          for (let j = 0; j < tags.length; j++) {
            if (data[i] === tags[j].tag) {
              tagToSave = 1
            }
          }

          if (!tagToSave) {
            db.collection('tags').insert({tag: data[i]}).then(() => {
              result = []
            })
            .catch((error) => {
              result.push = error
            })
          }
        }

        if (!result.length) {
          return resolve()
        } else {
          return reject(result)
        }
        
      })
      .catch((error) => {
        return reject()
      })
    })
  }
}

module.exports = tags