// Passport config goes here
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');

module.exports = function PassportConfig (passport) {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => done(err, user));
  });

  // Local Strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (emailAddress, password, done) => {
    User.getUserByEmail(emailAddress)
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
}
