const bcrypt = require("bcryptjs");

module.exports = {

  ensureAuthenticated(req, res, next) {
    if (!req.user){
      req.flash("notice", "Validation error")
      return res.redirect("/users/sign_up");
    } else {
      next();
    }
  },

  comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
  }
}