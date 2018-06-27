const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const { Users } = require('../models')

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        Users.findById(id)
            .then((user) => {
                done(null, user.toJson())
            }).catch((err) => {
                done(err)
            })
    })

    passport.use('local', new LocalStrategy((username, password, done) => {
        Users.findOne({
            where: {
                username: username
            }
        }).then((user) => {
            if (!user) return done(null, false)
            if (!user.validatePassword(password)) return done(null, false)
            return done(null, user.toJson())
        }).catch((err) => {
            return done(err)
        })
    }))

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.secret
    }, (jwtPayload, done) => {
        return Users.findById(jwtPayload.id)
            .then(user => {
                return done(null, user.toJson())
            }).catch(err => {
                return done(err)
            })
    }))
}