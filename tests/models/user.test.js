const test = require('tape');
const mongoose = require('mongoose');
const User = require('../../models/users');

// Define mongoose promise library
mongoose.Promise = global.Promise;

test('Create new user.', (t) => {
  // t.plan must account for all assertations in scope
  t.plan(2);
  // Connect to database
  mongoose.connect('mongodb://localhost:27017/test')
    .then(() => {
      // Check to see if connection is ready
      t.equal(mongoose.connection.readyState, 1);

      // Create new user with Schema defined in ../models/users
      const newUser = new User({
        displayName: 'Helloworld'
      });
      User.createUser(newUser)
        .then((user) => {
          // Check that the new user was saved to database
          t.equal(user.displayName, newUser.displayName)
          // Clean up
          mongoose.connection.db.dropCollection('users')
            .then(() => {
              mongoose.connection.close();
            });
        });
      });
});

// Test user update
// t.test('Update user', (q) => {})

// Test user deletion
// t.test('Delete user', (q) => {})
