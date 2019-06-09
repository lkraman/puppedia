const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');

module.exports = {

  signUp(req, res, next) {
    res.render("users/sign_up");
  },

  create(req, res, next) {

    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        //send email
        sgMail.setApiKey('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');
        const msg = {
          to: req.body.email,
          from: 'gray2884@gmail.com',
          subject: "You've created an account on Blocipiedia",
          text: 'Thanks for joining!',
          html: '<strong>Hope to see you around!</strong>',
        };

        sgMail.send(msg);

        //sign in
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        });
      }
    });
  },

  signInForm(req, res, next) {
    res.render("users/sign_in");
  },

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function () {
      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },


}