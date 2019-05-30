const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../db/models").User;
const authHelper = require("../auth/helpers");


module.exports = {
	init(app) {
		
		app.use(passport.initialize());
		app.use(passport.session());

		
		passport.use(
			new LocalStrategy(
				{
					usernameField: 'username',
					passReqToCallback : true,
				},
				(req, username, password, done) => {
					User.findOne({
						where: { username },
					}).then(user => {
					
						if (!user || !authHelper.comparePass(password, user.password)) {
							return done(null, false, { message: 'Invalid username or password' });
						}
					
						return done(null, user);
					});
				},
			),
		);


		passport.serializeUser((user, callback) => {
			callback(null, user.id);
		});

		
		passport.deserializeUser((id, callback) => {
			User.findByPk(id)
				.then(user => {
					callback(null, user);
				})
				.catch(err => {
					callback(err, user);
				});
		});
  },
};