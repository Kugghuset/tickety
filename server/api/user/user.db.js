'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');
var bcrypt = require('bcryptjs');

var util = require('../../utils/utils');

function intialize() {
  return sql.execute({
    query: sql.fromFile('./sql/user.initialize.sql')
  })
  .then(function (result) {
    util.log('User table all set up.');
  })
  .catch(function (err) {
    util.log('Couldn\'t set up User table.');
    util.log(err);
  });
}

/**
 * @param {Number} id
 * @return {Promise} -> {Object} (User)
 */
exports.findById = function (id) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/user.findById.sql'),
      params: {
        userId: {
          type: sql.BIGINT,
          val: id
        }
      }
    })
    .then(function (users) {
      resolve(util.objectify(users[0]));
    })
    .catch(reject);
  });
}

/**
 * @param {String} email
 * @return {Promise} -> {Object} (User)
 */
exports.findByEmail = function (email) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/user.findByEmail.sql'),
      params: {
        email: {
          type: sql.VARCHAR(256),
          val: email ? email.toLowerCase() : email
        }
      }
    })
    .then(function (users) {
      if (users) {
        resolve(util.objectify(users[0]));
      } else {
        reject(new Error('No could be found with the email ' + email));
      }
    })
    .catch(reject);
  });
}

/**
 * @param {Object} user
 * @return {Promise} -> {Object} (User)
 */
exports.create = function (_user) {
  return new Promise(function (resolve, reject) {
      // Ensure _user is an object
    if (!_.isObject(_user)) { _user = {}; }

    if (!_user.email) {
      return reject(new Error('Email is requried'));
    } else if (!_user.password) {
      reject(new Error('Password is required'));
    }

    // Generate the password hash
    bcrypt.hash(_user.password, 10, function (err, hashedPassword) {
      if (err) { return reject(err); }

      return sql.execute({
        query: sql.fromFile('./sql/user.insert.sql'),
        params: {
          email: {
            type: sql.VARCHAR(256),
            val: _user.email ? _user.email.toLowerCase() : _user.email
          },
          password: {
            type: sql.VARCHAR(256),
            val: hashedPassword,
          },
          name: {
            type: sql.VARCHAR(256),
            val: _user.name
          },
          departmentId: {
            type: sql.BIGINT,
            val: _user.department ? _user.department.departmentId : _user.departmentId
          }
        }
      })
      .then(function (user) {
        resolve(user[0] || user);
      })
      .catch(reject);

    });
  });
}

/**
 * Authenticates the user using email and password.
 *
 * @param {String} email User email address
 * @param {String} password Raw password
 * @return {Promise<{}>}
 */
exports.auth = function(email, password) {
  return new Promise(function (resolve, reject) {
    sql.execute({
        query: sql.fromFile('./sql/user.findByEmail.sql'),
        params: {
          email: {
            type: sql.VARCHAR(256),
            val: email ? email.toLowerCase() : email
          }
        }
      })
      .then(function (users) {

        // Get first item and create objects by dot notation
        var _user = util.objectify(_.first(users));

        if (!users || !users.length) {
          // No users matching the email address.
          return resolve(undefined);
        } else if (!password && !_user.password) {
          // No passwords at all - none input and none stored, so it's fine! (for now)
          return resolve(_user);
        } else if (!_user) {
          return reject(password ? new Error('Incorrect password') : new Error('Password is required'));;
        }

        bcrypt.compare(password, _user.password, function (err, isCorrect) {
          if (err) { return reject(err); }

          if (isCorrect) {
            resolve(_user);
          } else {
            reject(password ? new Error('Incorrect password') : new Error('Password is required'));
          }
        });
      })
      .catch(reject);
  });
}

exports.update = function (user, userId) {
  return new Promise(function (resolve, reject) {

    // No user to update :(
    if (!user) { return reject(new Error('No data provided')); }

    if (!userId) { userId = user.userId; }

    sql.execute({
      query: [
        sql.fromFile('./sql/user.update.sql'),
        sql.fromFile('./sql/user.findById.sql')
      ].join(' '),
      params: {
        email: {
          type: sql.VARCHAR(256),
          val: user.email ? user.email.toLowerCase() : user.email
        },
        name: {
          type: sql.VARCHAR(256),
          val: user.name
        },
        departmentId: {
          type: sql.BIGINT,
          val: user.department ? user.department.departmentId : user.departmentId
        },
        role: {
          type: sql.TINYINT,
          val: user.role
        },
        userId: {
          type: sql.BIGINT,
          val: userId
        }
      }
    })
    .then(function (_users) {
      resolve(util.objectify(_.first(_users)));
    })
    .catch(reject);
  });
}

exports.updateLastLoggedIn = function (_user) {
  return new Promise(function (resolve, reject) {

    if (!_user) { return reject(new Error('No provided user')); }

    sql.execute({
      query: sql.fromFile('./sql/user.updateLastLoggedIn.sql'),
      params: {
        userId: {
          type: sql.BIGINT,
          val: _user.userId
        }
      }
    })
    .then(function (users) {
      // Really only returns one, but whatever.
      resolve(_.first(util.objectify(users)));
    })
    .catch(reject);

  });
}

exports.setPassword = function (userId, currentPass, password) {
  return new Promise(function (resolve, reject) {
    this.findById(userId)
    .then(function (user) {
      return new Promise(function (resolve, reject) {

        // Check for user
        if (!user || _.isEqual({}, user)) {
          // No users, which is problematic
          return reject(new Error('User not found.'));
        }

        // Check the passwords
        bcrypt.compare(currentPass, user.password, function (err, isCorrect) {
          // Check for errors
          if (err) { return reject(err); }
          if (!isCorrect) {
            // The provided password doesn't match the stored one
            return reject(new Error('Password doesn\'t match current password.'));
          }

          // Hash the password
          bcrypt.hash(password, 10, function (err, hashedPassword) {
            // Handle possible error
            if (err) { return reject(err); }

            // Everything went well, resolve the query object.
            resolve({
              query: sql.fromFile('./sql/user.setPassword.sql'),
              params: {
                password: {
                  type: sql.VARCHAR(256),
                  val: hashedPassword
                },
                userId: {
                  type: sql.BIGINT,
                  val: userId
                },
              },
            });
          });

        });
      });
    })
    .then(sql.execute)
    .then(resolve)
    .catch(reject);
  }.bind(this));
}

/**
 * Gets all users
 *
 * @return {Promise} -> {Array}
 */
exports.getAll = function () {
  return new Promise(function (resolve, reject) {

    sql.execute({
      query: sql.fromFile('./sql/user.getAll.sql')
    })
    .then(function (users) {
      resolve(util.objectify(users));
    })
    .catch(reject);

  });
}

/**
 * @param {String} fuzz Fuzzyness to match against users' name
 * @return {Promise} -> {}[]
 */
exports.getFuzzy = function (fuzz) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/user.getFuzzy.sql'),
      params: {
        fuzz: {
          type: sql.VARCHAR,
          val: fuzz,
        },
      },
    })
    .then(function (users) {
      resolve(util.objectify(users));
    })
    .then(reject);
  });
}

// Initialize the table
intialize();