const Collaborator = require("../../src/db/models").Collaborator;
const User = require("../../src/db/models").User;

module.exports = {
  addCollaborator(req, callback) {
    User.findOne({
      where: {
        email: req.body.addCollaborator
      }
    })
      .then((user) => {
        if (!user) {
          return callback("User not found");

        } else if (user.id === req.user.id) {
          return callback("You cannot declare yourself as a collaborator");
        }
        Collaborator.findOne({
          where: {
            userId: user.id,
            wikiId: req.params.id
          }
        })
          .then((collaborator) => {
            if (collaborator) {
              return callback("User is already a collaborator")
            }
            return Collaborator.create({
              wikiId: req.params.id,
              userId: user.id
            })
              .then((collaborator) => {
                callback(null, collaborator);
              })
              .catch((err) => {
                callback(null, err);
              })
          })
          .catch((err) => {
            callback(null, err)
          })
      })
      .catch((err) => {
        callback(err);
      })
  },

  removeCollaborator(req, callback) {
    Collaborator.destroy({
      where: {
        userId: req.params.userId
      }
    })
      .then((deleted) => {
        callback(null, deleted);
      })
      .catch((err) => {
        callback(err);
      });
  }

}