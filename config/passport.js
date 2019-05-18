var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});
passport.deserializeUser(function(id, cb){
	User.findOne({id}, function(err, user) {
		cb(err, user);
	});
});
passport.use(new LocalStrategy({
	usernameField: 'username',
	passportField: 'password'
}, function(username, password, cb){
	console.log("username",username);
	User.findOne({username: username}, function(err, user){
		console.log(user);
		if(err) return cb(err);
		if(!user) return cb(null, false, {message: 'Username not found'});
		bcrypt.compare(password, user.password, function(err, res){
			if(!res) return cb(null, false, { message: 'Invalid Password' });
			let userDetails = {
				username: user.username,
				id: user.id,
				token: jwt.sign({ username: user.username }, 'BRIOTTMMLMACHINESHOPWIPIIOT'),
			};
			return cb(null, userDetails, { message: 'Login Succesful'});
		});
	});
}));

