const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');


module.exports = {
  signUp(req, res, next){
    res.render("users/sign_up");
  },
  create(req, res, next){
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
           from: 'test@example.com',
           subject: 'Sending with Twilio SendGrid is Fun',
           text: 'and easy to do anywhere, even with Node.js',
           html: '<strong>and easy to do anywhere, even with Node.js</strong>',
             };
             sgMail.send(msg);

             passport.authenticate("local")(req, res, () => {
              req.flash("notice", "You've successfully signed in!");
              res.redirect("/");
            });
          }
        });
      }
    }