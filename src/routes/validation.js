

module.exports = {
  validateUsers(req, res, next) {
    if(req.method === "POST") {
      req.checkBody("username", "Username must be at least 6 characters in length").isLength({min: 6});
      req.checkBody("email", "Must be a valid email").isEmail();
      req.checkBody("password", "Password must be at least 6 characters long and match confirmation below").isLength({min: 6});
      req.checkBody("passwordConfirmation", "Must match password provided").optional().matches(req.body.password);
    }

    const errors = req.validationErrors();

    if(errors) {
      req.flash("error", errors);
      return res.redirect(303, req.headers.referer);
    }
    else {
      return next();
    }
  },

	validateUsersSignIn(req, res, next) {
		if (req.method === 'POST') {
      req.checkBody("email", "must be a valid email").isEmail();
			req.checkBody('password', 'must be at least 6 characters in length').isLength({ min: 6 });
		}

		const errors = req.validationErrors();

		if (errors) {
      req.flash('error', errors);
      console.log("validation ERRROOOORRRRR")
			return res.redirect(req.headers.referer);
		} else {
			return next();
		}
  },
  
  validateWikis(req, res, next) {
    if(req.method === "POST") {
      req.checkBody("title", "must be at least 2 characters in length").isLength({min: 2});
      req.checkBody("body", "must be at least 10 characters in length").isLength({min: 10});
    }
    const errors = req.validationErrors();
    if(errors){
      req.flash("error", errors);
      return res.redirect(303, req.headers.referer)
    } else {
      return next();
    }
  }
};