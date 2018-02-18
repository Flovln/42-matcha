'use strict'
const iplocation = require('iplocation')
const validator = require('validator')
const NodeGeocoder = require('node-geocoder')
//external-ip node package instead of hardcoding

const googleMapkey = require('../config/config.js').googleMapKey
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'AIzaSyCNu-GpyU9q0hJiVzNClVUswq7iX8n2B7g',
  formatter: null
}

const geocoder = NodeGeocoder(options)

const googleMapsClient = require('@google/maps').createClient({
  key: googleMapkey
});

module.exports = {
  locateByAddress: (address) => {
    return new Promise((resolve, reject) => {

      googleMapsClient.geocode({
        address: address
      }, function(err, response) {
        if (!err) {
          return resolve(response.json.results)
        } else {
          return reject('google map geocode request')
        }
      })
    })
  },
  locateByCoords: (location) => {
    return new Promise((resolve, reject) => {

      geocoder.reverse({lat: location.lat, lon: location.lng})
        .then((res) => {
          /* Get address + informations about location points */
          geocoder.reverse({lat: location.lat, lon: location.lng})
            .then((res) => {
              return resolve({lat: location.lat, lng: location.lng, address: res[0].formattedAddress})
            })
            .catch((error) => {
              return reject(error)
            })
        })
        .catch((error) => {
          return reject(error)
        })
    })
  },
  locateByIp: (ip) => {
    return new Promise((resolve, reject) => {

    /* Default location at school since we are running local */
    let location = {
      lat: 48.896607,
      lng: 2.318501,
      address: ''
    }

    /* Ip format checking */
    if (validator.isIP(ip) === false) {
      return (reject(new Error('unvalid ip ' + ip)))
    } else if (!ip) {
      return (reject(new Error('unvalid ip ' + ip)))
    }
    
    /* Get location based on ip */
    iplocation(ip)
      .then((res) => {

        /* If ip is equal to local host, use default location else set new location */
        if ((ip !== '::1') && (ip !== '::ffff:127.0.0.1')) {
          location = {
            lat: res.latitude,
            lng: res.longitude,
            address: ''
          }
        }

        /* Get address + informations about location points */
        geocoder.reverse({lat: location.lat, lon: location.lng})
          .then((res) => {
            return resolve({lat: location.lat, lng: location.lng, address: res[0].formattedAddress})
          })
          .catch((error) => {
            return reject(error)
          })
      })
      .catch((error) => {
        return reject(error)
      })      
    })
  },
  locateUserAtLogin: (ip, user_location) => {
    return new Promise((resolve, reject) => {

      if (user_location.lat && user_location.lng) {

        /* User authorized geolocation from navigator - lat + lng saved */
        module.exports.locateByCoords(user_location)
          .then((location_infos) => {
           return resolve(location_infos)
          })
          .catch((error) => {
            return reject(error)            
          })
      } else {

        /* Get user location using his ip address recovered through req.header[x-forwarded-for]*/
        module.exports.locateByIp(ip)
          .then((location_infos) => {
           return resolve(location_infos)
          })
          .catch((error) => {
            return reject(error)
          })
      }
    })
  }
}