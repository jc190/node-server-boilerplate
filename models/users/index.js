const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  displayName: String,
  name: {
    first: String,
    last: String,
    full: String
  },
  email: String,
  accounts: {
    local: {
      password: String
    },
    facebook: {
      id: String
    }
  }
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = (user) => {
  return user.save();
};

module.exports.findUserByEmail = (email) => {
   return User.findOne({ email: email }).exec();
};

module.exports.findByFacebookID = (id) => {
   return User.findOne({ 'accounts.facebook.id': id }).exec();
};
