const config = {
  database: {
    name: 'matcha-db',
    host: 'mongodb://localhost/'
  },
  server: {
    host: 'localhost',
    port: 3000
  },
  frontServer: {
    host: 'localhost',
    port: 8080
  },
  secretAuthpwd: 'supermatcha',
  application_address: 'http://localhost:',
  googleMapKey: 'AIzaSyCNu-GpyU9q0hJiVzNClVUswq7iX8n2B7g'
}

module.exports = config