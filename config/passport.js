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
}, async function(username, password, cb){
	// console.log("username",username);
	var users = await User.find({username: username}).populate('employeeId').populate('role');
	if (users.length > 0) {
		var user = users[0];
		if(!user) return cb(null, false, {message: 'Username not found'});
		bcrypt.compare(password, user.password, function(err, res) {
			if(!res) return cb(null, false, { message: 'Invalid Password' });
			// console.log("user: ", user);
			let userDetails = {
				username: user.username,
				id: user.id,
				role: user.role,
				employee: user.employeeId,
				token: jwt.sign({ username: user.username, userid: user.id }, 'BRIOTTMMLMACHINESHOPWIPIIOT'),
			};
			return cb(null, userDetails, { message: 'Login Successful'});
		});
	} else {
		return cb(null, false, {message: 'Username not found'});
	}
	/*User.findOne({username: username}, function(err, user) {
		// console.log(user);
		if(err) return cb(err);
		if(!user) return cb(null, false, {message: 'Username not found'});
		bcrypt.compare(password, user.password, function(err, res){
			if(!res) return cb(null, false, { message: 'Invalid Password' });
			console.log("user: ", user.populate('employeeId'));
			let userDetails = {
				username: user.username,
				id: user.id,
				role: user.role,
				// employee: user.employeeId.fetch(),
				token: jwt.sign({ username: user.username, userid: user.id }, 'BRIOTTMMLMACHINESHOPWIPIIOT'),
			};
			return cb(null, userDetails, { message: 'Login Successful'});
		});
	});*/
}));
