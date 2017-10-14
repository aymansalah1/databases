
const login = require('../models/login')
const deserializeLogin = require('../util/deserializeLogin')
const passport = require('../secret/passport')

module.exports = {
    login: (request, response) => {
        const info = deserializeLogin(request, response)
        if (info == null) { return }

        login.loginCheck(info.userName, info.password, (error, results) => {
            if (error) {
                response.status(401)
                response.json({ error: 'invalid Credentials' })
            } else {
                let payload = { "id": results[0].is }
                let token = passport.jwt.sign(payload, passport.jwtOptions.secretOrKey)
                console.log(passport.jwtOptions.secretOrKey)
                response.json({ "message": "ok", "token": token })
            }


        })
    },
    signUp:(request, response) => {
        const info = deserializeLogin(request, response)
        if (info == null) { return }

        login.signUp(info.userName, info.password, (error, results) => {
            if (error) {
                response.status(401)
                response.json({ error: 'invalid Credentials' })
            } else {
                let payload = { "id": results[0].id}
                let token = passport.jwt.sign(payload, passport.jwtOptions.secretOrKey)
                console.log(passport.jwtOptions.secretOrKey)
                response.json({ "message": "ok", "token": token })
            }


        })
    }
}