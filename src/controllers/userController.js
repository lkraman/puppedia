const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
const stripe = require('stripe')('sk_test_pV36PHtvf07fwqhXrfngSmKY00pts2UQK1');
const keyPublishable = 'pk_test_81nUK1O4tD2VhKyRjkoiCD0a00qa5CUcDZ';

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
      if(err) {
        console.log(err);
        req.flash("error", err);
        res.redirect("/users/sign_up");
      }
      else {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: newUser.email,
          from: 'laurakraman01@gmail.com',
          subject: 'May31 test for Blocipedia',
          text: 'test',
          html: '<strong>test!</strong>',
        };
        sgMail.send(msg);

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
    passport.authenticate("local")(req, res, function() {
      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.")
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

  upgradeForm(req, res, next) {
    res.render('users/upgrade');
  },
  downgradeForm(req, res, next) {
    res.render('users/downgrade');
  },
  upgrade(req, res, next) {
    const token = req.body.stripeToken;
    const charge = stripe.charges.create({
      amount: 1500,
      currency: 'usd',
      description: 'Account upgrade to premium',
      source: token,
    });
    userQueries.upgradeUser(req, (err, user) => {
      if (err) {
        req.flash('error', err);
        res.redirect('/users/upgrade');
      } else {
        req.flash('notice', 'Your account is now premium!');
        res.redirect('/');
      }
    });
  },
  downgrade(req, res, next) {
    userQueries.downgradeUser(req, (err, user) => {
      if (err) {
        req.flash('error', err);
        res.redirect('/users/downgrade');
      } else {
        req.flash('notice', 'You have downgraded your account.');
        res.redirect('/');
      }
    });
  },
};
