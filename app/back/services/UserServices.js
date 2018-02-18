'use strict'

const ObjectId = require('mongodb').ObjectId;

const policies = {
  normalizeTagsArray: (data) => {
    return new Promise((resolve, reject) => {

      if (!data.length) {
        return resolve(data)
      }
      /* Save all tags sent by user as an array */
      let tags = []

      for (let i =0; i < data.length; i++){
        if (typeof(data[i]) === 'object') {
          tags.push(data[i].tag)
        } else {
          tags.push(data[i])
        }
      }
      /* Create a new array with no double values */
      let normalized = []

      for(let i = 0; i < tags.length; i++) {
        let uniqueTag = 0;

        if (!normalized.length) {
          normalized.push(tags[i])
        } else {
          for (let j = 0; j < normalized.length; j++) {
            if (tags[i] === normalized[j]) {
              uniqueTag = 1;
            }
          }
          if (!uniqueTag) {
            normalized.push(tags[i])
          }
        }
      }
      return resolve(normalized)
    })
  }
}

module.exports = policies;