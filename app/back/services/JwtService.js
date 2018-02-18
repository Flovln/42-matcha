"use strict"
const jwt = require('jsonwebtoken');

module.exports = {
  tokenVerify: (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
  
    if (token) {

      if (token === 'null' || token === undefined) {
        console.log('NULL TOKEN SENT')
        return res.status(200).send({message: 'null content'});
      }

      jwt.verify(token, req.app.get('secretApi'), (err, decoded) => {
        
        if (err) {
          console.log('error: ', err)
          return res.status(403).send({ error: 'Wrong token : ' + err });
//            return res.status(200).send({ error: 'Wrong token : ' + err });
        } else {
          req.decoded = decoded;
          next();        
        }      
      })
    } else {
      return res.status(401).send({ error: 'No token sent, token is mandatory for this route' });    
    }
  },
  tokenSign: (app, data) => {
    return jwt.sign({user_id: data._id, username: data.login, active: true, auth: true}, app.get('secretApi'), {
//      expiresIn: (120000) //2 minutes    
      expiresIn: (60 * 60 * 24) //1 year   
    });
  }
}