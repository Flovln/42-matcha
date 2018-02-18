'use strict'

/* Policies are use for all the independent checking cases before and related controllers next query */
const policies = {
  validateEmail: (email) => {
    const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    
    if (regex.test(email)) {
      return null;
    } else {
      return ('Please make sure to enter a valid email format.');
    }
  },
  validateUsername: (username) => {
    if (username.length > 6 && username.length < 16) {
      return null;
    } else {
      return ('Please make sure your user name must be in between 7 and 15 characters long.');
    }
  },
  validateNames: (name) => {
    const regex = /^[a-zA-Z éè]{3,32}$/ //Spaces must be valid
    
    if (regex.test(name)) {
      return null;
    } else {
      return ('Please make sure to enter a valid name.');      
    }
  },
  validatePassword: (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    if (password.length < 8) {
      return ('You password has to be at least 8 characters long, must include uppercase and numeric characters.')
    } else if (password.toLowerCase() === password) {
      return ('You password has to be at least 8 characters long, must include uppercase and numeric characters.')
    }

    if (regex.test(password)) {
      return null;
    } else {
      return ('You password has to be at least 8 characters long, must include uppercase and numeric characters.');      
    }
  }
}

module.exports = policies;