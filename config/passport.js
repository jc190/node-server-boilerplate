// ---------------------------------------------------------
// Passport config goes here
// TODO: Try to flatten or rework promises in strategy logic
// ---------------------------------------------------------
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/users');
const config = require('./api.js');

module.exports = (passport) => {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });

  // Local Strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (emailAddress, password, done) => {
    User.findUserByEmail(email)
      .then((user) => {
        if (!user) return done(null, false, { message: 'User not found.' });
        User.checkPassword(password, user.accounts.local.password)
          .then((isMatch) => {
            if (isMatch === false) return done(null, false, { message: 'Incorrect password.' });
            return done(null, user);
          })
          .catch((err) => { if (err) throw err });
      })
      .catch((err) => { if (err) throw err });
  }));

  // Facebook Strategy
  passport.use(new FacebookStrategy({
    clientID: config.facebook.id,
    clientSecret: config.facebook.secret,
    callbackURL: 'http://localhost:3001/api/users/login/facebook/return',
    profileFields: ['id', 'displayName', 'email']
  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      // User model logic
      User.findByFacebookID(profile._json.id)
        .then((user) => {
          if (user) return done(null, user);
          const newUser = new User({
            accounts: {
              facebook: {
                id: profile._json.id
              }
            },
            name: {
              first: profile._json.name.split(' ')[0],
              last: profile._json.name.split(' ')[1],
              full: profile._json.name
            },
            email: profile._json.email
          });
          User.createUser(newUser)
            .then((user) => {
              done(null, user);
            })
            .catch((err) => { if (err) throw err });
        })
        .catch((err) => { if (err) throw err });
    });
  }));
}
