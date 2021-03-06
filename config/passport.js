const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const User = require('../app/models/user')
const configAuth = require('./auth')

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'displayName', 'photos', 'email', 'first_name', 'last_name'],
    passReqToCallback: true

  }, (req, token, refreshToken, profile, done) => {
    process.nextTick(() => {
      if (!req.user) {
        User.findOne({'facebook.id': profile.id}, (err, user) => {
          if (err) return done(err)

          if (user) {
            return done(null, user)
          } else {
            let newUser = new User()

            newUser.facebook.id = profile.id
            newUser.facebook.token = token
            newUser.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`
            newUser.facebook.email = profile.emails[0].value

            newUser.save((err) => {
              if (err) throw err
              return done(null, newUser)
            })
          }
        })
      } else {
        req.user.facebook.id = profile.id
        req.user.facebook.token = token
        req.user.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`
        req.user.facebook.email = profile.emails[0].value

        req.user.save((err) => {
          if (err) throw err
          return done(null, req.user)
        })
      }
    })
  }))

  passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
    passReqToCallback: true
  },
  (req, token, refreshToken, profile, done) => {
    process.nextTick(() => {
      if (!req.user) {
        User.findOne({ 'google.id': profile.id }, (err, user) => {
          if (err) { return done(err) }

          if (user) {
            return done(null, user)
          } else {
            let newUser = new User()

            newUser.google.id = profile.id
            newUser.google.token = token
            newUser.google.name = profile.displayName
            newUser.google.email = profile.emails[0].value

            newUser.save((err) => {
              if (err) { throw err }
              return done(null, newUser)
            })
          }
        })
      } else {
        req.user.google.id = profile.id
        req.user.google.token = token
        req.user.google.name = profile.displayName
        req.user.google.email = profile.emails[0].value

        req.user.save((err) => {
          if (err) { throw err }
          return done(null, req.user)
        })
      }
    })
  }))

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    process.nextTick(() => {
      if (!req.user) {
        User.findOne({'local.email': email}, (err, user) => {
          if (err) return done(err)

          if (user) {
            return done(null, false, req.flash('signupMessage', 'The email is already taken.'))
          } else {
            let newUser = new User()
            newUser.local.email = email
            newUser.local.password = newUser.generateHash(password)

            newUser.save((err) => {
              if (err) throw err
              return done(null, newUser)
            })
          }
        })
      } else {
        req.user.local.email = email
        req.user.local.password = req.user.generateHash(password)

        req.user.save((err) => {
          if (err) throw err
          return done(null, req.user)
        })
      }
    })
  }
  ))

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({ 'local.email': email }, (err, user) => {
      if (err) return done(err)

      if (!user) { return done(null, false, req.flash('loginMessage', 'No user found.')) }

      if (!user.validPassword(password, user)) { return done(null, false, req.flash('loginMessage', 'Oops, wrong password.')) }

      return done(null, user)
    })
  }))
}
