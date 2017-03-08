const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');

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
