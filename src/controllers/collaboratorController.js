const collaboratorQueries = require("../../src/db/queries.collaborators.js");


module.exports = {
  add(req, res, next) {
    if (req.user) {
      collaboratorQueries.addCollaborator(req, (err, collaborator) => {
        if (err) {
          req.flash("error", err)
        }
        res.redirect(req.headers.referer)
      })

    } else {
      req.flash("notice", "Please sign in to do that.");
      res.redirect(req.headers.referer);
    }
  },

  remove(req, res, next) {
    if (req.user) {
      collaboratorQueries.removeCollaborator(req, (err, collaborator) => {
        if (err) {
          req.flash("error", err);
        }
        req.flash("notice", "This user is no longer a collaborator");
        res.redirect(req.headers.referer);
      });

    } else {
      req.flash("notice", "Please sign in to do that.");
      res.redirect(req.headers.referer);
    }
  }

}