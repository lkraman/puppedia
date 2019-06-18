const User = require("./models").User;
const bcrypt = require("bcryptjs");



module.exports = {
    createUser(newUser, callback){
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);
        return User.create({
            username: newUser.username,
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {
            callback(null, user); 
        })
        .catch((err) => {
          callback(err);
        })

    },

    upgradeUser(req, callback) {
        return User.findOne({ where: { id: req.user.id } }).then((user) => {
          if (user) {
            user.update({ role: 1 }).then((updatedUser) => {
              callback(null, updatedUser);
            })
              .catch((err) => {
                callback(err);
              });
          } else {
            return callback('No user found.');
          }
        });
      },

      downgradeUser(req, callback) {
        return User.findOne({ where: { id: req.user.id } }).then((user) => {
          if (user) {
            user.update({ role: 0 }).then((updatedUser) => {
              callback(null, updatedUser);
            })
              .catch((err) => {
                callback(err);
              });
          } else {
            callback('No user found.');
          }
        });
      },
    };
