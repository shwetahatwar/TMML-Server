var passport = require('passport');
module.exports = {
	login: function(req, res) {
    // var user = req.body;
    console.log("In");
    // console.log("At authenticate: ", req.body);
    passport.authenticate('local', function(err, user, info){
      // console.log("inside authenticate " , user, "\n", err, "\n", info);
      if((err) || (!user)) {
        return res.send({
          message: info.message,
          user
        });
      }
			req.logIn(user, function(err) {
        if(err) res.send(err);
        return res.send({
          message: info.message,
          user
        });
      });
    })(req, res);
  },
	logout: function(req, res) {
    req.logout();
    res.redirect('/');
  },
  
};

