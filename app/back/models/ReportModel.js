'use strict'

const report = {
  addUserToReportedList: (db, user, username) => {
    return new Promise((resolve, reject) => {
      const obj = {
        reported: username,
        by: user.username
      }

      db.collection('reports').insert({user: obj}).then(() => {
        return resolve('added to reported list')
      })
      .catch((error) => {
        return reject(error)
      })
    })
  }
}

module.exports = report