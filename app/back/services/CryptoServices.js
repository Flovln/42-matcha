'use strict'

const crypto = require('crypto');

module.exports = {
  createSalt: (length) => {
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0,length);
  },
  createHash: (password, salt) => {
    const hash = crypto.createHmac('sha256', salt)
                  .update(password);
    const value = hash.digest('hex');
    return { salt: salt, hashPassword: value }
  }
}