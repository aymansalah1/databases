const login = require('../models/login.js')
var jwt = require('jsonwebtoken')
var passport = require("passport")
var passportJWT = require("passport-jwt")
var secret = require("./passport-config.json")
var ExtractJwt = passportJWT.ExtractJwt
var JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromHeader('authorization');
jwtOptions.secretOrKey = secret.secretOrKey
console.log(jwtOptions)

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log('payload received', jwt_payload)

  login.getUserFromID(jwt_payload.id, (error, results) => {
    if (error) {
      console.log(error)
      res.json({ "message": `Couldn't Find User With id=${jwt_payload.id}` })
    }
    if (results[0]) {
      next(null, results[0])
    } else {
      next(null, false)
    }
  })

});

passport.use(strategy);
module.exports = {
  "passport": passport,
  "jwt": jwt,
  "jwtOptions": jwtOptions
};