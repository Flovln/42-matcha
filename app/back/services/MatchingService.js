'use strict'

module.exports = {
  filterMatching: (gender, orientation) => {
    /* Function filtering matching users gender and orientation for curren user */
    let filtered = []

    switch(orientation) {

      case 'Heterosexual':
        filtered.push({
          gender: `${1 - gender}`,
          orientation: {$in: [`${orientation}`, 'Bisexual']}
        })
        break
      
      case 'Homosexual':
        filtered.push({
          gender: `${gender}`,
          orientation: {$in: [`${orientation}`, 'Bisexual']}
        })
        break

      case 'Bisexual':
        filtered.push({
          gender: `${1 - gender}`,
          orientation: {$in: [`${orientation}`, 'Heterosexual']}
        })
        filtered.push({
          gender: `${gender}`,
          orientation: {$in: [`${orientation}`, 'Homosexual']}
        })
        break

      default:
        break
    }

    return filtered
  }
}