const bcrypt = require("bcryptjs");

module.exports = {

  ensureAuthenticated(req, res, next) {
    if (!req.user){
      req.flash("notice", "To get the full experience, you must create an account.")
      return res.redirect("/users/sign_in");
    } else {
      next();
    }
  },

  comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
  }
}