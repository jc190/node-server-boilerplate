const mongoose = require('mongoose');
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
      email: String,
      password: String
    },
    facebook: {
      id: String,
      name: String
    }
  }
});

const User = module.exports = mongoose.model('User', userSchema);
